const Joi = require("joi");

const registerValidator = (data) => {
    const schema = Joi.object({
      userName: Joi.string().min(3).max(30).trim().required(),
      fullName: Joi.string().min(3).max(50).trim().required(),
      email: Joi.string().email().trim().required(),
      password: Joi.string().min(6).required(),
      gender: Joi.string().valid("Male", "Female", "Other").required(),
      dateOfBirth: Joi.date().less("now").required(),
      country: Joi.string().length(2).uppercase().required(),
    });
  
    return schema.validate(data);
  };

const loginValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = { registerValidator, loginValidator };
