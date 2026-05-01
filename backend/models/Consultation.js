const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  step1: {
    currentIllness: { type: String },
    recentSurgery: { type: String }
  },
  step2: {
    diabetic: { type: String },
    allergies: { type: String },
    others: { type: String }
  },
  step3: {
    transactionId: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Consultation', ConsultationSchema);
