// ============================================
// CUSTOM DATA VALIDATION LAYER
// Validates input before hitting the database
// ============================================

/**
 * validateRegister - Validates user registration inputs
 */
const validateRegister = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push("Valid email is required");
  }
  if (!data.password || data.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
  if (data.phone && !/^[0-9]{10}$/.test(data.phone)) {
    errors.push("Phone must be a valid 10-digit number");
  }

  return errors;
};

/**
 * validateLogin - Validates login inputs
 */
const validateLogin = (data) => {
  const errors = [];
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push("Valid email is required");
  }
  if (!data.password) {
    errors.push("Password is required");
  }
  return errors;
};

/**
 * validateProduct - Validates product inputs
 */
const validateProduct = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push("Product name is required");
  }
  if (!data.description || data.description.trim().length === 0) {
    errors.push("Product description is required");
  }
  if (data.price === undefined || data.price < 0) {
    errors.push("Valid price is required (>= 0)");
  }
  if (data.stock === undefined || data.stock < 0) {
    errors.push("Valid stock is required (>= 0)");
  }
  if (!data.category) {
    errors.push("Category is required");
  }

  return errors;
};

/**
 * validateOrder - Validates order inputs
 */
const validateOrder = (data) => {
  const errors = [];

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push("At least one order item is required");
  }
  if (!data.shippingAddress) {
    errors.push("Shipping address is required");
  } else {
    const { street, city, state, pincode } = data.shippingAddress;
    if (!street || !city || !state || !pincode) {
      errors.push("Complete shipping address is required (street, city, state, pincode)");
    }
  }
  if (!data.paymentMethod) {
    errors.push("Payment method is required");
  }

  return errors;
};

module.exports = { validateRegister, validateLogin, validateProduct, validateOrder };
