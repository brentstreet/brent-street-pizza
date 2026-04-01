import { Router } from 'express';
import { placeOrder, getOrders } from '../controllers/orderController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', getOrders);
router.post('/', placeOrder);
// router.post('/verify-payment', verifyPayment); // Removed for Stripe migration

export default router;
