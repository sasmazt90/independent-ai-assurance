'use client'
import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useWorkspace } from '@/components/shell/WorkspaceShell'
import { PageHeading, StatusPill, EmptyState, InfoTooltip } from '@/components/assurance/shared'
import { systems, metrics, evidence, findings, results, controls, frameworks, requirements, mappings } from '@/data/demo'
import { assessSystemRisk } from '@/lib/risk'
import { assuranceScore } from '@/lib/scoring'
import { frameworkCoverage } from '@/lib/coverage'
import { Link } from '@/i18n/routing'
import type { AISystem } from '@/domain/models'

export function Systems() {
  const t = useTranslations()
  const { organizationId } = useWorkspace()
  const [query, setQuery] = useState('')
  const [risk, setRisk] = useState('ALL')
  const [selected, setSelected] = useState('')
  const [version, setVersion] = useState('')
  const [type, setType] = useState('ALL')
  const scoped = systems.filter(system => system.organizationId === organizationId)
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('system')
    if (id && systems.some(system => system.organizationId === organizationId && system.id === id)) setSelected(id)
  }, [organizationId])
  const active = scoped.find(system => system.id === selected) ?? null
  const currentVersion = active?.versions.find(item => item.id === (version || active.activeVersionId)) ?? active?.versions[0]
  const filtered = useMemo(() => scoped.filter(system =>
    (risk === 'ALL' || riskLabel(assessSystemRisk(system).residualRisk) === risk) &&
    (type === 'ALL' || system.systemType.includes(type)) &&
    `${system.name} ${system.owner} ${system.systemType}`.toLowerCase().includes(query.toLowerCase())), [scoped, risk, type, query])
  return <>
    <PageHeading namespace="systems" titleKey={active ? 'detail' : 'title'} subtitleKey="subtitle" />
    {active && currentVersion ? <SystemDetail system={active} version={currentVersion} setVersion={setVersion} onBack={() => setSelected('')} /> :
      <section className="panel listing-panel"><div className="list-toolbar">
        <input className="input-search" placeholder={t('systems.search')} value={query} onChange={event => setQuery(event.target.value)} />
        <select value={risk} onChange={event => setRisk(event.target.value)}><option value="ALL">{t('common.all')} · {t('systems.risk')}</option>{['HIGH', 'MEDIUM', 'LOW'].map(value => <option key={value}>{value}</option>)}</select>
        <select value={type} onChange={event => setType(event.target.value)}><option value="ALL">{t('common.all')} · {t('systems.type')}</option>{[...new Set(scoped.map(system => system.systemType))].map(value => <option key={value}>{value}</option>)}</select>
      </div>{filtered.length ? <div className="table-wrap"><table><thead><tr><th>{t('systems.name')}</th><th>{t('systems.type')}</th><th>{t('common.owner')}</th><th>{t('systems.risk')}</th><th>{t('systems.score')} <InfoTooltip messageKey="assurance" /></th><th>{t('systems.coverage')}</th><th>{t('common.version')}</th></tr></thead><tbody>{filtered.map(system => {
        const scopedResults = results.filter(result => result.evaluationId === (system.id === 'SYS-BANK' ? 'EV-2001' : system.id === 'SYS-HCP' ? 'EV-1001' : ''))
        const score = assuranceScore(scopedResults, findings.filter(finding => finding.systemId === system.id)).score
        const coverage = calculateCoverage(scopedResults)
        return <tr key={system.id} onClick={() => { setSelected(system.id); setVersion(system.activeVersionId) }} className="click-row"><td><b>{system.name}</b><small>{system.id} · {system.environment}</small></td><td>{system.systemType}</td><td>{system.owner}</td><td><StatusPill status={riskLabel(assessSystemRisk(system).residualRisk)} /></td><td>{score}</td><td>{coverage}%</td><td>{system.versions.find(item => item.id === system.activeVersionId)?.version}</td></tr>
      })}</tbody></table></div> : <EmptyState>No systems match this organization and filter.</EmptyState>}</section>}
  </>
}
function calculateCoverage(scopedResults: typeof results) {
  return frameworks.length ? Math.round(frameworks.reduce((sum, framework) => sum + frameworkCoverage(framework, requirements, mappings, controls, scopedResults).coverage, 0) / frameworks.length) : 0
}
function SystemDetail({ system, version, setVersion, onBack }: { system: AISystem; version: AISystem['versions'][number]; setVersion: (id: string) => void; onBack: () => void }) {
  const t = useTranslations()
  const scopedResults = results.filter(result => result.evaluationId === (system.id === 'SYS-BANK' ? 'EV-2001' : system.id === 'SYS-HCP' ? 'EV-1001' : ''))
  const score = assuranceScore(scopedResults, findings.filter(finding => finding.systemId === system.id)).score
  const coverage = calculateCoverage(scopedResults)
  const metricRows = metrics.filter(metric => metric.systemId === system.id)
  const scopedFindings = findings.filter(finding => finding.systemId === system.id)
  const scopedEvidence = evidence.filter(item => item.systemId === system.id)
  return <>
    <button className="text-action" onClick={onBack}>← {t('systems.title')}</button>
    <section className="panel system-hero"><div className="system-symbol large">AI</div><div className="system-hero-main"><div className="hero-label">{system.id} <StatusPill status={system.environment} /></div><h2>{system.name}</h2><p>{system.systemType} · {t('common.owner')}: {system.owner}</p><div className="hero-meta"><span>{t('common.version')}<select value={version.id} onChange={event => setVersion(event.target.value)}>{system.versions.map(item => <option value={item.id} key={item.id}>{item.version}</option>)}</select></span><span>Purpose<b>{system.intendedUse}</b></span></div></div></section>
    <div className="metric-grid"><MiniMetric label={t('systems.score')} value={`${score}/100`} /><MiniMetric label={t('systems.risk')} value={`${assessSystemRisk(system).residualRisk} · ${riskLabel(assessSystemRisk(system).residualRisk)}`} /><MiniMetric label={t('systems.confidence')} value="MEDIUM" /><MiniMetric label={t('systems.coverage')} value={`${coverage}%`} /></div>
    <div className="dashboard-grid"><section className="panel"><h2>{t('systems.architecture')}</h2><div className="architecture-flow">{system.dependencies.length ? system.dependencies.map(dependency => <div className="arch-node" key={dependency.id}><span>{dependency.kind}</span><b>{dependency.name}</b><small>{dependency.version}</small></div>) : <p>No dependencies declared in this demo record.</p>}</div><h3>{t('systems.agentic')}</h3><p>Autonomy level {system.autonomy}/5 · Data: {system.dataClassification} · Reversibility {system.reversibility}/5</p></section><section className="panel"><h2>{t('systems.comparison')}</h2><div className="version-compare">{system.versions.map(item => <button key={item.id} onClick={() => setVersion(item.id)}><span>{item.id === system.activeVersionId ? t('systems.current') : t('systems.previous')}</span><b>{item.version}</b><small>{item.promptVersion} · {item.knowledgeBaseVersion}</small></button>)}</div>{metricRows.map(metric => <p key={metric.id}>{metric.name}: {version.id === system.versions[0].id ? metric.baseline : metric.current}{metric.unit}</p>)}</section></div>
    <section className="panel"><h2>{t('findings.title')}</h2>{scopedFindings.length ? scopedFindings.map(finding => <p key={finding.id}><Link href={`/findings?finding=${finding.id}` as never}>{finding.title}</Link> · {finding.severity}</p>) : <p>No findings for this system.</p>}</section>
    <section className="panel"><h2>{t('evaluations.result')}</h2>{scopedResults.filter(result => result.evaluationId === (system.organizationId === 'org-bank' ? 'EV-2001' : 'EV-1001')).map(result => <p key={result.id}>{result.controlId} · {result.observedBehavior} · {result.result}</p>)}<p>Linked evidence: {scopedEvidence.length}</p></section><Link className="btn primary" href={`/evaluations?system=${system.id}` as never}>{t('common.run')}</Link>
  </>
}
function MiniMetric({ label, value }: { label: string; value: string }) { return <div className="metric-card"><div className="metric-top">{label}</div><div className="metric-value">{value}</div></div> }
function riskLabel(value: number) { return value >= 65 ? 'HIGH' : value >= 40 ? 'MEDIUM' : 'LOW' }
