export const Button = ({
  variant = "primary",
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 focus:ring-red-500 dark:focus:ring-red-400";
      case "secondary":
        return "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 focus:ring-slate-500 dark:focus:ring-slate-400";
      case "destructive":
        return "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 focus:ring-red-500 dark:focus:ring-red-400";
      case "outline":
        return "border border-slate-300 dark:border-slate-600 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-slate-500 dark:focus:ring-slate-400";
      default:
        return "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 focus:ring-red-500 dark:focus:ring-red-400";
    }
  };

  return (
    <button
      className={`${baseStyles} ${getVariantStyles()} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};
