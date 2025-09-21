import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, Heart, Leaf, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthAdvisoryProps {
  aqi: number;
  location: string;
}

function getHealthRecommendations(aqi: number) {
  if (aqi <= 50) {
    return {
      level: "Good",
      color: "bg-chart-1 text-white",
      icon: Leaf,
      recommendations: [
        "Perfect air quality for outdoor activities",
        "Safe for all groups including sensitive individuals",
        "Ideal time for exercise and recreation"
      ],
      sensitiveGroups: "No precautions needed"
    };
  }
  
  if (aqi <= 100) {
    return {
      level: "Moderate",
      color: "bg-chart-2 text-white",
      icon: Shield,
      recommendations: [
        "Generally safe for outdoor activities",
        "Sensitive individuals may experience minor symptoms",
        "Consider reducing prolonged outdoor exertion"
      ],
      sensitiveGroups: "Children and elderly should limit extended outdoor activities"
    };
  }
  
  if (aqi <= 150) {
    return {
      level: "Unhealthy for Sensitive Groups",
      color: "bg-chart-3 text-white",
      icon: Users,
      recommendations: [
        "Sensitive groups should limit outdoor activities",
        "Wear N95 masks when going outside",
        "Keep windows closed, use air purifiers"
      ],
      sensitiveGroups: "Children, elderly, and people with heart/lung conditions should avoid outdoor exertion"
    };
  }
  
  if (aqi <= 200) {
    return {
      level: "Unhealthy",
      color: "bg-chart-4 text-white",
      icon: Heart,
      recommendations: [
        "Everyone should limit outdoor activities",
        "Wear N95 or better masks outside",
        "Use air purifiers indoors, avoid opening windows"
      ],
      sensitiveGroups: "Everyone should avoid prolonged outdoor exertion"
    };
  }
  
  return {
    level: "Hazardous",
    color: "bg-chart-5 text-white",
    icon: AlertTriangle,
    recommendations: [
      "Avoid all outdoor activities",
      "Stay indoors with air purifiers running",
      "Wear N95 masks even for brief outdoor exposure",
      "Consider relocating temporarily if possible"
    ],
    sensitiveGroups: "Everyone should avoid outdoor activities entirely"
  };
}

export default function HealthAdvisory({ aqi, location }: HealthAdvisoryProps) {
  const advisory = getHealthRecommendations(aqi);
  const Icon = advisory.icon;

  return (
    <Card className="hover-elevate" data-testid="card-health-advisory">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Health Advisory</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">{location} Air Quality</div>
            <Badge className={cn("text-sm", advisory.color)} data-testid="badge-advisory-level">
              {advisory.level}
            </Badge>
          </div>
          <div className="text-2xl font-bold font-mono text-muted-foreground">
            {aqi} AQI
          </div>
        </div>

        <Alert className="border-orange-200 dark:border-orange-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Sensitive Groups:</strong> {advisory.sensitiveGroups}
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Recommendations:</h4>
          <ul className="space-y-2">
            {advisory.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span data-testid={`text-recommendation-${index}`}>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}