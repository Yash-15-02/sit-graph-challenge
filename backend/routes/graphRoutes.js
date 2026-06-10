const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController');

// Routes for graph processing
router.post('/graph', graphController.processGraph);
router.post('/bfhl', graphController.processGraph);

module.exports = router;
