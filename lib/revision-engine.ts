import OpenAI from "openai";
export type RevisionResult = "EASY" | "OKAY" | "STRUGGLED" | "FAILED";
const mult: Record<RevisionResult, number> = { EASY: 2, OKAY: 1, STRUGGLED: 0.5, FAILED: 0.25 };
const ai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
export function buildUserInsights(ps: any[]) {
  const topics: Record<string, any> = {}, difficulties: Record<string, any> = {};
  for (const p of ps) {
    const a=p.attempts ?? [], r=p.revisions ?? []; const t=topics[p.topic] ?? {attempts:0,failures:0,revisions:0,struggles:0};
    t.attempts+=a.length; t.failures+=a.filter((x:any)=>!x.solved).length; t.revisions+=r.length; t.struggles+=r.filter((x:any)=>x.result==="STRUGGLED"||x.result==="FAILED").length; topics[p.topic]=t;
    const d=difficulties[p.difficulty] ?? {attempts:0,failures:0}; d.attempts+=a.length; d.failures+=a.filter((x:any)=>!x.solved).length; difficulties[p.difficulty]=d;
  }
  for (const k of Object.keys(topics)) { const t=topics[k]; t.failureRate=t.attempts?t.failures/t.attempts:0; t.struggleRate=t.revisions?t.struggles/t.revisions:0; }
  return { topics, difficulties };
}
export function rankCandidates(ps:any[], insights:any) {
  return ps.map((p:any)=>{ const overdue=p.revisionDate?Math.max(0,(Date.now()-new Date(p.revisionDate).getTime())/86400000):0; const t=insights.topics[p.topic]; const last=p.revisions?.[0]; const weak=t?t.failureRate*35+t.struggleRate*30:0; const result=last?.result==="FAILED"?30:last?.result==="STRUGGLED"?20:0; const diff=p.difficulty==="Hard"?10:p.difficulty==="Medium"?6:2; const failed=(p.attempts??[]).filter((a:any)=>!a.solved).length; const score=Math.round(overdue*12+weak+result+diff+Math.min(10,failed*2)+(p.favorite?4:0)); return {problem:p,score,overdueDays:Math.round(overdue*10)/10}; }).sort((a:any,b:any)=>b.score-a.score);
}
export async function getAdaptiveRevisionSchedule({problem,result,userPreferredGapDays}:{problem:any;result:RevisionResult;userPreferredGapDays:number}) {
  const base=Math.min(30,Math.max(1,Number(problem.revisionIntervalDays||userPreferredGapDays||4))); let days=Math.min(30,Math.max(1,Math.round(base*mult[result])));
  if (ai) { try { const r=await ai.responses.create({model:"gpt-5-mini",input:"Return ONLY JSON with days (1-30) and reason. EASY farther, OKAY baseline, STRUGGLED sooner, FAILED much sooner. Use history, not difficulty alone. Context: "+JSON.stringify({title:problem.title,topic:problem.topic,difficulty:problem.difficulty,revisionCount:problem.revisionCount,previousResults:(problem.revisions??[]).map((x:any)=>x.result),preferredGapDays:userPreferredGapDays,result})}); const x=JSON.parse(r.output_text); if(Number.isFinite(x.days)) days=Math.min(30,Math.max(1,Math.round(x.days))); return {days,reason:typeof x.reason==="string"?x.reason:"Adaptive schedule based on revision performance.",nextDate:new Date(Date.now()+days*86400000)}; } catch {} }
  const reason=result==="FAILED"?"This was failed, so the next revision is sooner.":result==="STRUGGLED"?"You struggled, so this is scheduled sooner.":result==="EASY"?"You recalled it easily, so the next revision is farther away.":"The next revision stays near your baseline gap."; return {days,reason,nextDate:new Date(Date.now()+days*86400000)};
}