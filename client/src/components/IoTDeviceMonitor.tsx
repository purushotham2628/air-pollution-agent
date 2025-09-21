import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Wifi, 
  WifiOff, 
  Battery, 
  Thermometer, 
  Droplets, 
  Wind, 
  Signal,
  Circle,
  Power
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IoTReading {
  deviceId: string;
  location: string;
  pm25: number;
  pm10: number;
  temperature: number;
  humidity: number;
  batteryLevel: number;
  signalStrength: number;
  timestamp: string;
}

interface IoTDevice {
  id: string;
  location: string;
  lastSeen: Date;
  isOnline: boolean;
  latestReading?: IoTReading;
}

interface IoTDeviceMonitorProps {
  className?: string;
}

function getDeviceStatus(lastSeen: Date): 'online' | 'warning' | 'offline' {
  const timeDiff = Date.now() - lastSeen.getTime();
  if (timeDiff < 60000) return 'online';     // < 1 minute
  if (timeDiff < 300000) return 'warning';   // < 5 minutes  
  return 'offline';                          // > 5 minutes
}

function getBatteryIcon(level: number) {
  if (level > 75) return "🔋";
  if (level > 50) return "🔋";
  if (level > 25) return "🪫";
  return "🪫";
}

export default function IoTDeviceMonitor({ className }: IoTDeviceMonitorProps) {
  const [devices, setDevices] = useState<Map<string, IoTDevice>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    setConnectionStatus('connecting');
    
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected to IoT stream');
        setIsConnected(true);
        setConnectionStatus('connected');
        
        // Subscribe to IoT updates
        wsRef.current?.send(JSON.stringify({
          type: 'subscribe',
          subscription: 'iot_readings'
        }));
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'iot_update') {
            const reading: IoTReading = {
              deviceId: message.deviceId,
              location: message.location,
              pm25: message.data.pm25,
              pm10: message.data.pm10,
              temperature: message.data.temperature,
              humidity: message.data.humidity,
              batteryLevel: message.data.batteryLevel,
              signalStrength: message.data.signalStrength,
              timestamp: message.timestamp
            };
            
            setDevices(prev => {
              const newDevices = new Map(prev);
              const device: IoTDevice = {
                id: reading.deviceId,
                location: reading.location,
                lastSeen: new Date(reading.timestamp),
                isOnline: true,
                latestReading: reading
              };
              newDevices.set(reading.deviceId, device);
              return newDevices;
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
        // Auto-reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setConnectionStatus('disconnected');
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('disconnected');
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
    setIsConnected(false);
    setConnectionStatus('disconnected');
  };

  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, []);

  // Update device online status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => {
        const newDevices = new Map(prev);
        newDevices.forEach((device, deviceId) => {
          const status = getDeviceStatus(device.lastSeen);
          device.isOnline = status === 'online';
        });
        return newDevices;
      });
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const deviceArray = Array.from(devices.values());
  const onlineCount = deviceArray.filter(d => d.isOnline).length;

  return (
    <Card className={cn("hover-elevate", className)} data-testid="card-iot-monitor">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">IoT Device Monitor</CardTitle>
        <div className="flex items-center gap-2">
          <Badge 
            variant={isConnected ? "default" : "destructive"}
            className="text-xs"
            data-testid="badge-connection-status"
          >
            {isConnected ? (
              <><Wifi className="h-3 w-3 mr-1" />Connected</>
            ) : (
              <><WifiOff className="h-3 w-3 mr-1" />Disconnected</>
            )}
          </Badge>
          {isConnected ? (
            <Button size="sm" variant="outline" onClick={disconnect} data-testid="button-disconnect">
              Disconnect
            </Button>
          ) : (
            <Button size="sm" onClick={connectWebSocket} data-testid="button-connect">
              Connect
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Circle className={cn(
              "h-3 w-3",
              connectionStatus === 'connected' ? "fill-chart-1 text-chart-1" :
              connectionStatus === 'connecting' ? "fill-chart-2 text-chart-2 animate-pulse" :
              "fill-chart-4 text-chart-4"
            )} />
            <span className="text-sm font-medium">
              {connectionStatus === 'connected' ? 'Live Stream Active' :
               connectionStatus === 'connecting' ? 'Connecting...' :
               'Stream Offline'}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {onlineCount} of {deviceArray.length} devices online
          </div>
        </div>

        {/* Device List */}
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {deviceArray.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Power className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No IoT devices detected</p>
                <p className="text-xs">Connect to WebSocket stream to see real-time data</p>
              </div>
            ) : (
              deviceArray.map(device => {
                const status = getDeviceStatus(device.lastSeen);
                const reading = device.latestReading;
                
                return (
                  <div
                    key={device.id}
                    className={cn(
                      "p-3 rounded-lg border transition-colors hover-elevate",
                      status === 'online' ? "border-chart-1/20 bg-chart-1/5" :
                      status === 'warning' ? "border-chart-2/20 bg-chart-2/5" :
                      "border-chart-4/20 bg-chart-4/5"
                    )}
                    data-testid={`device-${device.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-sm">{device.location}</div>
                        <div className="text-xs text-muted-foreground">{device.id}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={status === 'online' ? "default" : status === 'warning' ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {status}
                        </Badge>
                        <Circle className={cn(
                          "h-2 w-2",
                          status === 'online' ? "fill-chart-1 text-chart-1" :
                          status === 'warning' ? "fill-chart-2 text-chart-2" :
                          "fill-chart-4 text-chart-4"
                        )} />
                      </div>
                    </div>
                    
                    {reading && (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <Wind className="h-3 w-3 text-muted-foreground" />
                          <span>PM2.5: {reading.pm25.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Thermometer className="h-3 w-3 text-muted-foreground" />
                          <span>{reading.temperature.toFixed(1)}°C</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="h-3 w-3 text-muted-foreground" />
                          <span>{reading.humidity.toFixed(0)}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Battery className="h-3 w-3 text-muted-foreground" />
                          <span>{reading.batteryLevel.toFixed(0)}%</span>
                        </div>
                      </div>
                    )}
                    
                    {reading && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Battery</span>
                            <span>{reading.batteryLevel.toFixed(0)}%</span>
                          </div>
                          <Progress value={reading.batteryLevel} className="h-1" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Signal</span>
                            <span>{reading.signalStrength.toFixed(0)}%</span>
                          </div>
                          <Progress value={reading.signalStrength} className="h-1" />
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground mt-2">
                      Last seen: {device.lastSeen.toLocaleTimeString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
        
        {deviceArray.length > 0 && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Real-time data via WebSocket • Updates every 30 seconds
          </div>
        )}
      </CardContent>
    </Card>
  );
}