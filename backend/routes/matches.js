const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Trip = require('../models/Trip');
const Match = require('../models/Match');

// @route   GET api/matches
// @desc    Get potential matches for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Get the current user's trips
    const userTrips = await Trip.find({ user: req.user.id });

    if (userTrips.length === 0) {
      return res.json([]);
    }

    // For simplicity, we'll just use the first trip for matching
    const userTrip = userTrips[0];

    // Find other users' trips that match the destination and have overlapping dates
    const potentialMatches = await Trip.find({
      user: { $ne: req.user.id }, // Exclude the current user
      to: userTrip.to,
      departureDate: { $lte: userTrip.returnDate || userTrip.departureDate },
      returnDate: { $gte: userTrip.departureDate },
    }).populate('user', ['name']);

    res.json(potentialMatches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/matches/like/:id
// @desc    Like a user
// @access  Private
router.post('/like/:id', auth, async (req, res) => {
  try {
    const user1 = req.user.id;
    const user2 = req.params.id;

    // Check if a match already exists
    let match = await Match.findOne({
      $or: [
        { user1: user1, user2: user2 },
        { user1: user2, user2: user1 },
      ],
    });

    if (match) {
      // If the other user has already liked the current user, it's a match
      if (match.status === 'liked' && match.user1.toString() === user2) {
        match.status = 'matched';
        await match.save();
        return res.json(match);
      } else {
        // The current user has already interacted with this user
        return res.status(400).json({ msg: 'You have already interacted with this user' });
      }
    }

    // Create a new match document
    const newMatch = new Match({
      user1,
      user2,
      status: 'liked',
    });

    await newMatch.save();
    res.json(newMatch);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
