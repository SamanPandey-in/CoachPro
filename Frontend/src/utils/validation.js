/**
 * Validation utility functions
 */

export const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Invalid email address';
  },

  required: (value) => {
    return value && value.toString().trim() !== '' ? null : 'This field is required';
  },

  minLength: (min) => (value) => {
    return value && value.length >= min ? null : `Minimum ${min} characters required`;
  },

  maxLength: (max) => (value) => {
    return value && value.length <= max ? null : `Maximum ${max} characters allowed`;
  },

  pattern: (regex, message) => (value) => {
    return regex.test(value) ? null : message;
  },

  number: (value) => {
    return !isNaN(value) ? null : 'Must be a number';
  },

  min: (min) => (value) => {
    return Number(value) >= min ? null : `Must be at least ${min}`;
  },

  max: (max) => (value) => {
    return Number(value) <= max ? null : `Must be at most ${max}`;
  },

  phone: (value) => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(value) ? null : 'Invalid phone number';
  },

  date: (value) => {
    return !isNaN(Date.parse(value)) ? null : 'Invalid date';
  },

  url: (value) => {
    try {
      new URL(value);
      return null;
    } catch {
      return 'Invalid URL';
    }
  },
};

/**
 * Compose multiple validators
 */
export const composeValidators = (...validators) => (value) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

/**
 * Validate entire form object
 */
export const validateForm = (values, schema) => {
  const errors = {};

  Object.keys(schema).forEach((field) => {
    const validator = schema[field];
    const error = validator(values[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};
