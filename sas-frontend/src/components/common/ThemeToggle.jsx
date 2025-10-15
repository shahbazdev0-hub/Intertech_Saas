import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/use-theme";

export const ThemeToggle = ({ className = "", showLabel = false }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const themes = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun size={20} />;
      case "dark":
        return <Moon size={20} />;
      case "system":
        return <Monitor size={20} />;
      default:
        return <Sun size={20} />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
      default:
        return "Light";
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`btn-ghost size-10 flex items-center justify-center transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg ${className}`}
      title={`Current theme: ${getLabel()}. Click to cycle through themes.`}
      aria-label={`Switch to next theme. Current: ${getLabel()}`}
    >
      {getIcon()}
      {showLabel && (
        <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          {getLabel()}
        </span>
      )}
    </button>
  );
};
