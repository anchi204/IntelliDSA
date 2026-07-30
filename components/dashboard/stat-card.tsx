import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
}: StatCardProps) {
  return (
    <Card className="transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm text-muted-foreground">
          {title}
        </CardTitle>

        <Icon className="h-8 w-8 text-violet-500" />
      </CardHeader>

      <CardContent>
        <h2 className="text-3xl font-bold">{value}</h2>

        {subtitle && (
          <p className="mt-2 text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}