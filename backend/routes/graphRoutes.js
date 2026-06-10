const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController');

// Route for graph processing
router.post('/graph', graphController.processGraph);

module.exports = router;
