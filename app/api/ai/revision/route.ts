import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { buildUserInsights, rankCandidates } from "@/lib/revision-engine";
import OpenAI from "openai";
import { NextResponse } from "next/server";
const ai=process.env.OPENAI_API_KEY?new OpenAI({apiKey:process.env.OPENAI_API_KEY}):null;
export async function POST(){
 try {
  const user=await requireUser(); const now=new Date();
  const due=await prisma.problem.findMany({where:{userId:user.id,revisionEnabled:true,solved:true,revisionDate:{lte:now}},include:{attempts:{orderBy:{attemptedAt:"desc"},take:30},revisions:{orderBy:{revisedAt:"desc"},take:10}}});
  const candidates=due.filter((p:any)=>p.revisionCount<p.maxRevisions);
  if(!candidates.length) return NextResponse.json({queue:[],recommendation:"No revisions are due right now. Keep solving and IntelliDSA will build the next queue automatically."});
  const all=await prisma.problem.findMany({where:{userId:user.id},include:{attempts:{orderBy:{attemptedAt:"desc"},take:50},revisions:{orderBy:{revisedAt:"desc"},take:20}}});
  const ranked=rankCandidates(candidates,buildUserInsights(all));
  let queue=ranked.slice(0,6).map((x:any)=>({id:x.problem.id,title:x.problem.title,topic:x.problem.topic,difficulty:x.problem.difficulty,revisionCount:x.problem.revisionCount,maxRevisions:x.problem.maxRevisions,overdueDays:x.overdueDays,priority:x.score,reason:"Prioritized using attempts, revision outcomes, topic performance, difficulty and overdue time."}));
  if(ai && ranked.length>1) { try { const r=await ai.responses.create({model:"gpt-5-mini",input:"Return ONLY JSON array of at most 6 problem IDs from this candidate list. Prioritize overdue items, weak topics, failures/struggles, revision urgency, then topic diversity. Never invent IDs. Candidates: "+JSON.stringify(ranked.slice(0,12).map((x:any)=>({id:x.problem.id,title:x.problem.title,topic:x.problem.topic,difficulty:x.problem.difficulty,score:x.score,overdueDays:x.overdueDays,revisionCount:x.problem.revisionCount,maxRevisions:x.problem.maxRevisions,failedAttempts:x.problem.attempts.filter((a:any)=>!a.solved).length}))) }); const ids=JSON.parse(r.output_text); if(Array.isArray(ids)){const m=new Map(queue.map((x:any)=>[x.id,x])); queue=ids.filter((id:any)=>m.has(Number(id))).slice(0,6).map((id:any)=>m.get(Number(id)));}} catch {} }
  return NextResponse.json({queue,recommendation:"You have "+queue.length+" priority revision"+(queue.length===1?"":"s")+" today. The order adapts to your history and revision performance."});
 } catch(e) { if(e instanceof Error&&e.message==="UNAUTHORIZED") return NextResponse.json({message:"Authentication required"},{status:401}); console.error(e); return NextResponse.json({message:"Failed to build revision queue"},{status:500}); }
}