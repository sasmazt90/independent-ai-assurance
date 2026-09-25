export type Locale = 'en' | 'de' | 'tr'
export type EntityStatus = 'ACTIVE' | 'DRAFT' | 'SUPERSEDED' | 'RETIRED'
export type Outcome = 'PASS' | 'FAIL' | 'REVIEW' | 'NOT_APPLICABLE' | 'NOT_TESTED'
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL'
export type Role = 'ORG_ADMIN' | 'GOVERNANCE_MANAGER' | 'AUDITOR' | 'SYSTEM_OWNER' | 'REVIEWER' | 'VIEWER'
export type Permission = 'system:read'|'system:write'|'evaluation:run'|'finding:manage'|'release:approve'|'risk:accept'|'report:export'|'framework:publish'
export interface Organization {id:string;name:string;locale:Locale}
export interface User {id:string;name:string;role:Role;organizationId:string}
export interface AISystem {id:string;organizationId:string;name:string;systemType:string;intendedUse:string;owner:string;environment:string;dataClassification:'PUBLIC'|'INTERNAL'|'CONFIDENTIAL'|'SPECIAL_CATEGORY';autonomy:number;affectedUsers:number;reversibility:number;versions:AISystemVersion[];activeVersionId:string;dependencies:SystemDependency[]}
export interface AISystemVersion {id:string;systemId:string;version:string;modelId:string;promptVersion:string;knowledgeBaseVersion:string;createdAt:string}
export interface AIModel {id:string;provider:string;name:string;version:string}
export interface SystemDependency {id:string;kind:'MODEL'|'RAG_SOURCE'|'TOOL'|'SERVICE';name:string;version:string}
export interface SystemArchitecture {systemId:string;components:SystemDependency[]}
export interface RiskAssessment {id:string;systemId:string;likelihood:number;impact:number;exposure:number;residualRisk:number;assessedAt:string;owner:string}
export interface Risk {id:string;assessmentId:string;title:string;severity:Severity;status:string}
export interface RiskAcceptance {id:string;riskId:string;owner:string;rationale:string;expiresAt:string;approvedBy:string;timestamp:string}
export interface Framework {id:string;name:string;shortName:string;issuer:string;type:string;versions:FrameworkVersion[];activeVersionId:string}
export interface FrameworkVersion {id:string;frameworkId:string;version:string;status:EntityStatus;publicationDate:string;source:FrameworkSourceMetadata}
export interface FrameworkSourceMetadata {officialReference:string;sourceURL:string;lastReviewedDate:string;validationStatus:'VALIDATED_PUBLIC_SUMMARY'|'REFERENCE_REQUIRES_VALIDATION';needsSourceValidation:boolean}
export interface FrameworkRequirement {id:string;frameworkVersionId:string;title:string;summary:string;needsSourceValidation:boolean;evidenceStatus:string}
export interface MasterControl {id:string;title:string;domain:string;objective:string;riskAddressed:string;applicability:string[];automationCapability:'AUTOMATED'|'HYBRID'|'HUMAN_REQUIRED';humanReview:boolean;passCriteria:string;failCriteria:string;reviewCriteria:string;status:EntityStatus;versions:ControlVersion[];activeVersionId:string}
export interface ControlVersion {id:string;controlId:string;version:string;effectiveDate:string}
export interface FrameworkMapping {id:string;frameworkVersionId:string;frameworkRequirementId:string;masterControlId:string;relationship:'FULL'|'PARTIAL'|'SUPPORTS'|'RELATED';validationStatus:'VALIDATED'|'REFERENCE_REQUIRES_VALIDATION';sourceReference:string;notes:string}
export interface EvaluationProcedure {id:string;controlVersionId:string;method:string;evaluatorType:'RULE_BASED'|'REFERENCE_BASED'|'MODEL_BASED'|'STATISTICAL'|'HUMAN'|'HYBRID';humanReview:boolean}
export interface EvidenceRequirement {id:string;controlVersionId:string;description:string;requiredQuality:'VERIFIED'|'REVIEWED'|'ANY'}
export interface EvaluationProfile {id:string;name:string;domains:string[];suiteIds:string[]}
export type EvaluationStatus='DRAFT'|'QUEUED'|'RUNNING'|'COMPLETED'|'FAILED'|'CANCELLED'
export interface Evaluation {id:string;organizationId:string;systemId:string;systemVersionId:string;profileId:string;suiteVersionIds:string[];frameworkVersionIds:string[];controlVersionIds:string[];executionTime:string;status:EvaluationStatus;resultIds:string[];evidenceIds:string[];configurationSnapshot:Record<string,string>}
export type EvaluationRun = Evaluation
export interface TestSuite {id:string;version:string;name:string;testCaseIds:string[]}
export interface TestCase {id:string;suiteId:string;controlId:string;title:string;expectedBehavior:string;severity:Severity;systemTypes:string[]}
export interface EvaluatorMetadata {id:string;type:string;name:string;version:string;reliability:number}
export interface TestResult {id:string;evaluationId:string;testCaseId:string;controlId:string;expectedBehavior:string;observedBehavior:string;result:Outcome;severity:Severity;confidence:number;evaluatorId:string;timestamp:string;evidenceIds:string[];notes:string}
export interface Finding {id:string;organizationId:string;systemId:string;evaluationId:string;testResultId:string;controlId:string;evidenceIds:string[];title:string;severity:Severity;status:string;owner:string;dueDate:string;history:FindingHistory[];riskAcceptanceId?:string}
export interface FindingHistory {id:string;findingId:string;status:string;actor:string;timestamp:string;reason:string}
export type EvidenceQuality='VERIFIED'|'REVIEWED'|'NEEDS_REVIEW'|'STALE'
export interface Evidence {id:string;organizationId:string;systemId:string;testResultId?:string;controlId?:string;title:string;quality:EvidenceQuality;collectedAt:string;reference:EvidenceReference}
export interface EvidenceReference {kind:'DEMO_ARTIFACT'|'POLICY'|'TRACE'|'TEST_OUTPUT';uri:string;sha256:string}
export type MetricDirection='HIGHER_IS_BETTER'|'LOWER_IS_BETTER'
export interface MonitoringMetric {id:string;systemId:string;name:string;unit:string;direction:MetricDirection;baseline:number;current:number;threshold:number;delta:number;status:'NORMAL'|'REGRESSION_DETECTED'}
export interface MonitoringBaseline {id:string;systemId:string;versionId:string;metrics:MonitoringMetric[];createdAt:string}
export type ChangeKind='MODEL_CHANGED'|'MODEL_VERSION_CHANGED'|'SYSTEM_PROMPT_CHANGED'|'RAG_SOURCE_CHANGED'|'KNOWLEDGE_BASE_CHANGED'|'TOOL_ADDED'|'TOOL_REMOVED'|'PERMISSION_CHANGED'|'POLICY_CHANGED'|'CONFIG_CHANGED'
export interface MonitoringEvent {id:string;organizationId:string;systemId:string;kind:ChangeKind;occurredAt:string;summary:string;evaluationId?:string}
export interface Regression {id:string;systemId:string;metricId:string;baseline:number;current:number;threshold:number;delta:number;detectedAt:string;findingId?:string}
export interface ReleasePolicyRule {id:string;condition:'CRITICAL_OPEN_FINDING'|'UNRESOLVED_HIGH_FINDING'|'REGRESSION_DETECTED'|'STALE_EVALUATION'|'HUMAN_REVIEW_REQUIRED';action:'BLOCK'|'REVIEW';enabled:boolean}
export interface ReleasePolicy {id:string;organizationId:string;name:string;rules:ReleasePolicyRule[]}
export interface ReleaseGate {id:string;organizationId:string;systemId:string;versionId:string;policyId:string;decision:'BLOCKED'|'REVIEW_REQUIRED'|'READY';reasons:string[];evaluatedAt:string}
export interface ReleaseDecision {id:string;gateId:string;decision:string;actor:string;timestamp:string;reason:string}
export interface ReleaseOverride {id:string;gateId:string;owner:string;rationale:string;approvedBy:string;expiresAt:string;timestamp:string;organizationId:string}

export interface AuditEvent {id:string;organizationId:string;actor:string;action:string;objectType:string;objectId:string;timestamp:string;previousState?:string;newState?:string;reason?:string}
export interface Notification {id:string;organizationId:string;title:string;body:string;createdAt:string;read:boolean}
export interface Integration {id:string;organizationId:string;name:string;status:'CONNECTED'|'NOT_CONNECTED'}
export interface Report {id:string;organizationId:string;kind:string;title:string;createdAt:string}
