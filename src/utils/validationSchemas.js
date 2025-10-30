// Industry-standard validation schemas for forms
export const validationSchemas = {
  // Transport validation schema
  transport: {
    transport_category: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9\s\-_]+$/,
      patternMessage: "Category can only contain letters, numbers, spaces, hyphens, and underscores"
    },
    transport_name: {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-_&()]+$/,
      patternMessage: "Name can only contain letters, numbers, spaces, hyphens, underscores, ampersands, and parentheses"
    },
    latitude: {
      required: false,
      pattern: /^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/,
      patternMessage: "Latitude must be between -90 and 90 degrees"
    },
    longitude: {
      required: false,
      pattern: /^-?((1[0-7][0-9]|[1-9]?[0-9])(\.[0-9]+)?|180(\.0+)?)$/,
      patternMessage: "Longitude must be between -180 and 180 degrees"
    },
    vehicle_type: {
      required: false,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9\s\-_]+$/,
      patternMessage: "Vehicle type can only contain letters, numbers, spaces, hyphens, and underscores"
    },
    capacity: {
      required: false,
      min: 1,
      max: 1000,
      pattern: /^\d+$/,
      patternMessage: "Capacity must be a positive whole number"
    },
    description: {
      required: false,
      maxLength: 500,
      pattern: /^[a-zA-Z0-9\s\-_.,!?()&@#$%*]+$/,
      patternMessage: "Description contains invalid characters"
    },
    venue_id: {
      required: false, // Changed from true to false since it's provided by the component
      pattern: /^\d+$/,
      patternMessage: "Venue ID must be a valid number"
    }
  },

  // Dining validation schema
  dining: {
    dining_category: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9\s\-_]+$/,
      patternMessage: "Category can only contain letters, numbers, spaces, hyphens, and underscores"
    },
    dining_name: {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-_&()]+$/,
      patternMessage: "Name can only contain letters, numbers, spaces, hyphens, underscores, ampersands, and parentheses"
    },
    latitude: {
      required: false,
      pattern: /^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/,
      patternMessage: "Latitude must be between -90 and 90 degrees"
    },
    longitude: {
      required: false,
      pattern: /^-?((1[0-7][0-9]|[1-9]?[0-9])(\.[0-9]+)?|180(\.0+)?)$/,
      patternMessage: "Longitude must be between -180 and 180 degrees"
    },
    capacity: {
      required: false,
      min: 1,
      max: 10000,
      pattern: /^\d+$/,
      patternMessage: "Capacity must be a positive whole number"
    },
    range: {
      required: false,
      min: 1,
      max: 10000,
      pattern: /^\d+$/,
      patternMessage: "Range must be a positive whole number in meters"
    },
    description: {
      required: false,
      maxLength: 500,
      pattern: /^[a-zA-Z0-9\s\-_.,!?()&@#$%*]+$/,
      patternMessage: "Description contains invalid characters"
    },
    venue_id: {
      required: true,
      pattern: /^\d+$/,
      patternMessage: "Venue ID must be a valid number"
    }
  },

  // Zone validation schema
  zone: {
    zone_code: {
      required: true,
      minLength: 2,
      maxLength: 20,
      pattern: /^[A-Z0-9\-_]+$/,
      patternMessage: "Zone code can only contain uppercase letters, numbers, hyphens, and underscores"
    },
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-_&()/|]+$/,
      patternMessage: "Name can only contain letters, numbers, spaces, hyphens, underscores, ampersands, parentheses, forward slashes, and vertical bars"
    },
    latitude: {
      required: false,
      pattern: /^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/,
      patternMessage: "Latitude must be between -90 and 90 degrees"
    },
    longitude: {
      required: false,
      pattern: /^-?((1[0-7][0-9]|[1-9]?[0-9])(\.[0-9]+)?|180(\.0+)?)$/,
      patternMessage: "Longitude must be between -180 and 180 degrees"
    },
    capacity: {
      required: false,
      min: 1,
      max: 100000,
      pattern: /^\d+$/,
      patternMessage: "Capacity must be a positive whole number"
    },
    range: {
      required: false,
      min: 1,
      max: 10000,
      pattern: /^\d+$/,
      patternMessage: "Range must be a positive whole number in meters"
    },
    description: {
      required: false,
      maxLength: 500,
      pattern: /^[a-zA-Z0-9\s\-_.,!?()&@#$%*]+$/,
      patternMessage: "Description contains invalid characters"
    }
  }
};

// Validation utility functions
export const validateField = (value, schema, fieldName) => {
  const fieldSchema = schema[fieldName];
  if (!fieldSchema) return null;

  // Required field validation
  if (fieldSchema.required && (!value || value.toString().trim() === '')) {
    return `${fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`;
  }

  // Skip further validation if field is empty and not required
  if (!value || value.toString().trim() === '') {
    return null;
  }

  const stringValue = value.toString().trim();

  // Length validation
  if (fieldSchema.minLength && stringValue.length < fieldSchema.minLength) {
    return `${fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} must be at least ${fieldSchema.minLength} characters long`;
  }

  if (fieldSchema.maxLength && stringValue.length > fieldSchema.maxLength) {
    return `${fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} must not exceed ${fieldSchema.maxLength} characters`;
  }

  // Numeric range validation
  if (fieldSchema.min !== undefined && !isNaN(value) && parseFloat(value) < fieldSchema.min) {
    return `${fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} must be at least ${fieldSchema.min}`;
  }

  if (fieldSchema.max !== undefined && !isNaN(value) && parseFloat(value) > fieldSchema.max) {
    return `${fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} must not exceed ${fieldSchema.max}`;
  }

  // Pattern validation
  if (fieldSchema.pattern && !fieldSchema.pattern.test(stringValue)) {
    return fieldSchema.patternMessage || `${fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} format is invalid`;
  }

  return null;
};

// Validate entire form
export const validateForm = (formData, schema) => {
  const errors = {};
  
  Object.keys(schema).forEach(fieldName => {
    const error = validateField(formData[fieldName], schema, fieldName);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

// File validation utilities
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'],
    maxWidth = 4096,
    maxHeight = 4096
  } = options;

  if (!file) return null;

  // File size validation
  if (file.size > maxSize) {
    return `File size must not exceed ${Math.round(maxSize / (1024 * 1024))}MB`;
  }

  // File type validation
  if (!allowedTypes.includes(file.type)) {
    return `File type must be one of: ${allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}`;
  }

  return null;
};

// Image dimension validation
export const validateImageDimensions = (file, maxWidth = 4096, maxHeight = 4096) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.width > maxWidth || img.height > maxHeight) {
        resolve(`Image dimensions must not exceed ${maxWidth}x${maxHeight} pixels`);
      } else {
        resolve(null);
      }
    };
    img.onerror = () => {
      resolve('Unable to validate image dimensions');
    };
    img.src = URL.createObjectURL(file);
  });
};

// Coordinate validation utilities
export const validateCoordinates = (latitude, longitude) => {
  const errors = {};
  
  if (latitude !== null && latitude !== undefined && latitude !== '') {
    const lat = parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.latitude = 'Latitude must be between -90 and 90 degrees';
    }
  }
  
  if (longitude !== null && longitude !== undefined && longitude !== '') {
    const lng = parseFloat(longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.longitude = 'Longitude must be between -180 and 180 degrees';
    }
  }
  
  return errors;
};

// Phone number validation
export const validatePhoneNumber = (phone) => {
  if (!phone) return null;
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid length (7-15 digits)
  if (cleaned.length < 7 || cleaned.length > 15) {
    return 'Phone number must be between 7 and 15 digits';
  }
  
  return null;
};

// Email validation
export const validateEmail = (email) => {
  if (!email) return null;
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

// URL validation
export const validateURL = (url) => {
  if (!url) return null;
  
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

// Date validation
export const validateDate = (date, options = {}) => {
  if (!date) return null;
  
  const { minDate, maxDate, futureOnly = false, pastOnly = false } = options;
  const inputDate = new Date(date);
  const now = new Date();
  
  if (isNaN(inputDate.getTime())) {
    return 'Please enter a valid date';
  }
  
  if (futureOnly && inputDate <= now) {
    return 'Date must be in the future';
  }
  
  if (pastOnly && inputDate >= now) {
    return 'Date must be in the past';
  }
  
  if (minDate && inputDate < new Date(minDate)) {
    return `Date must not be before ${new Date(minDate).toLocaleDateString()}`;
  }
  
  if (maxDate && inputDate > new Date(maxDate)) {
    return `Date must not be after ${new Date(maxDate).toLocaleDateString()}`;
  }
  
  return null;
};
