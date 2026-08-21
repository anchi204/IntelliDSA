import Link from "next/link";
import Logo from "@/components/common/logo";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <Logo />

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Master DSA with AI
        </h1>

        <p className="max-w-xl text-muted-foreground">
          Track problems, schedule revisions, analyze your progress, and
          receive personalized AI-powered learning insights.
        </p>

        <Link
          href="/dashboard"
          className={buttonVariants({ size: "lg" })}
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}