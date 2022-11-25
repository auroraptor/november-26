const { celebrate, Joi } = require('celebrate');

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().pattern(/[a-f0-9]{24,24}/).length(24),
  }),
});

module.exports.validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
});

module.exports.validateTask = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    description: Joi.string().min(2).max(120),
  }),
});

module.exports.validateTaskId = celebrate({
  params: Joi.object().keys({
    taskId: Joi.string().pattern(/[a-f0-9]{24,24}/).length(24),
  }),
});
