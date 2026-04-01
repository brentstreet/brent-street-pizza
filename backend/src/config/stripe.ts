import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn('Stripe Secret Key is missing. Payments will fail.');
}

export const stripe = new Stripe(stripeSecretKey || '', {
});
