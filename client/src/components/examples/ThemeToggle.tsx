import ThemeToggle from '../ThemeToggle';

export default function ThemeToggleExample() {
  return (
    <div className="flex items-center justify-center gap-4 p-4">
      <span className="text-sm text-muted-foreground">Toggle Theme:</span>
      <ThemeToggle />
    </div>
  );
}