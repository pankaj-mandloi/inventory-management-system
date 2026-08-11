import React, { forwardRef } from 'react';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const Input = forwardRef(({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  success,
  helperText,
  placeholder,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  required = false,
  disabled = false,
  ...props
}, ref) => {
  const inputClasses = `
    w-full px-4 py-2.5 border rounded-lg
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    transition-all duration-200 bg-white
    placeholder:text-gray-400
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
    ${success ? 'border-green-500 focus:ring-green-500' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${Icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        )}
        
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        
        {Icon && iconPosition === 'right' && (
          <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        )}
        
        {error && (
          <FiAlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
        )}
        
        {success && (
          <FiCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`input-helper ${error ? 'input-helper-error' : 'input-helper-success'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;