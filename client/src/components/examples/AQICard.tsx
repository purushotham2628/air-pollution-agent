import AQICard from '../AQICard';

export default function AQICardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <AQICard 
        aqi={45} 
        location="Bengaluru" 
        lastUpdated="2 minutes ago" 
        trend="down" 
      />
      <AQICard 
        aqi={125} 
        location="Whitefield" 
        lastUpdated="5 minutes ago" 
        trend="up" 
      />
      <AQICard 
        aqi={185} 
        location="Electronic City" 
        lastUpdated="3 minutes ago" 
        trend="stable" 
      />
    </div>
  );
}