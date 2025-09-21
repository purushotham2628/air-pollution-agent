import GeoCityComparison from '../GeoCityComparison';

export default function GeoCityComparisonExample() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Multi-City AQI Comparison</h2>
        <p className="text-sm text-muted-foreground">
          Compare air quality across major Indian cities in real-time
        </p>
      </div>
      
      <GeoCityComparison className="min-h-96" />
      
      <div className="text-sm text-muted-foreground space-y-2">
        <p><strong>Features:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Real-time AQI data from OpenWeather API</li>
          <li>Compare up to 5 cities simultaneously</li>
          <li>Detailed pollutant level breakdown</li>
          <li>Color-coded health categories</li>
          <li>Ranking from best to worst air quality</li>
          <li>Mobile-responsive design</li>
        </ul>
        <p className="text-xs mt-4 opacity-75">
          * Data updates every few minutes. Click refresh for latest readings.
        </p>
      </div>
    </div>
  );
}