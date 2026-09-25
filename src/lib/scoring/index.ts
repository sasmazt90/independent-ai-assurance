import type {Finding,TestResult} from '../../domain/models'
export type ScoreRule={failHigh:number;failMedium:number;failLow:number;review:number;missingEvidence:number}
export type ScoreDeduction={id:string;label:string;amount:number;controlId?:string;testResultId?:string;findingId?:string}
export const defaultScoreRule:ScoreRule={failHigh:8,failMedium:4,failLow:2,review:3,missingEvidence:4}
export function assuranceScore(results:TestResult[],findings:Finding[],rule=defaultScoreRule){
 const open=findings.filter(f=>!['RESOLVED','RISK_ACCEPTED'].includes(f.status))
 const deductions:ScoreDeduction[]=[]
 for(const result of results){
  if(result.result==='FAIL'){
   const amount=result.severity==='HIGH'||result.severity==='CRITICAL'?rule.failHigh:result.severity==='MEDIUM'?rule.failMedium:rule.failLow
   const finding=open.find(item=>item.testResultId===result.id)
   deductions.push({id:`deduct-${result.id}`,label:finding?.title??result.controlId,amount,controlId:result.controlId,testResultId:result.id,findingId:finding?.id})
  }else if(result.result==='REVIEW')deductions.push({id:`deduct-${result.id}`,label:`Review required: ${result.controlId}`,amount:rule.review,controlId:result.controlId,testResultId:result.id})
 }
 const assessed=new Set(results.map(result=>result.controlId))
 for(const controlId of assessed){const hasEvidence=results.some(result=>result.controlId===controlId&&result.evidenceIds.length>0);if(!hasEvidence)deductions.push({id:`evidence-${controlId}`,label:`Missing evidence: ${controlId}`,amount:rule.missingEvidence,controlId})}
 const total=deductions.reduce((sum,item)=>sum+item.amount,0)
 return{baseline:100,deductions,score:Math.max(0,100-total)}
}
