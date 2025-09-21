import AQIChart from '../AQIChart';

export default function AQIChartExample() {
  //todo: remove mock functionality
  const mockData = [
    { time: '00:00', aqi: 45, predicted: 48 },
    { time: '02:00', aqi: 52, predicted: 55 },
    { time: '04:00', aqi: 38, predicted: 42 },
    { time: '06:00', aqi: 65, predicted: 68 },
    { time: '08:00', aqi: 85, predicted: 82 },
    { time: '10:00', aqi: 78, predicted: 75 },
    { time: '12:00', aqi: 92, predicted: 95 },
    { time: '14:00', aqi: 105, predicted: 108 },
    { time: '16:00', aqi: 115, predicted: 112 },
    { time: '18:00', aqi: 98, predicted: 102 },
    { time: '20:00', aqi: 76, predicted: 78 },
    { time: '22:00', aqi: 58, predicted: 62 }
  ];

  return (
    <div className="space-y-6 p-4">
      <AQIChart 
        data={mockData} 
        title="Historical AQI Trends" 
        showPrediction={false} 
      />
      <AQIChart 
        data={mockData} 
        title="AQI Prediction with ML" 
        showPrediction={true} 
      />
    </div>
  );
}