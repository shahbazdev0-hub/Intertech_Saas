import PropTypes from "prop-types";

export const RadioGroup = ({ label, name, options, error, ...props }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="flex space-x-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              name={name}
              value={option.value}
              className="focus:ring-blue-500 dark:focus:ring-blue-400 text-blue-600 dark:text-blue-400"
              {...props}
            />
            <span className="text-slate-700 dark:text-slate-300">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

RadioGroup.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  error: PropTypes.string,
};
