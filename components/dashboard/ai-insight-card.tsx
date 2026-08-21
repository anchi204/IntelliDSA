"use client";

import { useEffect, useState } from "react";
import { Brain, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AIInsightCard() {
  const [text, setText] = useState("Generating a personalized insight...");
  const [isAI, setIsAI] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchInsight() {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/insight", { cache: "no-store" });
      const data = await response.json();
      setIsAI(Boolean(data.available));
      setText(data.available ? data.insight : (data.fallback || data.message || "AI insights are currently unavailable."));
    } catch { setIsAI(false); setText("AI insights are currently unavailable. Check your server configuration and try again."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void fetchInsight(); }, []);

  return <Card>
    <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5" />{isAI ? "AI Insight" : "Tracker Insight"}</CardTitle><Button variant="ghost" size="icon-sm" onClick={() => void fetchInsight()} disabled={loading} aria-label="Refresh insight"><RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} /></Button></CardHeader>
    <CardContent><p className="whitespace-pre-line leading-7 text-muted-foreground">{text}</p></CardContent>
  </Card>;
}
