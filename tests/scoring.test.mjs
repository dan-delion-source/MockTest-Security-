import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createSets,status,score,shuffledOptions,shuffledQuestions} from '../src/model.js';
const qs=JSON.parse(readFileSync(new URL('../public/questions.json',import.meta.url)));
test('all 414 PDF questions are complete, unique and partitioned without overlap',()=>{
 assert.equal(qs.length,414);assert.equal(new Set(qs.map(q=>q.id)).size,414);
 assert.deepEqual(createSets(qs).map(s=>s.length),[90,90,90,90,54]);
 for(const q of qs){assert.ok(q.prompt&&q.explanation&&q.topic);assert.ok(q.correct.length);assert.ok(q.correct.every(id=>q.options.some(o=>o.id===id)));assert.ok(q.options.every(o=>!o.text.includes('✔')));}
});
test('multi-select requires exactly the correct set, regardless of order',()=>{
 const q={correct:['A','C']};assert.equal(status(q,['C','A']),'correct');
 for(const answer of [['A'],['A','B','C'],['B'],['A','A']])assert.equal(status(q,answer),'incorrect');
 assert.equal(status(q,[]),'unanswered');
});
test('score uses all questions as denominator including unanswered',()=>{
 assert.deepEqual(score([{id:1,correct:['B']},{id:2,correct:['A']},{id:3,correct:['A']}],{1:['B'],2:['B']}),{correct:1,incorrect:1,unanswered:1,total:3,percent:33,points:300,passingPoints:750,pointsNeeded:450,correctToPass:3,passed:false});
 const ninety=Array.from({length:90},(_,i)=>({id:i+1,correct:['A']}));
 assert.equal(score(ninety,Object.fromEntries(ninety.slice(0,74).map(q=>[q.id,['A']]))).points,740);
 assert.equal(score(ninety,Object.fromEntries(ninety.slice(0,74).map(q=>[q.id,['A']]))).passed,false);
 assert.equal(score(ninety,Object.fromEntries(ninety.slice(0,75).map(q=>[q.id,['A']]))).points,750);
 assert.equal(score(ninety,Object.fromEntries(ninety.slice(0,75).map(q=>[q.id,['A']]))).passed,true);
 for(const set of createSets(qs))assert.equal(score(set,Object.fromEntries(set.map(q=>[q.id,q.correct]))).percent,100);
});
test('shuffle preserves original option identities and is stable across reloads',()=>{
 for(const q of qs){const shuffled=shuffledOptions(q.options,q.id*9583);assert.deepEqual(new Set(shuffled.map(o=>o.id)),new Set(q.options.map(o=>o.id)));assert.deepEqual(shuffled,shuffledOptions(q.options,q.id*9583));}
});

test('question orders are shuffled for a new seed and stable for a resumed attempt',()=>{
 const questions=qs.slice(0,90);
 const first=shuffledQuestions(questions,123456);
 const resumed=shuffledQuestions(questions,123456);
 const nextAttempt=shuffledQuestions(questions,987654321);
 assert.notDeepEqual(first.map(q=>q.id),questions.map(q=>q.id));
 assert.deepEqual(first.map(q=>q.id),resumed.map(q=>q.id));
 assert.notDeepEqual(first.map(q=>q.id),nextAttempt.map(q=>q.id));
 assert.deepEqual(new Set(first.map(q=>q.id)),new Set(questions.map(q=>q.id)));
});
