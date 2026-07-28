/**
 * Client-side validation utilities
 */

export const validateEmail = (email) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('One number');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('One special character');
  return errors;
};

export const getPasswordStrength = (password) => {
  const errors = validatePassword(password);
  if (errors.length === 0) return { strength: 'strong', color: '#22c55e', label: 'Strong' };
  if (errors.length <= 2) return { strength: 'medium', color: '#f59e0b', label: 'Medium' };
  return { strength: 'weak', color: '#ef4444', label: 'Weak' };
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_URL || '';
  return `${baseUrl}${path}`;
};
