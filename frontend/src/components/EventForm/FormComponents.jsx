import React from "react";

/**
 * FormSection - Wrapper for form sections with label and optional help text
 */
export const FormSection = ({ 
  label, 
  helpText, 
  required = false, 
  children 
}) => {
  return (
    <div className="mb-6">
      {label && (
        <label className="block text-gray-800 font-medium mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {helpText && <p className="text-gray-500 text-sm mb-2">{helpText}</p>}
      {children}
    </div>
  );
};

/**
 * FormInput - Styled input field with label
 */
export const FormInput = ({
  label,
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  error,
  icon = null,
  className = "",
  ...rest
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-gray-800 font-medium mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2 bg-white border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-black focus:border-transparent ${
            icon ? "pl-10" : ""
          } ${className}`}
          required={required}
          {...rest}
        />
       
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

/**
 * FormTextArea - Styled textarea with label
 */
export const FormTextArea = ({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  rows = 4,
  className = "",
  ...rest
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-gray-800 font-medium mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-2 bg-white border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${className}`}
        required={required}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

/**
 * FormSelect - Styled select dropdown with label
 */
export const FormSelect = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  required = false,
  error,
  className = "",
  ...rest
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-gray-800 font-medium mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 bg-white border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent appearance-none bg-no-repeat ${className}`}
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundSize: "1.5em 1.5em" }}
        required={required}
        {...rest}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

/**
 * ToggleButton - For toggling between two options (like Physical/Virtual, One-time/Recurring)
 */

export const ToggleButton = ({
  options = [],
  value,
  onChange,
  name,
  className = "",
}) => {
  // Handle both string and boolean values
  const stringValue = typeof value === 'boolean' ? String(value) : value;
  
  return (
    <div className={`flex ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`px-5 py-2 text-sm font-medium ${
            stringValue === option.value
              ? "bg-orange-100 text-orange-600"
              : "bg-white text-gray-700 hover:bg-gray-50"
          } ${
            options.indexOf(option) === 0
              ? "rounded-l-lg border border-gray-300"
              : options.indexOf(option) === options.length - 1
              ? "rounded-r-lg border-t border-r border-b border-gray-300"
              : "border-t border-r border-b border-gray-300"
          }`}
          onClick={() => onChange({ target: { name, value: option.value } })}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
/**
 * ActionButton - Button for actions like Add Speaker, Add Description, etc.
 */
export const ActionButton = ({ 
  onClick, 
  icon, 
  children, 
  variant = "primary",
  className = "",
  ...rest 
}) => {
  const variants = {
    primary: "bg-orange-400 text-white hover:bg-orange-500",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg ${variants[variant]} ${className}`}
      {...rest}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};