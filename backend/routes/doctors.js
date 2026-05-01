const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Public: list doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({}, 'name specialty avatarUrl experience email phone');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
