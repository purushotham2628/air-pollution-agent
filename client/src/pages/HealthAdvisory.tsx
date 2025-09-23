import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  AlertTriangle, 
  Heart, 
  Leaf, 
  Users, 
  RefreshCw,
  Baby,
  Activity,
  Mask
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AQIData {
  currentAQI: number;
  location: string;
  pollutants: {
    pm25: number;
    pm10: number;
    co: number;
    o3: number;
    no2: number;
    so2: number;
  };
  timestamp: string;
}

export default function HealthAdvisory() {
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAQIData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/aqi/bengaluru');
      const data = await response.json();
      setAqiData(data);
    } catch (error) {
      console.error('Failed to fetch AQI data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAQIData();
    const interval = setInterval(fetchAQIData, 300000);
    return () => clearInterval(interval);
  }, []);

  const getHealthRecommendations = (aqi: number) => {
    if (aqi <= 50) {
      return {
        level: "Good",
        color: "bg-chart-1 text-white",
        icon: Leaf,
        generalAdvice: "Air quality is excellent. Perfect conditions for all outdoor activities.",
        recommendations: [
          "Ideal time for outdoor exercise and recreation",
          "Safe for all groups including sensitive individuals",
          "Windows can be kept open for natural ventilation",
          "No protective measures needed"
        ],
        sensitiveGroups: "No restrictions for any group",
        activities: {
          exercise: "Recommended",
          children: "Safe to play outside",
          elderly: "No restrictions"
        }
      };
    }
    
    if (aqi <= 100) {
      return {
        level: "Moderate",
        color: "bg-chart-2 text-white",
        icon: Shield,
        generalAdvice: "Air quality is acceptable for most people, though sensitive individuals may experience minor issues.",
        recommendations: [
          "Generally safe for outdoor activities",
          "Sensitive individuals may experience minor symptoms",
          "Consider reducing prolonged outdoor exertion",
          "Monitor air quality if you have respiratory conditions"
        ],
        sensitiveGroups: "Children and elderly should limit extended outdoor activities",
        activities: {
          exercise: "Generally safe, monitor symptoms",
          children: "Safe with breaks",
          elderly: "Limit prolonged exposure"
        }
      };
    }
    
    if (aqi <= 150) {
      return {
        level: "Unhealthy for Sensitive Groups",
        color: "bg-chart-3 text-white",
        icon: Users,
        generalAdvice: "Sensitive groups should take precautions. Healthy individuals may experience minor irritation.",
        recommendations: [
          "Sensitive groups should limit outdoor activities",
          "Wear N95 masks when going outside",
          "Keep windows closed, use air purifiers",
          "Reduce outdoor exercise intensity"
        ],
        sensitiveGroups: "Children, elderly, and people with heart/lung conditions should avoid outdoor exertion",
        activities: {
          exercise: "Limit intensity, consider indoor alternatives",
          children: "Limit outdoor play time",
          elderly: "Stay indoors when possible"
        }
      };
    }
    
    if (aqi <= 200) {
      return {
        level: "Unhealthy",
        color: "bg-chart-4 text-white",
        icon: Heart,
        generalAdvice: "Everyone should limit outdoor activities. Health effects may be experienced by all.",
        recommendations: [
          "Everyone should limit outdoor activities",
          "Wear N95 or better masks outside",
          "Use air purifiers indoors, avoid opening windows",
          "Postpone outdoor exercise"
        ],
        sensitiveGroups: "Everyone should avoid prolonged outdoor exertion",
        activities: {
          exercise: "Move workouts indoors",
          children: "Keep indoors, limit outdoor exposure",
          elderly: "Stay indoors with air filtration"
        }
      };
    }
    
    return {
      level: "Hazardous",
      color: "bg-chart-5 text-white",
      icon: AlertTriangle,
      generalAdvice: "Health alert: everyone may experience serious health effects. Avoid all outdoor activities.",
      recommendations: [
        "Avoid all outdoor activities",
        "Stay indoors with air purifiers running",
        "Wear N95 masks even for brief outdoor exposure",
        "Consider relocating temporarily if possible",
        "Seek medical attention if experiencing symptoms"
      ],
      sensitiveGroups: "Everyone should avoid outdoor activities entirely",
      activities: {
        exercise: "Indoor only with air filtration",
        children: "Keep indoors at all times",
        elderly: "Emergency indoor protocols"
      }
    };
  };

  if (isLoading || !aqiData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Health Advisory</h1>
          <Button disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const advisory = getHealthRecommendations(aqiData.currentAQI);
  const Icon = advisory.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health Advisory</h1>
          <p className="text-muted-foreground">Personalized health recommendations based on current air quality</p>
        </div>
        <Button onClick={fetchAQIData} disabled={isLoading}>
          <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Current Status Alert */}
      <Alert className={cn("border-2", 
        aqiData.currentAQI <= 50 ? "border-chart-1 bg-chart-1/10" :
        aqiData.currentAQI <= 100 ? "border-chart-2 bg-chart-2/10" :
        aqiData.currentAQI <= 150 ? "border-chart-3 bg-chart-3/10" :
        aqiData.currentAQI <= 200 ? "border-chart-4 bg-chart-4/10" :
        "border-chart-5 bg-chart-5/10"
      )}>
        <Icon className="h-5 w-5" />
        <AlertDescription className="text-base">
          <strong>Current Status:</strong> {advisory.generalAdvice}
        </AlertDescription>
      </Alert>

      {/* Main Advisory Card */}
      <Card className="hover-elevate">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Air Quality Assessment</CardTitle>
            <div className="text-right">
              <div className="text-3xl font-bold font-mono">{aqiData.currentAQI}</div>
              <Badge className={advisory.color}>{advisory.level}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              General Recommendations
            </h3>
            <ul className="space-y-2">
              {advisory.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <Alert className="border-orange-200 dark:border-orange-800">
            <Users className="h-4 w-4" />
            <AlertDescription>
              <strong>Sensitive Groups:</strong> {advisory.sensitiveGroups}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Activity-Specific Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Exercise & Sports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{advisory.activities.exercise}</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Baby className="h-5 w-5" />
              Children's Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{advisory.activities.children}</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Elderly Care
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{advisory.activities.elderly}</p>
          </CardContent>
        </Card>
      </div>

      {/* Protective Measures */}
      <Card className="hover-elevate">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mask className="h-5 w-5" />
            Protective Measures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Recommended Actions:</h4>
              <ul className="text-sm space-y-1">
                {aqiData.currentAQI > 100 && <li>• Use N95 or KN95 masks outdoors</li>}
                {aqiData.currentAQI > 150 && <li>• Run air purifiers indoors</li>}
                {aqiData.currentAQI > 150 && <li>• Keep windows and doors closed</li>}
                {aqiData.currentAQI > 200 && <li>• Avoid all outdoor activities</li>}
                <li>• Stay hydrated</li>
                <li>• Monitor symptoms</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">When to Seek Medical Help:</h4>
              <ul className="text-sm space-y-1">
                <li>• Persistent cough or throat irritation</li>
                <li>• Difficulty breathing</li>
                <li>• Chest pain or tightness</li>
                <li>• Unusual fatigue</li>
                <li>• Worsening of existing conditions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground text-center">
        Last updated: {new Date(aqiData.timestamp).toLocaleString()}
      </div>
    </div>
  );
}