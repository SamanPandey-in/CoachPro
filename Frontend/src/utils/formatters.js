/**
 * Formatting utility functions
 */

export const formatters = {
  // Date formatting
  formatDate: (date, format = 'YYYY-MM-DD') => {
    if (!date) return '';
    const d = new Date(date);
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  },

  // Time formatting
  formatTime: (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHours = h % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  },

  // Number formatting
  formatNumber: (num, decimals = 0) => {
    if (num === null || num === undefined) return '';
    return Number(num).toFixed(decimals);
  },

  // Currency formatting
  formatCurrency: (amount, currency = 'INR') => {
    if (amount === null || amount === undefined) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  // Percentage formatting
  formatPercentage: (value, decimals = 1) => {
    if (value === null || value === undefined) return '';
    return `${Number(value).toFixed(decimals)}%`;
  },

  // Phone formatting
  formatPhone: (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  },

  // Capitalize first letter
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Title case
  titleCase: (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  // Truncate text
  truncate: (str, length = 50) => {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
  },
};
