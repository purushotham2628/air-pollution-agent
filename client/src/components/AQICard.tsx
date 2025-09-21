import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wind, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AQICardProps {
  aqi: number;
  location: string;
  lastUpdated: string;
  trend?: "up" | "down" | "stable";
}

function getAQICategory(aqi: number) {
  if (aqi <= 50) return { label: "Good", color: "bg-chart-1 text-white", icon: CheckCircle };
  if (aqi <= 100) return { label: "Moderate", color: "bg-chart-2 text-white", icon: Wind };
  if (aqi <= 150) return { label: "Unhealthy for Sensitive", color: "bg-chart-3 text-white", icon: AlertTriangle };
  if (aqi <= 200) return { label: "Unhealthy", color: "bg-chart-4 text-white", icon: AlertTriangle };
  if (aqi <= 300) return { label: "Very Unhealthy", color: "bg-chart-5 text-white", icon: XCircle };
  return { label: "Hazardous", color: "bg-chart-5 text-white", icon: XCircle };
}

export default function AQICard({ aqi, location, lastUpdated, trend }: AQICardProps) {
  const category = getAQICategory(aqi);
  const Icon = category.icon;

  return (
    <Card className="hover-elevate" data-testid="card-aqi">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{location} AQI</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono" data-testid="text-aqi-value">{aqi}</div>
            <Badge className={cn("text-xs", category.color)} data-testid="badge-aqi-category">
              {category.label}
            </Badge>
          </div>
          {trend && (
            <div className={cn(
              "text-xs px-2 py-1 rounded",
              trend === "up" ? "text-chart-4 bg-chart-4/10" : 
              trend === "down" ? "text-chart-1 bg-chart-1/10" : 
              "text-muted-foreground bg-muted"
            )}>
              {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2" data-testid="text-last-updated">
          Updated {lastUpdated}
        </p>
      </CardContent>
    </Card>
  );
}