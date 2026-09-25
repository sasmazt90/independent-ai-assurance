import {readdirSync,readFileSync} from 'node:fs'
import {join} from 'node:path'
import {describe,expect,it} from 'vitest'
import * as ts from 'typescript'
import en from '../src/messages/en.json'
import de from '../src/messages/de.json'
import tr from '../src/messages/tr.json'
import {getHelp,helpTopics} from '../src/i18n/help-content'

function sourceFiles(directory:string):string[]{return readdirSync(directory,{withFileTypes:true}).flatMap(item=>{const file=join(directory,item.name);return item.isDirectory()?sourceFiles(file):file.endsWith('.tsx')?[file]:[]})}

describe('localization safeguards',()=>{
 it('keeps primary page copy translated in German and Turkish',()=>{for(const key of ['title','subtitle'] as const){expect(de.overview[key]).not.toBe(en.overview[key]);expect(tr.overview[key]).not.toBe(en.overview[key])}for(const key of ['emptyEvidence','systemsMonitored','baselineCurrentMetrics'] as const){expect(typeof de.ui[key]).toBe('string');expect(typeof tr.ui[key]).toBe('string')}})
 it('translates all displayed status categories centrally',()=>{const required=['PASS','FAIL','REVIEW','REVIEW_REQUIRED','NOT_TESTED','NOT_APPLICABLE','NOT_MAPPED','BLOCKED','READY','ACTIVE','DISABLED','OPEN','INVESTIGATING','IN_REMEDIATION','READY_FOR_RETEST','RESOLVED','RISK_ACCEPTED','CRITICAL','HIGH','MEDIUM','LOW','INFORMATIONAL','REGRESSION_DETECTED','NORMAL','GRANTED','NOT_GRANTED'] as const;for(const status of required){expect(typeof en.statuses[status]).toBe('string');expect(typeof de.statuses[status]).toBe('string');expect(typeof tr.statuses[status]).toBe('string')}expect(de.statuses.REVIEW_REQUIRED).not.toBe(en.statuses.REVIEW_REQUIRED);expect(tr.statuses.REVIEW_REQUIRED).not.toBe(en.statuses.REVIEW_REQUIRED)})
 it('provides translated plural and interpolated release-gate copy',()=>{expect(en.ui.releaseBlocked).toContain('count, plural');expect(de.ui.releaseBlocked).toContain('count, plural');expect(tr.ui.releaseBlocked).toContain('{count}');for(const catalog of [en,de,tr])expect(catalog.ui.gatesRecomputed.length).toBeGreaterThan(10)})
 it('provides complete contextual explanations in all locales',()=>{expect(helpTopics).toHaveLength(14);for(const locale of ['en','de','tr'] as const)for(const topic of helpTopics){const entry=getHelp(topic,locale);expect(Object.values(entry).every(text=>text.trim().length>0)).toBe(true)}})
 it('guards against hardcoded explanatory JSX text and literal accessibility labels',()=>{const allowed=new Set(['Independent','AI Assurance','Alex Morgan']);const violations:string[]=[];for(const file of sourceFiles(join(process.cwd(),'src'))){const text=readFileSync(file,'utf8');const tree=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);const visit=(node:ts.Node)=>{if(ts.isJsxText(node)){const copy=node.getText(tree).trim();if(/[A-Za-z]{3,}/.test(copy)&&!allowed.has(copy))violations.push(`${file}: ${copy}`)}if(ts.isJsxAttribute(node)&&node.initializer&&ts.isStringLiteral(node.initializer)&&['placeholder','aria-label','title','alt'].includes(node.name.getText(tree)))violations.push(`${file}: ${node.name.getText(tree)}=${node.initializer.text}`);ts.forEachChild(node,visit)};visit(tree)}expect(violations).toEqual([])})
 it('uses the centralized status-message namespace in status pills',()=>{const source=readFileSync(join(process.cwd(),'src/components/assurance/shared.tsx'),'utf8');expect(source).toContain("useTranslations('statuses')")})
})
