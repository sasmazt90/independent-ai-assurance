import type {AuditEvent,Finding,ReleaseGate,ReleaseOverride,RiskAcceptance,Role} from '../../domain/models'
import {hasPermission} from '../../lib/permissions'
export interface OverrideInput{organizationId:string;gateId:string;owner:string;rationale:string;expiresAt:string;approvedBy:string;role:Role;findings:Finding[]}
export function createReleaseOverride(input:OverrideInput,now=new Date().toISOString()):{override:ReleaseOverride;riskAcceptances:RiskAcceptance[];audit:AuditEvent}{
 if(!hasPermission(input.role,'release:approve'))throw new Error('Permission denied: release:approve')
 if(input.owner.trim().length<2)throw new Error('Owner must contain at least 2 characters.')
 if(input.rationale.trim().length<12)throw new Error('Rationale must contain at least 12 characters.')
 if(!Number.isFinite(Date.parse(input.expiresAt))||Date.parse(input.expiresAt)<=Date.parse(now))throw new Error('Expiry must be a future date.')
 const timestamp=now
 const override:ReleaseOverride={id:`OV-${input.gateId}-${Date.parse(now)}`,gateId:input.gateId,organizationId:input.organizationId,owner:input.owner.trim(),rationale:input.rationale.trim(),approvedBy:input.approvedBy,expiresAt:new Date(input.expiresAt).toISOString(),timestamp}
 const riskAcceptances=input.findings.filter(f=>f.organizationId===input.organizationId&&['HIGH','CRITICAL'].includes(f.severity)&&!['RESOLVED','RISK_ACCEPTED'].includes(f.status)).map(f=>({id:`RA-${override.id}-${f.id}`,riskId:f.id,owner:override.owner,rationale:override.rationale,expiresAt:override.expiresAt,approvedBy:override.approvedBy,timestamp}))
 const audit:AuditEvent={id:`AE-${override.id}`,organizationId:input.organizationId,actor:input.approvedBy,action:'Release override recorded',objectType:'ReleaseOverride',objectId:override.id,timestamp,newState:'ACTIVE',reason:`Owner: ${override.owner}; expires: ${override.expiresAt}; linked risk acceptances: ${riskAcceptances.length}. ${override.rationale}`}
 return{override,riskAcceptances,audit}
}
export function effectiveReleaseDecision(gate:ReleaseGate,overrides:ReleaseOverride[],now=new Date().toISOString()):ReleaseGate['decision']{
 const valid=overrides.some(item=>item.gateId===gate.id&&item.organizationId===gate.organizationId&&Date.parse(item.expiresAt)>Date.parse(now))
 return gate.decision==='BLOCKED'&&valid?'READY':gate.decision
}
