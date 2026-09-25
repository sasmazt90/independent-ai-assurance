'use client'
import {useTranslations} from 'next-intl'
import {PageHeading,StatusPill} from '@/components/assurance/shared'
const records=[['modelRegistry','NOT_CONNECTED'],['cloudLogging','NOT_CONNECTED'],['issueManagement','NOT_CONNECTED'],['identityProvider','DEMO_ONLY']]
export function Integrations(){const t=useTranslations();return <><PageHeading namespace="integrations" titleKey="title" subtitleKey="subtitle"/><section className="panel"><div className="integration-list">{records.map(([key,status])=><article className="integration-row" key={key}><span className="integration-icon">IN</span><span><b>{t(`integrations.providers.${key}`)}</b><small>{t(`integrations.descriptions.${key}`)}</small></span><StatusPill status={status}/><button className="btn outline" disabled>{t('ui.configure')}</button></article>)}</div><p className="notice-box">{t('ui.noConnector')}</p></section></>}
