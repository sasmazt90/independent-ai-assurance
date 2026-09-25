'use client'
import {Bar,BarChart,CartesianGrid,Cell,ResponsiveContainer,Tooltip,XAxis,YAxis} from 'recharts'
import {useTranslations} from 'next-intl'
import {Link} from '@/i18n/routing'
import {waterfallDestination} from '@/lib/scoring/waterfall'
import type {assuranceScore} from '@/lib/scoring'
type Score=ReturnType<typeof assuranceScore>
export function ScoreWaterfall({score}:{score:Score}){
 const t=useTranslations();let remaining=score.baseline
 const data=[{label:t('ui.baseline'),base:0,amount:score.baseline,kind:'baseline',id:'baseline'},...score.deductions.map(deduction=>{remaining-=deduction.amount;return{label:deduction.label,base:remaining,amount:deduction.amount,kind:'deduction',id:deduction.id}}),{label:t('ui.finalScore'),base:0,amount:score.score,kind:'final',id:'final'}]
 return <><div className="waterfall-chart" role="img" aria-label={`${t('overview.waterfall')}: ${t('ui.baseline')} ${score.baseline}, ${t('ui.finalScore')} ${score.score}`}><ResponsiveContainer width="100%" height={250}><BarChart data={data} margin={{top:15,right:12,left:0,bottom:52}}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="label" interval={0} angle={-25} textAnchor="end" height={66} tick={{fontSize:10}}/><YAxis domain={[0,100]} tick={{fontSize:10}}/><Tooltip formatter={(value,name)=>name==='base'?[null,'']:[value,t('ui.scoreDeduction')]} labelFormatter={label=>String(label)}/><Bar dataKey="base" stackId="score" fill="transparent" isAnimationActive={false}/><Bar dataKey="amount" stackId="score" isAnimationActive={false}>{data.map((item,index)=><Cell key={index} fill={item.kind==='deduction'?'#d97745':item.kind==='final'?'#25835f':'#4778c8'}/>)}</Bar></BarChart></ResponsiveContainer></div><div className="waterfall-links">{score.deductions.map(deduction=>{const href=waterfallDestination(deduction);const body=<>{deduction.label} −{deduction.amount} <span>{t('ui.review')}</span></>;return href?<Link href={href as never} key={deduction.id}>{body}</Link>:<span key={deduction.id}>{body}</span>})}</div><p className="small-note">{t('ui.waterfallFormula')}</p></>
}
