import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Calendar as CalendarIcon, 
  FileText, 
  Database, 
  CheckCircle,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ExportOptions {
  format: 'json' | 'csv' | 'xlsx';
  dateRange: {
    from: Date;
    to: Date;
  };
  dataTypes: {
    aqi: boolean;
    pollutants: boolean;
    weather: boolean;
    predictions: boolean;
  };
  locations: string[];
  includeMetadata: boolean;
}

export default function ExportData() {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    dateRange: {
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      to: new Date()
    },
    dataTypes: {
      aqi: true,
      pollutants: true,
      weather: false,
      predictions: false
    },
    locations: ['Bengaluru Central'],
    includeMetadata: false
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [exportedData, setExportedData] = useState<any>(null);

  const availableLocations = [
    'Bengaluru Central',
    'Whitefield', 
    'Electronic City',
    'Koramangala',
    'Indiranagar',
    'HSR Layout'
  ];

  const handleLocationToggle = (location: string, checked: boolean) => {
    setExportOptions(prev => ({
      ...prev,
      locations: checked 
        ? [...prev.locations, location]
        : prev.locations.filter(l => l !== location)
    }));
  };

  const handleDataTypeToggle = (dataType: keyof ExportOptions['dataTypes'], checked: boolean) => {
    setExportOptions(prev => ({
      ...prev,
      dataTypes: {
        ...prev.dataTypes,
        [dataType]: checked
      }
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus('idle');
    
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exportOptions),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const result = await response.json();
      setExportedData(result);
      
      // Create and download file
      const filename = `air-quality-data-${format(exportOptions.dateRange.from, 'yyyy-MM-dd')}-to-${format(exportOptions.dateRange.to, 'yyyy-MM-dd')}.${exportOptions.format}`;
      
      let content: string;
      let mimeType: string;
      
      switch (exportOptions.format) {
        case 'json':
          content = JSON.stringify(result.data, null, 2);
          mimeType = 'application/json';
          break;
        case 'csv':
          content = convertToCSV(result.data);
          mimeType = 'text/csv';
          break;
        default:
          content = JSON.stringify(result.data, null, 2);
          mimeType = 'application/json';
      }
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      
      setExportStatus('success');
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  const estimatedRecords = exportOptions.locations.length * 
    Math.ceil((exportOptions.dateRange.to.getTime() - exportOptions.dateRange.from.getTime()) / (1000 * 60 * 60)); // Hourly data

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Export Data</h1>
          <p className="text-muted-foreground">Download historical air quality data for analysis</p>
        </div>
        <Button 
          onClick={handleExport} 
          disabled={isExporting || exportOptions.locations.length === 0}
          className="min-w-32"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Format Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Export Format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={exportOptions.format}
                onValueChange={(value: 'json' | 'csv' | 'xlsx') => 
                  setExportOptions(prev => ({ ...prev, format: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON (.json)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="xlsx" disabled>Excel (.xlsx) - Coming Soon</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Date Range Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Date Range
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(exportOptions.dateRange.from, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={exportOptions.dateRange.from}
                        onSelect={(date) => date && setExportOptions(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, from: date }
                        }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(exportOptions.dateRange.to, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={exportOptions.dateRange.to}
                        onSelect={(date) => date && setExportOptions(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, to: date }
                        }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setExportOptions(prev => ({
                    ...prev,
                    dateRange: {
                      from: new Date(Date.now() - 24 * 60 * 60 * 1000),
                      to: new Date()
                    }
                  }))}
                >
                  Last 24 Hours
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setExportOptions(prev => ({
                    ...prev,
                    dateRange: {
                      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                      to: new Date()
                    }
                  }))}
                >
                  Last 7 Days
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setExportOptions(prev => ({
                    ...prev,
                    dateRange: {
                      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                      to: new Date()
                    }
                  }))}
                >
                  Last 30 Days
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Types Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aqi-data"
                  checked={exportOptions.dataTypes.aqi}
                  onCheckedChange={(checked) => handleDataTypeToggle('aqi', checked as boolean)}
                />
                <Label htmlFor="aqi-data">AQI Values</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pollutants-data"
                  checked={exportOptions.dataTypes.pollutants}
                  onCheckedChange={(checked) => handleDataTypeToggle('pollutants', checked as boolean)}
                />
                <Label htmlFor="pollutants-data">Individual Pollutants (PM2.5, PM10, CO, O₃, NO₂, SO₂)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weather-data"
                  checked={exportOptions.dataTypes.weather}
                  onCheckedChange={(checked) => handleDataTypeToggle('weather', checked as boolean)}
                />
                <Label htmlFor="weather-data">Weather Data (Temperature, Humidity, Wind)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="predictions-data"
                  checked={exportOptions.dataTypes.predictions}
                  onCheckedChange={(checked) => handleDataTypeToggle('predictions', checked as boolean)}
                  disabled
                />
                <Label htmlFor="predictions-data" className="text-muted-foreground">
                  ML Predictions (Coming Soon)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-metadata"
                  checked={exportOptions.includeMetadata}
                  onCheckedChange={(checked) => setExportOptions(prev => ({
                    ...prev,
                    includeMetadata: checked as boolean
                  }))}
                />
                <Label htmlFor="include-metadata">Include Metadata (Source, IDs)</Label>
              </div>
            </CardContent>
          </Card>

          {/* Location Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {availableLocations.map(location => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={exportOptions.locations.includes(location)}
                      onCheckedChange={(checked) => handleLocationToggle(location, checked as boolean)}
                    />
                    <Label htmlFor={`location-${location}`} className="text-sm">
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Format:</span>
                  <Badge variant="secondary">{exportOptions.format.toUpperCase()}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Locations:</span>
                  <span className="font-medium">{exportOptions.locations.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Date Range:</span>
                  <span className="font-medium">
                    {Math.ceil((exportOptions.dateRange.to.getTime() - exportOptions.dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Est. Records:</span>
                  <span className="font-medium">{estimatedRecords.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="text-sm font-medium">Data Types:</div>
                <div className="space-y-1">
                  {exportOptions.dataTypes.aqi && (
                    <div className="text-xs text-muted-foreground">• AQI Values</div>
                  )}
                  {exportOptions.dataTypes.pollutants && (
                    <div className="text-xs text-muted-foreground">• Pollutant Levels</div>
                  )}
                  {exportOptions.dataTypes.weather && (
                    <div className="text-xs text-muted-foreground">• Weather Data</div>
                  )}
                  {exportOptions.includeMetadata && (
                    <div className="text-xs text-muted-foreground">• Metadata</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Status */}
          {exportStatus !== 'idle' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {exportStatus === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-chart-1" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-chart-4" />
                  )}
                  Export Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {exportStatus === 'success' && exportedData && (
                  <div className="space-y-2">
                    <p className="text-sm text-chart-1">
                      ✓ Successfully exported {exportedData.totalRecords} records
                    </p>
                    <p className="text-xs text-muted-foreground">
                      File downloaded to your device
                    </p>
                  </div>
                )}
                {exportStatus === 'error' && (
                  <p className="text-sm text-chart-4">
                    ✗ Export failed. Please try again.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Usage Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium mb-1">Data Accuracy</h4>
                <p className="text-muted-foreground text-xs">
                  Data is sourced from OpenWeather API and IoT sensors. Historical accuracy may vary.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">File Formats</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• JSON: Best for programmatic analysis</li>
                  <li>• CSV: Compatible with Excel and data tools</li>
                  <li>• XLSX: Full Excel compatibility (coming soon)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Attribution</h4>
                <p className="text-xs text-muted-foreground">
                  Please credit "Bengaluru Air Quality Monitor" when using this data in research or publications.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}