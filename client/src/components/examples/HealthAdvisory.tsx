import HealthAdvisory from '../HealthAdvisory';

export default function HealthAdvisoryExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <HealthAdvisory aqi={45} location="Koramangala" />
      <HealthAdvisory aqi={125} location="Whitefield" />
      <HealthAdvisory aqi={185} location="Electronic City" />
    </div>
  );
}