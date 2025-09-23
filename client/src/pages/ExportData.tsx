import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Download, 
  FileText, 
  Database, 
  Calendar as CalendarIcon,
  Filter,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  dataTypes: {
    aqi: boolean;
    weather: boolean;
    pollutants: boolean;
    iot: boolean;
    chat: boolean;
  };
  locations: string[];
  includeMetadata: boolean;
}

export default function ExportData() {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: {
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      to: new Date()
    },
    dataTypes: {
      aqi: true,
      weather: true,
      pollutants: true,
      iot: false,
      chat: false
    },
    locations: ['Bengaluru Central'],
    includeMetadata: true
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState([
    {
      id: '1',
      filename: 'aqi_data_2024_01_15.csv',
      format: 'CSV',
      size: '2.3 MB',
      records: 1250,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'completed'
    },
    {
      id: '2',
      filename: 'weather_pollutants_2024_01_10.json',
      format: 'JSON',
      size: '5.7 MB',
      records: 2890,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed'
    }
  ]);

  const availableLocations = [
    'Bengaluru Central',
    'Whitefield',
    'Electronic City',
    'Koramangala',
    'Indiranagar',
    'Jayanagar'
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create export data based on selected options
      const exportData = await generateExportData();
      
      // Download the file
      downloadFile(exportData, exportOptions.format);
      
      // Add to export history
      const newExport = {
        id: Date.now().toString(),
        filename: `airquality_export_${format(new Date(), 'yyyy_MM_dd')}.${exportOptions.format}`,
        format: exportOptions.format.toUpperCase(),
        size: '1.2 MB',
        records: 500,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setExportHistory(prev => [newExport, ...prev]);
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateExportData = async () => {
    // Mock data generation based on selected options
    const data = [];
    const startDate = exportOptions.dateRange.from || new Date();
    const endDate = exportOptions.dateRange.to || new Date();
    
    // Generate sample data points
    for (let i = 0; i < 100; i++) {
      const timestamp = new Date(startDate.getTime() + (i * (endDate.getTime() - startDate.getTime()) / 100));
      
      const record: any = {
        timestamp: timestamp.toISOString(),
        location: exportOptions.locations[0] || 'Bengaluru Central'
      };
      
      if (exportOptions.dataTypes.aqi) {
        record.aqi = 80 + Math.floor(Math.random() * 100);
      }
      
      if (exportOptions.dataTypes.pollutants) {
        record.pm25 = 25 + Math.random() * 50;
        record.pm10 = 45 + Math.random() * 70;
        record.co = 1 + Math.random() * 2;
        record.o3 = 60 + Math.random() * 80;
        record.no2 = 30 + Math.random() * 40;
        record.so2 = 10 + Math.random() * 20;
      }
      
      if (exportOptions.dataTypes.weather) {
        record.temperature = 25 + Math.random() * 10;
        record.humidity = 50 + Math.random() * 40;
        record.windSpeed = 5 + Math.random() * 15;
      }
      
      data.push(record);
    }
    
    return data;
  };

  const downloadFile = (data: any[], format: string) => {
    let content = '';
    let mimeType = '';
    let filename = `airquality_export_${format(new Date(), 'yyyy_MM_dd')}`;
    
    switch (format) {
      case 'csv':
        content = convertToCSV(data);
        mimeType = 'text/csv';
        filename += '.csv';
        break;
      case 'json':
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        filename += '.json';
        break;
      case 'xlsx':
        // For demo purposes, we'll export as CSV
        content = convertToCSV(data);
        mimeType = 'text/csv';
        filename += '.csv';
        break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    return csvContent;
  };

  const updateDataType = (type: keyof ExportOptions['dataTypes'], checked: boolean) => {
    setExportOptions(prev => ({
      ...prev,
      dataTypes: {
        ...prev.dataTypes,
        [type]: checked
      }
    }));
  };

  const selectedDataTypes = Object.values(exportOptions.dataTypes).filter(Boolean).length;
  const estimatedRecords = selectedDataTypes * 100; // Mock calculation

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Export Data</h1>
          <p className="text-muted-foreground">Download air quality data for analysis and reporting</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Export Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Range */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Date Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-from">From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date-from"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !exportOptions.dateRange.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {exportOptions.dateRange.from ? (
                            format(exportOptions.dateRange.from, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={exportOptions.dateRange.from}
                          onSelect={(date) => 
                            setExportOptions(prev => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, from: date }
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-to">To</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date-to"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !exportOptions.dateRange.to && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {exportOptions.dateRange.to ? (
                            format(exportOptions.dateRange.to, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={exportOptions.dateRange.to}
                          onSelect={(date) => 
                            setExportOptions(prev => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, to: date }
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Data Types */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Data Types</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="aqi-data"
                        checked={exportOptions.dataTypes.aqi}
                        onCheckedChange={(checked) => updateDataType('aqi', checked as boolean)}
                      />
                      <Label htmlFor="aqi-data">AQI Readings</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="weather-data"
                        checked={exportOptions.dataTypes.weather}
                        onCheckedChange={(checked) => updateDataType('weather', checked as boolean)}
                      />
                      <Label htmlFor="weather-data">Weather Data</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pollutants-data"
                        checked={exportOptions.dataTypes.pollutants}
                        onCheckedChange={(checked) => updateDataType('pollutants', checked as boolean)}
                      />
                      <Label htmlFor="pollutants-data">Pollutant Levels</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="iot-data"
                        checked={exportOptions.dataTypes.iot}
                        onCheckedChange={(checked) => updateDataType('iot', checked as boolean)}
                      />
                      <Label htmlFor="iot-data">IoT Sensor Data</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="chat-data"
                        checked={exportOptions.dataTypes.chat}
                        onCheckedChange={(checked) => updateDataType('chat', checked as boolean)}
                      />
                      <Label htmlFor="chat-data">AI Chat History</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Format and Options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="export-format">Export Format</Label>
                  <Select
                    value={exportOptions.format}
                    onValueChange={(value: 'csv' | 'json' | 'xlsx') => 
                      setExportOptions(prev => ({ ...prev, format: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                      <SelectItem value="json">JSON (JavaScript Object)</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-metadata"
                      checked={exportOptions.includeMetadata}
                      onCheckedChange={(checked) => 
                        setExportOptions(prev => ({ ...prev, includeMetadata: checked as boolean }))
                      }
                    />
                    <Label htmlFor="include-metadata" className="text-sm">Include metadata</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Export Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{estimatedRecords}</div>
                  <div className="text-sm text-muted-foreground">Estimated Records</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{selectedDataTypes}</div>
                  <div className="text-sm text-muted-foreground">Data Types</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">~2.1MB</div>
                  <div className="text-sm text-muted-foreground">Estimated Size</div>
                </div>
              </div>
              
              <Button 
                onClick={handleExport} 
                disabled={isExporting || selectedDataTypes === 0}
                className="w-full mt-4"
                size="lg"
              >
                {isExporting ? (
                  <>
                    <Database className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Export History */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Export History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {exportHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No exports yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {exportHistory.map((export_item) => (
                    <div
                      key={export_item.id}
                      className="p-3 rounded-lg border hover-elevate"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm truncate">
                            {export_item.filename}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {export_item.records} records • {export_item.size}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {export_item.format}
                          </Badge>
                          {export_item.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-chart-1" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-chart-2" />
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(export_item.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Export Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setExportOptions({
                  ...exportOptions,
                  dataTypes: { aqi: true, weather: false, pollutants: false, iot: false, chat: false },
                  format: 'csv'
                })}
              >
                AQI Only (CSV)
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setExportOptions({
                  ...exportOptions,
                  dataTypes: { aqi: true, weather: true, pollutants: true, iot: false, chat: false },
                  format: 'json'
                })}
              >
                Complete Dataset (JSON)
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setExportOptions({
                  ...exportOptions,
                  dataTypes: { aqi: false, weather: false, pollutants: true, iot: false, chat: false },
                  format: 'xlsx'
                })}
              >
                Pollutants Only (Excel)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}