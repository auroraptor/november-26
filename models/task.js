const mongoose = require('mongoose');
const randomEmoji = require('../utils/randomEmoji');

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    description: {
      type: mongoose.Schema.Types.String,
      default: randomEmoji,
      minlength: 2,
      maxlength: 120,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

taskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) { delete ret._id; },
});

module.exports = mongoose.model('Task', taskSchema);
