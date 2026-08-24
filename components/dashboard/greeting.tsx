export default function Greeting() {
  const hour = new Date().getHours();

  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/[0.08] via-background to-background px-6 py-7 sm:px-8">
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Your DSA workspace
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {greeting}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          Stay consistent, revise what matters, and keep moving toward your goal.
        </p>
      </div>
      <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/[0.06] blur-2xl" />
      <div className="absolute -bottom-20 right-24 h-32 w-32 rounded-full bg-primary/[0.04] blur-2xl" />
    </div>
  );
}
