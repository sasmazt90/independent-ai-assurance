export type Result = 'PASS'|'FAIL'|'REVIEW'|'NOT_APPLICABLE'
export type Severity = 'Critical'|'High'|'Medium'|'Low'|'Informational'
export type SystemRecord = {id:string;name:string;type:string;owner:string;version:string;environment:string;risk:string;score:number;confidence:string;coverage:number;status:string;updated:string}
export type Finding = {id:string;title:string;system:string;severity:Severity;status:string;control:string;date:string;description:string}
export type Framework = {id:string;name:string;shortName:string;version:string;status:string;issuer:string;type:string;sourceURL:string;sourceValidationStatus:string;needsSourceValidation?:boolean}
export type Control = {id:string;title:string;domain:string;objective:string;method:string;humanReview:string;frameworks:string[];status:string;result:Result}
