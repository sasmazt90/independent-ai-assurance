import {describe,expect,it} from 'vitest'
import {controls,frameworks,systems} from '../data/demo'
import {runDemoEvaluation} from '../services/evaluation'

describe('assurance demo model',()=>{
 it('keeps framework records versioned and controls mapped to known framework IDs',()=>{
  expect(frameworks.every(f=>f.id&&f.version&&f.status&&f.sourceURL)).toBe(true)
  expect(controls.every(c=>c.frameworks.every(id=>frameworks.some(f=>f.id===id)))).toBe(true)
  expect(controls.some(c=>c.humanReview==='HUMAN_REQUIRED')).toBe(true)
 })
 it('uses stable demo system IDs and synthetic seeded portfolio values',()=>{
  expect(new Set(systems.map(s=>s.id)).size).toBe(systems.length)
  expect(systems).toHaveLength(5)
 })
 it('runs a deterministic demo evaluation lifecycle without external model access',async()=>{
  const states:string[]=[]
  const result=await runDemoEvaluation({systemId:'SYS-001',version:'2.4.1',profile:'Regression'},s=>states.push(s))
  expect(states).toEqual(['QUEUED','RUNNING','COMPLETED'])
  expect(result).toMatchObject({profile:'Regression',passed:7,failed:2,review:3,source:'Deterministic seeded demo; no external AI system was contacted.'})
 })
})
