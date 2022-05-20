const mongoose = require('mongoose');

const weightTrackerSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  }
})

module.exports = mongoose.model('Weight', weightTrackerSchema);
