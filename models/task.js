const mongoose = require('mongoose');
const randomEmoji = require('../utils/randomEmoji');

/**
 * вот здесь стоит что-то написать про рандом эмодзи по дефолту
 */
const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    description: {
      type: String,
      default: randomEmoji,
      minlength: 2,
      maxlength: 120,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('task', taskSchema);
