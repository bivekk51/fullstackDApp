const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const donationRoutes = require('./routes/donationRoutes');
const distributionRoutes = require('./routes/distributionRoutes');

app.use('/api/users', userRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/distributions', distributionRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});


app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;


if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
