import NotificationPanel from '../NotificationPanel';

export default function NotificationPanelExample() {
  //todo: remove mock functionality
  const mockNotifications = [
    {
      id: '1',
      type: 'alert' as const,
      title: 'High AQI Alert',
      message: 'AQI levels in Whitefield have exceeded 150. Avoid outdoor activities.',
      timestamp: '5 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'warning' as const,
      title: 'Pollution Spike Detected',
      message: 'PM2.5 levels rising rapidly in Electronic City area.',
      timestamp: '15 minutes ago',
      read: false
    },
    {
      id: '3',
      type: 'info' as const,
      title: 'Air Quality Improved',
      message: 'Koramangala AQI dropped to Good levels. Safe for outdoor activities.',
      timestamp: '1 hour ago',
      read: true
    }
  ];

  return (
    <div className="max-w-md mx-auto p-4">
      <NotificationPanel notifications={mockNotifications} />
    </div>
  );
}