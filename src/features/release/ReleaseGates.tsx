'use client'
import {useEffect,useMemo,useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {useTranslations} from 'next-intl'
import {LockKeyhole,ShieldAlert} from 'lucide-react'
import {PageHeading,StatusPill,EmptyState} from '@/components/assurance/shared'
import {releasePolicies,systems,session} from '@/data/demo'
import {evaluateMetric} from '@/services/monitoring'
import {assuranceRepository} from '@/repositories/assurance'
import {evaluateReleaseGate} from '@/services/release'
import {createReleaseOverride,effectiveReleaseDecision} from '@/services/release/override'
import {workflowRepository} from '@/repositories/workflow'
import {hasPermission} from '@/lib/permissions'
import {useWorkspace} from '@/components/shell/WorkspaceShell'
import {Link} from '@/i18n/routing'
import type {ReleaseOverride} from '@/domain/models'
const schema=z.object({owner:z.string().trim().min(2),rationale:z.string().trim().min(12),expiresAt:z.string().min(1)})
type OverrideForm=z.infer<typeof schema>
export function ReleaseGates(){
 const t=useTranslations();const {organizationId}=useWorkspace();const orgSystems=systems.filter(system=>system.organizationId===organizationId);const policy=releasePolicies.find(item=>item.organizationId===organizationId)!
 const [openForm,setOpenForm]=useState('');const [overrides,setOverrides]=useState<ReleaseOverride[]>([]);const [now,setNow]=useState(new Date().toISOString());const [overrideError,setOverrideError]=useState('')
 useEffect(()=>{setOverrides(assuranceRepository.releaseOverrides().filter(item=>item.organizationId===organizationId))},[organizationId])
 useEffect(()=>{const timer=window.setInterval(()=>setNow(new Date().toISOString()),30000);return()=>window.clearInterval(timer)},[])
 const metricsNow=useMemo(()=>assuranceRepository.metrics().filter(metric=>orgSystems.some(system=>system.id===metric.systemId)).map(evaluateMetric),[orgSystems])
 const findingNow=workflowRepository.findings(organizationId)
 const gates=orgSystems.map(system=>evaluateReleaseGate(organizationId,system.id,system.activeVersionId,policy,findingNow,metricsNow,assuranceRepository.results(),now,assuranceRepository.evaluations()))
 const form=useForm<OverrideForm>({resolver:zodResolver(schema),defaultValues:{owner:'',rationale:'',expiresAt:''}})
 const allowed=hasPermission(session.role,'release:approve')
 const submit=form.handleSubmit(values=>{
  const gate=gates.find(item=>item.id===openForm);if(!gate)return
  const systemFindings=findingNow.filter(finding=>finding.systemId===gate.systemId)
  try{
   const created=createReleaseOverride({organizationId,gateId:gate.id,owner:values.owner,rationale:values.rationale,expiresAt:new Date(`${values.expiresAt}T23:59:59.999Z`).toISOString(),approvedBy:session.name,role:session.role,findings:systemFindings},now)
   const saved=assuranceRepository.addReleaseOverride(created.override,created.riskAcceptances,created.audit)
   workflowRepository.audit(created.audit);setOverrides(saved.overrides.filter(item=>item.organizationId===organizationId));setOpenForm('');setOverrideError('');form.reset()
  }catch(error){setOverrideError(error instanceof Error?error.message:'Override could not be recorded.')}
 })
 const blocked=gates.filter(gate=>effectiveReleaseDecision(gate,overrides,now)==='BLOCKED').length
 return <><PageHeading namespace="release" titleKey="title" subtitleKey="subtitle"/><section className="release-alert"><span><LockKeyhole size={20}/></span><div><b>{blocked} {t('ui.releasesBlocked')}</b><p>{t('ui.gatesRecomputed')}</p></div></section><section className="panel"><h2>{t('release.policy')}: {policy.name}</h2>{gates.length?gates.map(gate=>{
  const system=orgSystems.find(item=>item.id===gate.systemId)!;const gateOverrides=overrides.filter(item=>item.gateId===gate.id).sort((a,b)=>b.timestamp.localeCompare(a.timestamp));const override=gateOverrides[0];const active=effectiveReleaseDecision(gate,overrides,now)==='READY'&&gate.decision==='BLOCKED'
  return <article className="release-row" key={gate.id}><span className="release-icon"><LockKeyhole size={17}/></span><span className="release-name"><b>{system.name}</b><small>{system.versions.find(version=>version.id===system.activeVersionId)?.version}</small></span><StatusPill status={active?'READY':gate.decision}/><span className="release-note">{override?`${active?t('ui.overrideActive'):t('ui.overrideExpired')} · ${override.owner} · ${override.expiresAt}`:gate.reasons.join('; ')||t('ui.noBlockingConditions')}</span><button className="btn outline" onClick={()=>{setOpenForm(gate.id);setOverrideError('')}} disabled={gate.decision!=='BLOCKED'||!allowed}>{t('release.override')}</button>{openForm===gate.id&&<form className="override-form" onSubmit={submit}><label>{t('ui.accountableOwner')}<input {...form.register('owner')}/></label><label>{t('ui.rationale')}<input {...form.register('rationale')}/>{form.formState.errors.rationale&&<small>{t('ui.rationaleMin')}</small>}</label><label>{t('ui.expiryDate')}<input type="date" {...form.register('expiresAt')}/></label>{overrideError&&<p role="alert">{overrideError}</p>}<button className="btn primary">{t('ui.recordOverride')}</button><button type="button" className="btn outline" onClick={()=>setOpenForm('')}>{t('common.close')}</button></form>}<div className="gate-reasons">{gate.reasons.map(reason=><p key={reason}><ShieldAlert size={14}/>{reason}</p>)}{findingNow.filter(finding=>finding.systemId===gate.systemId).map(finding=><p key={finding.id}><Link href={`/findings?finding=${finding.id}` as never}>{finding.title}</Link> · <StatusPill status={finding.status}/></p>)}</div></article>
 }):<EmptyState>{t('ui.noSystemsOrg')}</EmptyState>}</section><section className="panel"><h2>{t('release.policy')}</h2>{policy.rules.map(rule=><p key={rule.id}><StatusPill status={rule.condition}/> → <StatusPill status={rule.action}/> · <StatusPill status={rule.enabled?'ACTIVE':'DISABLED'}/></p>)}<p className="notice-box">{t('release.overrideInfo')} {t('ui.overrideKeepsAssessment')}</p></section></>
}
