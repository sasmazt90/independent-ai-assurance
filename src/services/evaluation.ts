import {z} from 'zod'
const evaluationSchema=z.object({systemId:z.string().min(1),version:z.string().min(1),profile:z.enum(['Regression','Security','Reliability','Full assurance'])})
export type EvaluationInput=z.infer<typeof evaluationSchema>
export async function runDemoEvaluation(raw:EvaluationInput,onState:(state:'QUEUED'|'RUNNING'|'COMPLETED')=>void){const input=evaluationSchema.parse(raw);onState('QUEUED');await new Promise(r=>setTimeout(r,400));onState('RUNNING');await new Promise(r=>setTimeout(r,900));onState('COMPLETED');return{runId:`DEMO-${input.systemId}-${Date.now().toString().slice(-5)}`,profile:input.profile,passed:7,failed:2,review:3,source:'Deterministic seeded demo; no external AI system was contacted.'}}
export interface FrameworkUpdateService { proposeUpdate(frameworkId:string):Promise<{frameworkId:string;status:'DRAFT';requiresHumanReview:true}> }
