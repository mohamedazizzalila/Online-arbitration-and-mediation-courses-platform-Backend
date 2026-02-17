const express = require("express");
const router = express.Router();
const { initPayment, getPaymentDetails, handleWebhook, getAllPayments } = require('../controllers/paymentController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');


router.get('/webhook', handleWebhook);
router.post("/init-payment/:courseId", initPayment);
router.get("/details/:paymentid", getPaymentDetails);
router.use(authMiddleware);
router.get('/all', getAllPayments);

module.exports = router;
