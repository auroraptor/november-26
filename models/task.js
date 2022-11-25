const mongoose = require('mongoose');

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
      default: 'Todo',
      minlength: 2,
      maxlength: 120,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  // createAt: {
  //   type: Date,
  //   default: Date.now,
  // },
  // updateAt: {
  //   type: Date,
  //   default: Date.now,
  // }
  },
  { timestamps: true },
);

module.exports = mongoose.model('task', taskSchema);
