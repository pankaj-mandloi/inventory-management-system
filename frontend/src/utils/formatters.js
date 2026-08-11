export const formatters = {
  // Format currency
  currency: (amount, currency = '$') => {
    if (amount === undefined || amount === null) return `${currency}0.00`;
    return `${currency}${Number(amount).toFixed(2)}`;
  },

  // Format date
  date: (date, options = {}) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    
    return d.toLocaleDateString('en-US', { ...defaultOptions, ...options });
  },

  // Format datetime
  datetime: (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Format phone number
  phone: (phone) => {
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  },

  // Truncate text
  truncate: (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  // Capitalize first letter
  capitalize: (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  // Format SKU
  sku: (sku) => {
    if (!sku) return 'N/A';
    return sku.toUpperCase();
  },

  // Format status
  status: (status) => {
    const statusMap = {
      'In Stock': 'In Stock',
      'Low Stock': 'Low Stock',
      'Out of Stock': 'Out of Stock',
    };
    return statusMap[status] || status;
  },

  // Format transaction type
  transactionType: (type) => {
    const typeMap = {
      INCREASE: 'Increase',
      DECREASE: 'Decrease',
      ADJUSTMENT: 'Adjustment',
    };
    return typeMap[type] || type;
  },

  // Format file size
  fileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Format percentage
  percentage: (value, total) => {
    if (!total || total === 0) return '0%';
    return ((value / total) * 100).toFixed(1) + '%';
  },

  // Format number with commas
  number: (num) => {
    if (num === undefined || num === null) return '0';
    return Number(num).toLocaleString('en-US');
  },

  // Format address
  address: (address) => {
    if (!address) return 'N/A';
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.zip) parts.push(address.zip);
    if (address.country) parts.push(address.country);
    return parts.join(', ');
  },
};

export default formatters;