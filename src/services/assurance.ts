import {systems,frameworks,requirements,controls,mappings,results,findings,metrics,releasePolicy} from '../data/demo'
import {frameworkCoverage} from '../lib/coverage'
import {assuranceScore} from '../lib/scoring'
import {evaluateMetric} from './monitoring'
import {evaluateReleaseGate} from './release'
export const assuranceService={coverage:(frameworkId:string)=>{const f=frameworks.find(x=>x.id===frameworkId);return f?frameworkCoverage(f,requirements,mappings,controls,results):null},score:()=>assuranceScore(results,findings),metrics:()=>metrics.map(evaluateMetric),release:(systemId:string)=>{const s=systems.find(x=>x.id===systemId);return s?evaluateReleaseGate(s.organizationId,s.id,s.activeVersionId,releasePolicy,findings,metrics):null}}
