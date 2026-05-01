const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  experience: { type: Number, default: 0 },
  password: { type: String, required: true },
  avatarUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
