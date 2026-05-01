const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation', required: true },
  care: { type: String, required: true },
  medicines: { type: String },
  pdfUrl: { type: String },
  sentToPatient: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', PrescriptionSchema);
