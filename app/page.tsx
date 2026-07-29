import Logo from "@/components/common/logo";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center">
        <Logo />

        <h2 className="max-w-2xl text-5xl font-bold tracking-tight">
          Master DSA with AI
        </h2>

        <p className="max-w-xl text-muted-foreground">
          Track problems, schedule revisions, analyze your progress,
          and receive personalized AI-powered learning insights.
        </p>

        <Button size="lg">
          Get Started
        </Button>
      </div>
    </main>
  );
}