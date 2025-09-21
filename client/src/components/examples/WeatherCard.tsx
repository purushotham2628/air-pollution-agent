import WeatherCard from '../WeatherCard';

export default function WeatherCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <WeatherCard 
        temperature={28}
        humidity={65}
        windSpeed={12}
        visibility={8}
        location="Bengaluru"
        condition="Partly Cloudy"
      />
      <WeatherCard 
        temperature={31}
        humidity={72}
        windSpeed={8}
        visibility={6}
        location="Whitefield"
        condition="Hazy"
      />
    </div>
  );
}