import {findings as seed,systems as systemsSeed} from '../data/demo'
import type {Finding,SystemRecord} from '../domain/types'
const read=<T,>(key:string,fallback:T):T=>{try{const v=localStorage.getItem(`iaa:${key}`);return v?JSON.parse(v) as T:fallback}catch{return fallback}}
const write=<T,>(key:string,value:T)=>localStorage.setItem(`iaa:${key}`,JSON.stringify(value))
export const assuranceRepository={
 systems:():SystemRecord[]=>read('systems',systemsSeed),
 findings:():Finding[]=>read('findings',seed),
 updateFinding:(id:string,status:string)=>{const next=assuranceRepository.findings().map(f=>f.id===id?{...f,status}:f);write('findings',next);return next},
 recordAudit:(action:string)=>{const log=read<string[]>('audit',[]);write('audit',[`${new Date().toISOString()} · ${action}`,...log].slice(0,100))},
 audit:()=>read<string[]>('audit',[])
}
