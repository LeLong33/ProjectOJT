import express from 'express';
import * as PaymentController from '../controllers/PaymentController';

const router = express.Router();

router.post('/momo/create', PaymentController.createMomoPayment);
router.post('/momo/callback', PaymentController.momoCallback);
router.post('/update-status', PaymentController.updatePaymentStatus);
router.get('/status/:orderId', PaymentController.checkPaymentStatus);

export default router;