import React from 'react';

const labelStyle = {
  fontSize: 11, fontWeight: 500, color: 'var(--muted)',
  textTransform: 'uppercase', letterSpacing: '0.5px',
};

// react-hook-form v6: register is a ref callback, not a spread
const FormInput = ({ name, label, type = 'text', register, required = true, optional = false, errors = {}, span }) => {
  const error = errors[name];

  return (
    <div style={{ gridColumn: span ? `span ${span}` : undefined, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 4 }}>
        {label}
        {required && !optional && <span style={{ color: '#e11d48' }}>*</span>}
        {optional && <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 10, letterSpacing: 0, textTransform: 'none' }}>(optional)</span>}
      </label>
      <input
        type={type}
        name={name}
        ref={register({ required: required && !optional })}
        className="form-input"
        style={{ borderColor: error ? '#e11d48' : undefined }}
      />
      {error && (
        <span style={{ fontSize: 11, color: '#e11d48', marginTop: -2 }}>
          This field is required
        </span>
      )}
    </div>
  );
};

export default FormInput;
