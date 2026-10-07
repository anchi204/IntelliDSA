import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, CheckCircle2, Clock3, Sparkles } from "lucide-react";
import Logo from "@/components/common/logo";
import { buttonVariants } from "@/components/ui/button";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-guided revision",
    text: "Let your history and revision results decide what deserves attention next.",
  },
  {
    icon: BarChart3,
    title: "Progress that makes sense",
    text: "See your solving patterns, weak topics and revision consistency in one place.",
  },
  {
    icon: Clock3,
    title: "Never lose old problems",
    text: "Keep solved questions in a structured tracker instead of relying on memory.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(120,80,200,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,80,200,0.05)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:linear-gradient(to_bottom,black_0%,transparent_78%)]" />
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground sm:inline-flex">
            Sign in
          </Link>
          <Link href="/signup" className={buttonVariants({ size: "sm" })}>
            Get started
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pt-20 lg:pb-20 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-background/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>DSA tracking, revision & AI insights</span>
          </div>

          <h1 className="mt-7 text-5xl font-bold tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
            Stop solving problems.
            <span className="block bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
              Start remembering them.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            IntelliDSA keeps your coding practice organized and uses your
            attempts, revision history and performance to guide what you should
            revisit next.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className={buttonVariants({ size: "lg", className: "h-11 px-6 shadow-lg shadow-primary/20" })}>
              Start tracking problems
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/login" className={buttonVariants({ size: "lg", variant: "outline", className: "h-11 bg-background/80 px-6" })}>
              I already have an account
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border bg-card/90 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-semibold">{title}</h2>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-xl shadow-primary/5">
          <div className="flex items-center gap-1.5 border-b bg-muted/40 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            <span className="ml-3 text-xs text-muted-foreground">IntelliDSA · Today</span>
          </div>
          <div className="grid gap-0 md:grid-cols-[1.35fr_0.65fr]">
            <div className="p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">Today&apos;s focus</p>
                  <h3 className="mt-1 text-xl font-semibold">Your revision queue</h3>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">5 problems</span>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  ["LRU Cache", "Hash Table · Hard", "Overdue 2d"],
                  ["Number of Islands", "Graphs · Medium", "Due today"],
                  ["House Robber", "DP · Medium", "Due today"],
                ].map(([title, meta, status], index) => (
                  <div key={title} className="flex items-center gap-3 rounded-xl border bg-background/70 p-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">{index + 1}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>
                    </div>
                    <span className="hidden rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground sm:inline-flex">{status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t bg-gradient-to-br from-primary/[0.08] to-transparent p-5 md:border-l md:border-t-0 sm:p-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-primary">AI insight</p>
              <p className="mt-2 text-lg font-semibold leading-7">Your graph problems need a little more attention this week.</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Insights are based on your actual attempts and revision outcomes.</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-medium text-primary">
                Personalized from your history
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
