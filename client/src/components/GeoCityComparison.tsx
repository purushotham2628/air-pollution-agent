import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, TrendingUp, TrendingDown, Minus, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CityAQIData {
  location: string;
  state?: string;
  aqi: number;
  pm25: number;
  pm10: number;
  co: number;
  o3: number;
  no2: number;
  so2: number;
  timestamp: Date;
  source: string;
}

interface GeoCityComparisonProps {
  className?: string;
}

const INDIAN_CITIES = [
  'Bengaluru', 'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

function getAQICategory(aqi: number) {
  if (aqi <= 50) return { label: "Good", color: "bg-chart-1 text-white", bgColor: "bg-chart-1/10" };
  if (aqi <= 100) return { label: "Moderate", color: "bg-chart-2 text-white", bgColor: "bg-chart-2/10" };
  if (aqi <= 150) return { label: "Unhealthy for Sensitive", color: "bg-chart-3 text-white", bgColor: "bg-chart-3/10" };
  if (aqi <= 200) return { label: "Unhealthy", color: "bg-chart-4 text-white", bgColor: "bg-chart-4/10" };
  if (aqi <= 300) return { label: "Very Unhealthy", color: "bg-chart-5 text-white", bgColor: "bg-chart-5/10" };
  return { label: "Hazardous", color: "bg-chart-5 text-white", bgColor: "bg-chart-5/10" };
}

function getAQITrend(current: number, baseline: number = 100) {
  const diff = current - baseline;
  if (Math.abs(diff) < 5) return "stable";
  return diff > 0 ? "up" : "down";
}

export default function GeoCityComparison({ className }: GeoCityComparisonProps) {
  const [selectedCities, setSelectedCities] = useState<string[]>(['Bengaluru', 'Delhi', 'Mumbai']);
  const [cityData, setCityData] = useState<CityAQIData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCityData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cities/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cities: selectedCities }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch city data');
      }
      
      const data = await response.json();
      setCityData(data.cities || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Geo comparison error:', error);
      // Fallback to mock data
      const mockData = selectedCities.map((city, index) => ({
        location: city,
        state: 'Demo State',
        aqi: 80 + index * 30 + Math.floor(Math.random() * 40),
        pm25: 35 + Math.floor(Math.random() * 20),
        pm10: 68 + Math.floor(Math.random() * 30),
        co: 1.2 + Math.random() * 0.8,
        o3: 85 + Math.floor(Math.random() * 30),
        no2: 42 + Math.floor(Math.random() * 20),
        so2: 15 + Math.floor(Math.random() * 10),
        temperature: 25 + Math.floor(Math.random() * 8),
        humidity: 55 + Math.floor(Math.random() * 30),
        windSpeed: 8 + Math.floor(Math.random() * 12),
        timestamp: new Date(),
        source: 'mock'
      }));
      setCityData(mockData);
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCityData();
  }, [selectedCities]);

  const handleCitySelection = (city: string) => {
    if (selectedCities.includes(city)) {
      if (selectedCities.length > 1) {
        setSelectedCities(prev => prev.filter(c => c !== city));
      }
    } else {
      if (selectedCities.length < 5) {
        setSelectedCities(prev => [...prev, city]);
      }
    }
  };

  const sortedData = [...cityData].sort((a, b) => b.aqi - a.aqi);
  const bestCity = sortedData[sortedData.length - 1];
  const worstCity = sortedData[0];

  return (
    <Card className={cn("hover-elevate", className)} data-testid="card-geo-comparison">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Multi-City AQI Comparison</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={fetchCityData}
            disabled={isLoading}
            data-testid="button-refresh-cities"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* City Selection */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Select Cities to Compare (max 5):</div>
          <div className="flex flex-wrap gap-2">
            {INDIAN_CITIES.map(city => (
              <Button
                key={city}
                size="sm"
                variant={selectedCities.includes(city) ? "default" : "outline"}
                onClick={() => handleCitySelection(city)}
                disabled={!selectedCities.includes(city) && selectedCities.length >= 5}
                data-testid={`button-city-${city.toLowerCase()}`}
                className="text-xs"
              >
                {city}
              </Button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        {cityData.length > 0 && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Best Air Quality</div>
              <div className="font-medium text-chart-1">
                {bestCity?.location} ({bestCity?.aqi})
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Worst Air Quality</div>
              <div className="font-medium text-chart-4">
                {worstCity?.location} ({worstCity?.aqi})
              </div>
            </div>
          </div>
        )}

        {/* City Comparison Grid */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p>Loading city data...</p>
            </div>
          ) : (
            sortedData.map((city, index) => {
              const category = getAQICategory(city.aqi);
              const trend = getAQITrend(city.aqi);
              const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
              
              return (
                <div
                  key={city.location}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-colors hover-elevate",
                    category.bgColor
                  )}
                  data-testid={`city-comparison-${city.location.toLowerCase()}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                      <div>
                        <div className="font-medium">{city.location}</div>
                        {city.state && (
                          <div className="text-xs text-muted-foreground">{city.state}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-bold font-mono">{city.aqi}</div>
                      <Badge className={cn("text-xs", category.color)}>
                        {category.label}
                      </Badge>
                    </div>
                    <TrendIcon className={cn(
                      "h-4 w-4",
                      trend === "up" ? "text-chart-4" : 
                      trend === "down" ? "text-chart-1" : 
                      "text-muted-foreground"
                    )} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detailed Pollutant Comparison */}
        {cityData.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Pollutant Levels Comparison</div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-1">City</th>
                    <th className="text-center p-1">PM2.5</th>
                    <th className="text-center p-1">PM10</th>
                    <th className="text-center p-1">CO</th>
                    <th className="text-center p-1">O₃</th>
                    <th className="text-center p-1">NO₂</th>
                    <th className="text-center p-1">SO₂</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map(city => (
                    <tr key={city.location} className="border-b border-muted">
                      <td className="font-medium p-1">{city.location}</td>
                      <td className="text-center p-1">{Math.round(city.pm25)}</td>
                      <td className="text-center p-1">{Math.round(city.pm10)}</td>
                      <td className="text-center p-1">{city.co.toFixed(1)}</td>
                      <td className="text-center p-1">{Math.round(city.o3)}</td>
                      <td className="text-center p-1">{Math.round(city.no2)}</td>
                      <td className="text-center p-1">{Math.round(city.so2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {lastUpdated && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}