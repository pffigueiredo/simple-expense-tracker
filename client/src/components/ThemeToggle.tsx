import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <>
          <span className="text-lg">🌙</span>
          <span className="hidden sm:inline">Dark</span>
        </>
      ) : (
        <>
          <span className="text-lg">☀️</span>
          <span className="hidden sm:inline">Light</span>
        </>
      )}
    </Button>
  );
};