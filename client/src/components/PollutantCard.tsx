import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PollutantCardProps {
  name: string;
  value: number;
  unit: string;
  safeLimit: number;
  trend?: "up" | "down" | "stable";
}

function getPollutantStatus(value: number, safeLimit: number) {
  const ratio = value / safeLimit;
  if (ratio <= 0.5) return { color: "bg-chart-1", level: "Good" };
  if (ratio <= 1) return { color: "bg-chart-2", level: "Moderate" };
  if (ratio <= 1.5) return { color: "bg-chart-3", level: "Poor" };
  return { color: "bg-chart-4", level: "Severe" };
}

export default function PollutantCard({ name, value, unit, safeLimit, trend }: PollutantCardProps) {
  const status = getPollutantStatus(value, safeLimit);
  const percentage = Math.min((value / safeLimit) * 100, 100);
  
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <Card className="hover-elevate" data-testid={`card-pollutant-${name.toLowerCase()}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        <TrendIcon className={cn(
          "h-4 w-4",
          trend === "up" ? "text-chart-4" : 
          trend === "down" ? "text-chart-1" : 
          "text-muted-foreground"
        )} />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold font-mono" data-testid="text-pollutant-value">
              {value}
            </div>
            <div className="text-sm text-muted-foreground">{unit}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className={cn("px-2 py-1 rounded text-white", status.color)}>
                {status.level}
              </span>
              <span className="text-muted-foreground">
                Safe: {safeLimit} {unit}
              </span>
            </div>
            <Progress 
              value={percentage} 
              className="h-2" 
              data-testid="progress-pollutant-level"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}