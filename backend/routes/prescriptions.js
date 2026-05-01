const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Prescription = require('../models/Prescription');
const Consultation = require('../models/Consultation');

// Doctor creates a prescription for a consultation
router.post('/:consultationId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') return res.status(403).json({ msg: 'Only doctors can create prescriptions' });
    const { consultationId } = req.params;
    const { care, medicines, pdfUrl } = req.body;
    if (!care) return res.status(400).json({ msg: 'Care field is required' });
    const consult = await Consultation.findById(consultationId);
    if (!consult) return res.status(404).json({ msg: 'Consultation not found' });
    if (String(consult.doctor) !== req.user.id) return res.status(403).json({ msg: 'Not authorized for this consultation' });
    const p = new Prescription({ consultation: consultationId, care, medicines, pdfUrl });
    await p.save();
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Doctor edits a prescription
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') return res.status(403).json({ msg: 'Only doctors can edit prescriptions' });
    const pres = await Prescription.findById(req.params.id).populate('consultation');
    if (!pres) return res.status(404).json({ msg: 'Prescription not found' });
    if (String(pres.consultation.doctor) !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });
    pres.care = req.body.care || pres.care;
    pres.medicines = req.body.medicines || pres.medicines;
    pres.pdfUrl = req.body.pdfUrl || pres.pdfUrl;
    await pres.save();
    res.json(pres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Doctor lists prescriptions (for their consultations)
router.get('/doctor', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') return res.status(403).json({ msg: 'Only doctors can view this' });
    const list = await Prescription.find().populate({ path: 'consultation', match: { doctor: req.user.id }, populate: { path: 'patient', select: 'name email' } });
    const filtered = list.filter(p => p.consultation != null);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Patient lists prescriptions that were sent to them
router.get('/patient', auth, async (req, res) => {
  try {
    if (req.user.role !== 'patient') return res.status(403).json({ msg: 'Only patients can view this' });
    const list = await Prescription.find({ sentToPatient: true }).populate({
      path: 'consultation',
      match: { patient: req.user.id },
      populate: { path: 'doctor', select: 'name specialty avatarUrl email phone' }
    });
    const filtered = list.filter(p => p.consultation != null);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send prescription to patient (mark sent)
router.post('/:id/send', auth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') return res.status(403).json({ msg: 'Only doctors can send prescriptions' });
    const pres = await Prescription.findById(req.params.id).populate('consultation');
    if (!pres) return res.status(404).json({ msg: 'Prescription not found' });
    if (String(pres.consultation.doctor) !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });
    pres.sentToPatient = true;
    await pres.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
