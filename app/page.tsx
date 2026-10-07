import Link from "next/link";
import Logo from "@/components/common/logo";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <Link href="/login" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
          Sign in
        </Link>
      </header>

      <section className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6 pb-20 pt-8">
        <div className="w-full max-w-2xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-semibold text-primary-foreground shadow-sm">
            I
          </div>

          <h1 className="mt-7 text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Master DSA with AI
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Track your coding problems, revise at the right time, and understand
            your progress with personalized AI insights.
          </p>

          <div className="mt-8">
            <Link
              href="/signup"
              className={buttonVariants({
                size: "lg",
                className: "px-7 shadow-sm",
              })}
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
