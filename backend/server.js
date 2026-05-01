const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prescription';

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/consultations', require('./routes/consultations'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/doctors', require('./routes/doctors'));

app.get('/api/health', (req, res) => {
  const stateMap = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = stateMap[mongoose.connection.readyState] || 'unknown';
  return res.json({ ok: dbState === 'connected', dbState });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connect error', err.message || err);
    console.error(`Unable to connect to ${mongoUri}. Ensure MongoDB is running and MONGO_URI is correct.`);
    process.exit(1);
  }
}

start();
