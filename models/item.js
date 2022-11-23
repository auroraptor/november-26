const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 120,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('item', itemSchema);
