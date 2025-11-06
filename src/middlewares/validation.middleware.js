
import Joi from 'joi';

const validationMiddleware = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.method === 'GET' ? req.query : req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export default validationMiddleware;
