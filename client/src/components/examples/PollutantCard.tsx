import PollutantCard from '../PollutantCard';

export default function PollutantCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4">
      <PollutantCard 
        name="PM2.5" 
        value={35} 
        unit="μg/m³" 
        safeLimit={25} 
        trend="up" 
      />
      <PollutantCard 
        name="PM10" 
        value={68} 
        unit="μg/m³" 
        safeLimit={50} 
        trend="down" 
      />
      <PollutantCard 
        name="CO" 
        value={1.2} 
        unit="mg/m³" 
        safeLimit={2.0} 
        trend="stable" 
      />
      <PollutantCard 
        name="O₃" 
        value={85} 
        unit="μg/m³" 
        safeLimit={100} 
        trend="up" 
      />
      <PollutantCard 
        name="NO₂" 
        value={42} 
        unit="μg/m³" 
        safeLimit={40} 
        trend="down" 
      />
      <PollutantCard 
        name="SO₂" 
        value={15} 
        unit="μg/m³" 
        safeLimit={20} 
        trend="stable" 
      />
    </div>
  );
}