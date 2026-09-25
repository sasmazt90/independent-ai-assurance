'use client'
import {useTranslations} from 'next-intl'
import {PageHeading,StatusPill} from '@/components/assurance/shared'
import {session,roles} from '@/data/demo'
import {workflowRepository} from '@/repositories/workflow'
import {hasPermission} from '@/lib/permissions'
import {useWorkspace} from '@/components/shell/WorkspaceShell'
const permissions=['system:read','system:write','evaluation:run','finding:manage','release:approve','risk:accept','report:export','framework:publish'] as const
export function SettingsPage(){const t=useTranslations();const {organizationId}=useWorkspace();return <><PageHeading namespace="settings" titleKey="title" subtitleKey="subtitle"/><div className="settings-grid"><section className="panel"><h2>{t('settings.role')}</h2><p>{session.name} · {session.role}</p><p>Organization scope: {organizationId}</p><div className="permission-list">{permissions.map(p=><p key={p}><StatusPill status={hasPermission(session.role,p)?'GRANTED':'NOT_GRANTED'}/>{p}</p>)}</div><p>Supported roles: {roles.join(', ')}</p></section><section className="panel"><h2>{t('settings.audit')}</h2>{workflowRepository.auditList().filter(a=>a.organizationId===organizationId).map(a=><p key={a.id}>{a.timestamp} · {a.actor} · {a.action} · {a.objectType} {a.objectId}</p>)}</section></div></>}
