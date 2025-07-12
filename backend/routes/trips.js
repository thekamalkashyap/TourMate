const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Trip = require('../models/Trip');

// @route   GET api/trips
// @desc    Get all users trips
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ date: -1 });
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/trips
// @desc    Add new trip
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('from', 'From is required').not().isEmpty(),
      check('to', 'To is required').not().isEmpty(),
      check('departureDate', 'Departure date is required').not().isEmpty(),
      check('travelType', 'Travel type is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { from, to, departureDate, returnDate, travelType, preferences } =
      req.body;

    try {
      const newTrip = new Trip({
        from,
        to,
        departureDate,
        returnDate,
        travelType,
        preferences,
        user: req.user.id,
      });

      const trip = await newTrip.save();

      res.json(trip);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/trips/:id
// @desc    Update trip
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { from, to, departureDate, returnDate, travelType, preferences } =
    req.body;

  // Build trip object
  const tripFields = {};
  if (from) tripFields.from = from;
  if (to) tripFields.to = to;
  if (departureDate) tripFields.departureDate = departureDate;
  if (returnDate) tripFields.returnDate = returnDate;
  if (travelType) tripFields.travelType = travelType;
  if (preferences) tripFields.preferences = preferences;

  try {
    let trip = await Trip.findById(req.params.id);

    if (!trip) return res.status(404).json({ msg: 'Trip not found' });

    // Make sure user owns trip
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { $set: tripFields },
      { new: true }
    );

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/trips/:id
// @desc    Delete trip
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id);

    if (!trip) return res.status(404).json({ msg: 'Trip not found' });

    // Make sure user owns trip
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Trip.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Trip removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
