const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  status: {
    type: String,
    enum: ['pending', 'liked', 'disliked', 'matched'],
    default: 'pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('match', MatchSchema);
