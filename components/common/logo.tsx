export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold text-white">
        I
      </div>

      <div>
        <h1 className="text-lg font-bold tracking-tight">
          IntelliDSA
        </h1>

        <p className="text-xs text-muted-foreground">
          AI Learning Platform
        </p>
      </div>
    </div>
  );
}