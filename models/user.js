const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: mongoose.Schema.Types.String,
    require: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email) === true;
      },
      message: 'Is not a valid email address',
    },
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
