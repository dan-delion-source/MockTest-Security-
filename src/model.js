export const SET_SIZE=90;
export function createSets(questions){return Array.from({length:Math.ceil(questions.length/SET_SIZE)},(_,i)=>questions.slice(i*SET_SIZE,(i+1)*SET_SIZE));}
export function status(question,selected=[]){
  if(!selected.length)return 'unanswered';
  return selected.length===question.correct.length && new Set(selected).size===selected.length && selected.every(id=>question.correct.includes(id))?'correct':'incorrect';
}
export function score(questions,answers){
  const result={correct:0,incorrect:0,unanswered:0,total:questions.length};
  questions.forEach(q=>result[status(q,answers[q.id])]++);
  result.percent=Math.round(result.correct/result.total*100);
  result.points=Math.round(result.correct/result.total*900);
  result.passingPoints=750;
  result.pointsNeeded=Math.max(0,result.passingPoints-result.points);
  result.correctToPass=Math.ceil(result.total*result.passingPoints/900);
  result.passed=result.correct>=result.correctToPass;
  return result;
}
export function shuffledOptions(options,seed){
  const result=[...options]; let state=seed>>>0;
  for(let i=result.length-1;i>0;i--){state=(Math.imul(1664525,state)+1013904223)>>>0;const j=state%(i+1);[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
export function shuffledQuestions(questions,seed){return shuffledOptions(questions,seed);}
