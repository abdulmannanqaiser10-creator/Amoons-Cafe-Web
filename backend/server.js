
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL
}));

app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.json({
    message: 'AMOONS API is running successfully'
  });
});

app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
