import { ThemeToggle } from "./ThemeToggle";
import { FloatingThemeToggle } from "./FloatingThemeToggle";

export const ThemeDemo = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
          Theme Toggle Demo
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Click the buttons below to cycle through Light → Dark → System themes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Header Style */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Header Style
          </h3>
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        </div>

        {/* With Label */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
            With Label
          </h3>
          <div className="flex justify-center">
            <ThemeToggle showLabel={true} className="px-4" />
          </div>
        </div>

        {/* Floating Style */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 relative h-32">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Floating Style
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Check bottom-right corner →
          </p>
          <div className="absolute bottom-2 right-2">
            <button className="size-10 flex items-center justify-center bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full shadow-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs">🌙</span>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-slate-500 dark:text-slate-400 space-y-2">
        <p><strong>Light mode:</strong> Manual light theme</p>
        <p><strong>Dark mode:</strong> Manual dark theme</p>
        <p><strong>System mode:</strong> Follows your device's theme preference</p>
      </div>
    </div>
  );
};
