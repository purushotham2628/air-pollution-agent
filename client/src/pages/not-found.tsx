import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Wind } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Wind className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
        <p className="text-muted-foreground mb-8">
          The air quality monitoring page you're looking for doesn't exist.
        </p>
        <Button asChild data-testid="button-go-home">
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
