'use client'
import {useTranslations} from 'next-intl'
import {Info} from 'lucide-react'
export function PageHeading({titleKey,subtitleKey,namespace}:{titleKey:string;subtitleKey?:string;namespace:string}){const t=useTranslations(namespace);return <div className="page-heading"><div><div className="eyebrow">{namespace.toUpperCase()}</div><h1>{t(titleKey)}</h1>{subtitleKey&&<p>{t(subtitleKey)}</p>}</div></div>}
export function InfoTooltip({messageKey}:{messageKey:string}){const t=useTranslations('help');return <button type="button" className="info-tooltip" aria-label={t(messageKey)} title={t(messageKey)}><Info size={13}/></button>}
export function EmptyState({children}:{children:React.ReactNode}){return <div className="panel empty-state"><p>{children}</p></div>}
export function StatusPill({status}:{status:string}){return <span className={`pill ${status.toLowerCase().replaceAll('_','-')}`}>{status.replaceAll('_',' ')}</span>}
