import Joi from 'joi';

export const signupSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  emailOrPhone: Joi.alternatives().try(
    Joi.string().email(),
    Joi.string().pattern(/^[0-9]{10,15}$/)
  ).required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
