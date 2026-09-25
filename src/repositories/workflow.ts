import {auditEvents as seeded,findings as initial} from '@/data/demo'
import {transitionFinding,type FindingStatus} from '@/services/findings'
import type {AuditEvent,Finding} from '@/domain/models'
const prefix='iaa-v1:'
function read<T>(key:string,fallback:T):T{if(typeof window==='undefined')return fallback;try{const item=window.localStorage.getItem(prefix+key);return item?JSON.parse(item) as T:fallback}catch{return fallback}}
function write<T>(key:string,value:T){if(typeof window!=='undefined')window.localStorage.setItem(prefix+key,JSON.stringify(value))}
export const workflowRepository={findings:(orgId:string)=>workflowRepository.allFindings().filter(f=>f.organizationId===orgId),allFindings:()=>read<Finding[]>('findings',initial),updateFinding:(findingId:string,status:FindingStatus,actor:string,reason:string)=>{const prior=workflowRepository.allFindings();const target=prior.find(f=>f.id===findingId);if(!target)return prior;const change=transitionFinding(target,status,actor,reason);const next=prior.map(f=>f.id===findingId?change.finding:f);write('findings',next);workflowRepository.audit(change.audit);return next},audit:(event:AuditEvent):void=>write('audit',[event,...workflowRepository.auditList()]),auditList:()=>read<AuditEvent[]>('audit',seeded)}
