const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  surgeryHistory: { type: String },
  illnessHistory: { type: String },
  password: { type: String, required: true },
  avatarUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
