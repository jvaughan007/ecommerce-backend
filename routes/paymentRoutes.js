const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route to handle POST requests for payments
router.post('/simulate-payment', paymentController.handlePayment);

module.exports = router;
