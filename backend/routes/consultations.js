const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Consultation = require('../models/Consultation');

// Patient creates a consultation
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'patient') return res.status(403).json({ msg: 'Only patients can create consultations' });
    const { doctorId, step1, step2, step3 } = req.body;
    const consult = new Consultation({ patient: req.user.id, doctor: doctorId, step1, step2, step3 });
    await consult.save();
    res.json(consult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get consultations for logged-in doctor
router.get('/doctor', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') return res.status(403).json({ msg: 'Only doctors can view this' });
    const list = await Consultation.find({ doctor: req.user.id }).populate('patient', 'name email phone');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get consultations for logged-in patient
router.get('/patient', auth, async (req, res) => {
  try {
    if (req.user.role !== 'patient') return res.status(403).json({ msg: 'Only patients can view this' });
    const list = await Consultation.find({ patient: req.user.id }).populate('doctor', 'name specialty email');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
