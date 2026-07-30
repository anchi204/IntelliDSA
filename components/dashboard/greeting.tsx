export default function Greeting() {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <div>
      <h1 className="text-4xl font-bold">
        {greeting} 👋
      </h1>

      <p className="mt-2 text-muted-foreground">
        Ready to solve your next problem?
      </p>
    </div>
  );
}