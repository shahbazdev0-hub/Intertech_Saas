import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/use-theme";

export const FloatingThemeToggle = ({ position = "bottom-right" }) => {
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

  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "top-4 right-4";
      case "top-left":
        return "top-4 left-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-right":
      default:
        return "bottom-4 right-4";
    }
  };

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "Light mode";
      case "dark":
        return "Dark mode";
      case "system":
        return "System theme";
      default:
        return "Light mode";
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`fixed ${getPositionClasses()} z-50 size-12 flex items-center justify-center bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-200 hover:scale-105`}
      title={`Current: ${getLabel()}. Click to cycle through themes.`}
      aria-label={`Switch to next theme. Current: ${getLabel()}`}
    >
      {getIcon()}
    </button>
  );
};
