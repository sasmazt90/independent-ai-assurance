import type {ScoreDeduction} from './index'
export function waterfallDestination(deduction:ScoreDeduction):string|null{
 if(deduction.findingId)return `/findings?finding=${encodeURIComponent(deduction.findingId)}`
 if(deduction.controlId)return `/controls?control=${encodeURIComponent(deduction.controlId)}`
 if(deduction.testResultId)return `/evaluations?result=${encodeURIComponent(deduction.testResultId)}`
 return null
}
