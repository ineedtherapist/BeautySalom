import React from 'react';
import '../styles/Form.css';

const Select = ({ id, name, value, onChange, options, label, required, error }) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label} {required && '*'}</label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={error ? 'error' : ''}
        required={required}
      >
        <option value="">Виберіть {label.toLowerCase()}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Select;