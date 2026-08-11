export const helpers = {
  // Generate random ID
  generateId: (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Generate SKU
  generateSKU: (prefix = 'PRD') => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${timestamp}-${random}`;
  },

  // Deep clone object
  deepClone: (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    return JSON.parse(JSON.stringify(obj));
  },

  // Debounce function
  debounce: (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle: (func, limit = 300) => {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  },

  // Check if object is empty
  isEmpty: (obj) => {
    if (obj === null || obj === undefined) return true;
    if (typeof obj === 'string') return obj.trim().length === 0;
    if (Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    return false;
  },

  // Get stock status
  getStockStatus: (quantity) => {
    if (quantity === undefined || quantity === null) return 'Out of Stock';
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= 10) return 'Low Stock';
    return 'In Stock';
  },

  // Get status badge color
  getStatusColor: (status) => {
    const colors = {
      'In Stock': 'green',
      'Low Stock': 'yellow',
      'Out of Stock': 'red',
    };
    return colors[status] || 'gray';
  },

  // Get transaction type badge color
  getTransactionTypeColor: (type) => {
    const colors = {
      INCREASE: 'green',
      DECREASE: 'red',
      ADJUSTMENT: 'blue',
    };
    return colors[type] || 'gray';
  },

  // Parse query params
  parseQueryParams: (params) => {
    const parsed = {};
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== undefined && value !== null && value !== '') {
        parsed[key] = value;
      }
    });
    return parsed;
  },

  // Build query string
  buildQueryString: (params) => {
    const filtered = helpers.parseQueryParams(params);
    return Object.keys(filtered)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(filtered[key])}`)
      .join('&');
  },

  // Format file name
  formatFileName: (filename) => {
    if (!filename) return '';
    const parts = filename.split('.');
    const extension = parts.pop();
    const name = parts.join('.');
    return {
      name,
      extension,
      full: filename,
    };
  },

  // Check if value is a number
  isNumber: (value) => {
    if (typeof value === 'number' && !isNaN(value)) return true;
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return !isNaN(num) && isFinite(num);
    }
    return false;
  },

  // Random color
  randomColor: () => {
    const colors = [
      'bg-red-100 text-red-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-orange-100 text-orange-800',
      'bg-teal-100 text-teal-800',
      'bg-cyan-100 text-cyan-800',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  },

  // Get initials
  getInitials: (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  },

  // Truncate text
  truncateText: (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  // Sleep/Delay
  sleep: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Copy to clipboard
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      return false;
    }
  },

  // Download file
  downloadFile: (data, filename, type = 'text/json') => {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  // Export to CSV
  exportToCSV: (data, filename = 'export.csv') => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ];
    
    const csv = csvRows.join('\n');
    helpers.downloadFile(csv, filename, 'text/csv');
  },

  // Compare objects
  isEqual: (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  },

  // Get nested object value
  getNestedValue: (obj, path) => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  },

  // Set nested object value
  setNestedValue: (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  },
};

export default helpers;