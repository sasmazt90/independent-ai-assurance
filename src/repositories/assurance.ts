import {metrics as seededMetrics,results as seededResults,evaluations as seededEvaluations} from '@/data/demo'
import type {AuditEvent,Evaluation,MonitoringMetric,ReleaseOverride,RiskAcceptance,TestResult} from '@/domain/models'
const key='iaa-v1:'
function read<T>(name:string,fallback:T):T{if(typeof window==='undefined')return fallback;try{const stored=window.localStorage.getItem(key+name);return stored?JSON.parse(stored) as T:fallback}catch{return fallback}}
function write<T>(name:string,value:T){if(typeof window!=='undefined')window.localStorage.setItem(key+name,JSON.stringify(value))}
export const assuranceRepository={
 results:()=>read<TestResult[]>('results',seededResults),
 addResults:(items:TestResult[])=>{const next=[...items,...assuranceRepository.results()];write('results',next);return next},
 updateResult:(id:string,outcome:TestResult['result'])=>{const next=assuranceRepository.results().map(item=>item.id===id?{...item,result:outcome}:item);write('results',next);return next},
 metrics:()=>read<MonitoringMetric[]>('metrics',seededMetrics),
 updateMetric:(id:string,current:number)=>{const next=assuranceRepository.metrics().map(metric=>{if(metric.id!==id)return metric;const delta=current-metric.baseline;const adverse=metric.direction==='HIGHER_IS_BETTER'?delta<=-metric.threshold:delta>=metric.threshold;return{...metric,current,delta,status:adverse?'REGRESSION_DETECTED' as const:'NORMAL' as const}});write('metrics',next);return next},
 evaluations:()=>read<Evaluation[]>('evaluations',seededEvaluations),
 addEvaluation:(evaluation:Evaluation)=>{const next=[evaluation,...assuranceRepository.evaluations()];write('evaluations',next);return next},
 releaseOverrides:()=>read<ReleaseOverride[]>('release-overrides',[]),
 riskAcceptances:()=>read<RiskAcceptance[]>('risk-acceptances',[]),
 releaseAuditEvents:()=>read<AuditEvent[]>('release-audit-events',[]),
 addReleaseOverride:(override:ReleaseOverride,acceptances:RiskAcceptance[],audit:AuditEvent)=>{const nextOverrides=[override,...assuranceRepository.releaseOverrides()];const nextAcceptances=[...acceptances,...assuranceRepository.riskAcceptances()];const nextAudit=[audit,...assuranceRepository.releaseAuditEvents()];write('release-overrides',nextOverrides);write('risk-acceptances',nextAcceptances);write('release-audit-events',nextAudit);return{overrides:nextOverrides,riskAcceptances:nextAcceptances,auditEvents:nextAudit}}
}
