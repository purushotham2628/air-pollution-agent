import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Wind, Eye } from "lucide-react";

interface WeatherCardProps {
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  location: string;
  condition: string;
}

export default function WeatherCard({ temperature, humidity, windSpeed, visibility, location, condition }: WeatherCardProps) {
  return (
    <Card className="hover-elevate" data-testid="card-weather">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{location} Weather</CardTitle>
        <Thermometer className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold font-mono" data-testid="text-temperature">
              {temperature}°C
            </div>
            <div className="text-sm text-muted-foreground">{condition}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Droplets className="h-3 w-3 text-blue-500" />
              <div>
                <div className="font-medium">{humidity}%</div>
                <div className="text-xs text-muted-foreground">Humidity</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Wind className="h-3 w-3 text-green-500" />
              <div>
                <div className="font-medium">{windSpeed} km/h</div>
                <div className="text-xs text-muted-foreground">Wind</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Eye className="h-3 w-3 text-purple-500" />
              <div>
                <div className="font-medium">{visibility} km</div>
                <div className="text-xs text-muted-foreground">Visibility</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}