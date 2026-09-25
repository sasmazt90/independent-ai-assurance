'use client'
import {useLocale,useTranslations} from 'next-intl'
import {Info} from 'lucide-react'
import {getHelp,type HelpTopic} from '@/i18n/help-content'
import type {Locale} from '@/domain/models'
export function PageHeading({titleKey,subtitleKey,namespace}:{titleKey:string;subtitleKey?:string;namespace:string}){const t=useTranslations(namespace);const ui=useTranslations('ui');return <div className="page-heading"><div><div className="eyebrow">{ui('workspaceArea')}</div><h1>{t(titleKey)}</h1>{subtitleKey&&<p>{t(subtitleKey)}</p>}</div></div>}
export function InfoTooltip({messageKey}:{messageKey:string}){const locale=useLocale() as Locale;const ui=useTranslations('ui');const copy=getHelp(messageKey as HelpTopic,locale);return <details className="info-popover"><summary aria-label={copy.title}><Info size={13}/></summary><div className="info-panel" role="tooltip"><b>{copy.title}</b><dl><dt>{ui('contextWhat')}</dt><dd>{copy.what}</dd><dt>{ui('contextWhy')}</dt><dd>{copy.why}</dd><dt>{ui('contextMeasurement')}</dt><dd>{copy.measured}</dd><dt>{ui('contextInterpretation')}</dt><dd>{copy.interpret}</dd></dl></div></details>}
export function EmptyState({children}:{children:React.ReactNode}){return <div className="panel empty-state"><p>{children}</p></div>}
export function StatusPill({status}:{status:string}){const t=useTranslations('statuses');const key=status.toUpperCase().replaceAll(' ','_');const label=t.has(key)?t(key):status.replaceAll('_',' ');return <span className={`pill ${status.toLowerCase().replaceAll('_','-')}`}>{label}</span>}
