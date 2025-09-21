import AIChatbot from '../AIChatbot';

export default function AIChatbotExample() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center">AI Assistant Examples</h2>
      <div className="grid grid-cols-1 gap-6">
        <AIChatbot 
          sessionId="demo-session-1" 
          location="Bengaluru Central"
          className="h-96"
        />
        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Try asking:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>"What's the current AQI in Bengaluru?"</li>
            <li>"Is it safe to exercise outside right now?"</li>
            <li>"Will pollution be high tomorrow evening?"</li>
            <li>"Should I wear a mask today?"</li>
            <li>"What are the PM2.5 levels like?"</li>
          </ul>
          <p className="text-xs mt-4 opacity-75">
            * Voice commands work in supported browsers (Chrome, Edge). Click the microphone icon to start.
          </p>
        </div>
      </div>
    </div>
  );
}