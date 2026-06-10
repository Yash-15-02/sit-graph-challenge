const express = require('express');
const cors = require('cors');
const graphRoutes = require('./routes/graphRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all domains
app.use(cors());

// Express JSON body parsing middleware
app.use(express.json());

// Routes
app.use('/api', graphRoutes);
app.use('/', graphRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: "OK", time: new Date() });
});

// Default root response
app.get('/', (req, res) => {
  res.send('SIT Graph Challenge API is running.');
});

// Start Express Server locally (not on Vercel)
if (process.env.VERCEL === undefined) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
