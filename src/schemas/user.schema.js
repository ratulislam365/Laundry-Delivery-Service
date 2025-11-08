import Joi from "joi";


export const updateUserSchema = Joi.object({
  fullname: Joi.string().optional(),
  phonenumber: Joi.string().optional(),
  currentPassword: Joi.string().optional(),
  newPassword: Joi.string().min(6).optional()
});
