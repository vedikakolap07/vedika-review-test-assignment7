const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Doctor signup
router.post('/doctor/signup', async (req, res) => {
  try {
    const { name, specialty, email, phone, experience, password, avatarUrl } = req.body;
    if (!email || !phone || !password) return res.status(400).json({ msg: 'Missing fields' });
    const existing = await Doctor.findOne({ $or: [{ email }, { phone }] });
    if (existing) return res.status(400).json({ msg: 'Email or phone already used' });
    const hash = await bcrypt.hash(password, 10);
    const doc = new Doctor({ name, specialty, email, phone, experience, password: hash, avatarUrl });
    await doc.save();
    const token = jwt.sign({ id: doc._id, role: 'doctor' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, doctor: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Doctor signin
router.post('/doctor/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const doc = await Doctor.findOne({ email });
    if (!doc) return res.status(400).json({ msg: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, doc.password);
    if (!ok) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: doc._id, role: 'doctor' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, doctor: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Patient signup
router.post('/patient/signup', async (req, res) => {
  try {
    const { name, age, email, phone, surgeryHistory, illnessHistory, password, avatarUrl } = req.body;
    if (!email || !phone || !password) return res.status(400).json({ msg: 'Missing fields' });
    const existing = await Patient.findOne({ $or: [{ email }, { phone }] });
    if (existing) return res.status(400).json({ msg: 'Email or phone already used' });
    const hash = await bcrypt.hash(password, 10);
    const patient = new Patient({ name, age, email, phone, surgeryHistory, illnessHistory, password: hash, avatarUrl });
    await patient.save();
    const token = jwt.sign({ id: patient._id, role: 'patient' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Patient signin
router.post('/patient/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(400).json({ msg: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, patient.password);
    if (!ok) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: patient._id, role: 'patient' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
