const Joi = require("joi");

// User registration validation schema
const UserSignupSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty": "First name is required",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().required().messages({
    "string.empty": "Last name is required",
    "any.required": "Last name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Password confirmation is required",
  }),
  phone: Joi.string().allow("").optional(),
  role: Joi.string().valid("admin", "organizer", "attendee").optional(),
});

// Login validation schema
const LoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

// Password reset request validation schema
const passwordResetRequestSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
});

// Password reset validation schema
const passwordResetSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "Reset token is required",
    "any.required": "Reset token is required",
  }),
  newPassword: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters",
    "string.empty": "New password is required",
    "any.required": "New password is required",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Password confirmation is required",
  }),
});

// Token refresh validation schema
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "string.empty": "Refresh token is required",
    "any.required": "Refresh token is required",
  }),
});

// Role switch validation schema
const roleSwitchSchema = Joi.object({
  roleId: Joi.number().integer().required().messages({
    "number.base": "Role ID must be a number",
    "any.required": "Role ID is required",
  }),
});

// Event creation validation schema
const eventCreationSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Event title is required",
    "any.required": "Event title is required",
  }),
  description: Joi.string().allow("").optional(),
  shortDescription: Joi.string().max(255).allow("").optional(),
  categoryId: Joi.number().integer().required().messages({
    "number.base": "Category ID must be a number",
    "any.required": "Category ID is required",
  }),
  startDate: Joi.date().greater("now").required().messages({
    "date.greater": "Start date must be in the future",
    "any.required": "Start date is required",
  }),
  endDate: Joi.date().greater(Joi.ref("startDate")).required().messages({
    "date.greater": "End date must be after the start date",
    "any.required": "End date is required",
  }),
  timezone: Joi.string().default("UTC"),
  isVirtual: Joi.boolean().default(false),
  // Location fields for physical events
  locationName: Joi.string().when("isVirtual", {
    is: false,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }).messages({
    "string.empty": "Location name is required for physical events",
    "any.required": "Location name is required for physical events",
  }),
  address: Joi.string().when("isVirtual", {
    is: false,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  city: Joi.string().when("isVirtual", {
    is: false,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  state: Joi.string().when("isVirtual", {
    is: false,
    then: Joi.optional(),
    otherwise: Joi.optional(),
  }),
  country: Joi.string().when("isVirtual", {
    is: false,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  postalCode: Joi.string().when("isVirtual", {
    is: false,
    then: Joi.optional(),
    otherwise: Joi.optional(),
  }),
  // Virtual event fields
  virtualMeetingLink: Joi.string().uri().when("isVirtual", {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional(),
  }).messages({
    "string.uri": "Virtual meeting link must be a valid URL",
    "string.empty": "Meeting link is required for virtual events",
    "any.required": "Meeting link is required for virtual events",
  }),
  virtualMeetingPassword: Joi.string().when("isVirtual", {
    is: true,
    then: Joi.optional(),
    otherwise: Joi.optional(),
  }),
  // Optional fields
  bannerImage: Joi.string().uri().allow("").optional().messages({
    "string.uri": "Banner image must be a valid URL",
  }),
  featuredImage: Joi.string().uri().allow("").optional().messages({
    "string.uri": "Featured image must be a valid URL",
  }),
  capacity: Joi.number().integer().min(1).allow(null).optional(),
  isPublic: Joi.boolean().default(true),
  isFree: Joi.boolean().default(false),
  status: Joi.string().valid("draft", "published", "cancelled").default("draft"),
});

// Ticket type creation validation schema
const ticketTypeSchema = Joi.object({
  eventId: Joi.number().integer().required().messages({
    "number.base": "Event ID must be a number",
    "any.required": "Event ID is required",
  }),
  name: Joi.string().required().messages({
    "string.empty": "Ticket name is required",
    "any.required": "Ticket name is required",
  }),
  description: Joi.string().allow("").optional(),
  price: Joi.number().precision(2).min(0).required().messages({
    "number.base": "Price must be a valid number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),
  currency: Joi.string().length(3).default("USD"),
  quantity: Joi.number().integer().min(1).allow(null).optional(),
  maxPerOrder: Joi.number().integer().min(1).allow(null).optional(),
  saleStartDate: Joi.date().allow(null).optional(),
  saleEndDate: Joi.date().greater(Joi.ref("saleStartDate")).allow(null).optional().messages({
    "date.greater": "Sale end date must be after the sale start date",
  }),
  isActive: Joi.boolean().default(true),
  displayOrder: Joi.number().integer().allow(null).optional(),
});

// Order creation validation schema
const orderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      ticketTypeId: Joi.number().integer().required(),
      quantity: Joi.number().integer().min(1).required(),
    })
  ).min(1).required().messages({
    "array.min": "Order must contain at least one item",
    "any.required": "Order items are required",
  }),
  paymentMethod: Joi.string().required().messages({
    "string.empty": "Payment method is required",
    "any.required": "Payment method is required",
  }),
  billingEmail: Joi.string().email().required().messages({
    "string.email": "Please provide a valid billing email",
    "string.empty": "Billing email is required",
    "any.required": "Billing email is required",
  }),
  billingFirstName: Joi.string().required().messages({
    "string.empty": "Billing first name is required",
    "any.required": "Billing first name is required",
  }),
  billingLastName: Joi.string().required().messages({
    "string.empty": "Billing last name is required",
    "any.required": "Billing last name is required",
  }),
  billingAddress: Joi.string().required().messages({
    "string.empty": "Billing address is required",
    "any.required": "Billing address is required",
  }),
  billingCity: Joi.string().required().messages({
    "string.empty": "Billing city is required",
    "any.required": "Billing city is required",
  }),
  billingState: Joi.string().allow("").optional(),
  billingCountry: Joi.string().required().messages({
    "string.empty": "Billing country is required",
    "any.required": "Billing country is required",
  }),
  billingPostalCode: Joi.string().allow("").optional(),
  promoCode: Joi.string().allow("").optional(),
});

// Review creation validation schema
const reviewSchema = Joi.object({
  eventId: Joi.number().integer().required().messages({
    "number.base": "Event ID must be a number",
    "any.required": "Event ID is required",
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Rating must be a number",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating cannot be more than 5",
    "any.required": "Rating is required",
  }),
  comment: Joi.string().allow("").optional(),
});

module.exports = {
  UserSignupSchema,
  LoginSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  refreshTokenSchema,
  roleSwitchSchema,
  eventCreationSchema,
  ticketTypeSchema,
  orderSchema,
  reviewSchema,
};