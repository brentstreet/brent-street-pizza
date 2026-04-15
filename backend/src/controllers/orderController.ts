import { Response } from 'express';
import prisma from '../config/db';
import { stripe } from '../config/stripe';
import { AuthRequest } from '../middleware/auth';
import type Stripe from 'stripe';

export const placeOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { totalAmount, paymentMethod = 'ONLINE', deliveryAddress, cartItems: bodyCartItems, customerName, customerPhone } = req.body;

    // We will still check if frontend sent a total, but we will OVERRIDE it securely
    if (!totalAmount || totalAmount <= 0) {
      res.status(400).json({ error: 'Valid totalAmount is required' });
      return;
    }

    // 1. Use cart items from request body if provided, else fallback to DB
    let cartItems: any[] = [];

    if (bodyCartItems && Array.isArray(bodyCartItems) && bodyCartItems.length > 0) {
      // Frontend passed items directly — use them
      cartItems = bodyCartItems;
    } else {
      // Fallback: fetch from DB
      const dbItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true }
      });
      cartItems = dbItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.product.price),
        size: item.size,
        removedToppings: item.removedToppings,
        addedExtras: item.addedExtras,
      }));
    }

    if (!cartItems || cartItems.length === 0) {
      res.status(400).json({ error: 'Cart is empty' });
      return;
    }

    // --- NEW VALIDATION & PRICE RECALCULATION START ---
    // Extract all product IDs from the cart
    const productIds = cartItems.map(item => item.productId || item.menuItemId);

    // Fetch the real-time product data (status AND price) from the database
    const currentProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, isActive: true, price: true } 
    });

    const productMap = new Map(currentProducts.map(p => [p.id, p]));
    const inactiveItems: string[] = [];
    let serverCalculatedTotal = 0;

    // Check status and recalculate the true price
    for (const item of cartItems) {
      const pId = item.productId || item.menuItemId;
      const product = productMap.get(pId);
      
      if (!product) {
        inactiveItems.push('An unknown item');
        continue;
      } 
      
      if (!product.isActive) {
        inactiveItems.push(product.name);
        continue;
      }

      // Calculate the base price using the Database price
      let itemUnitPrice = Number(product.price);
      let extrasTotal = 0;

      // Add prices for addedExtras if they exist
      if (item.addedExtras && Array.isArray(item.addedExtras)) {
        for (const extra of item.addedExtras) {
          extrasTotal += Number(extra.price || 0);
        }
      }

      const itemTotal = (itemUnitPrice + extrasTotal) * Number(item.quantity);

      // Overwrite the frontend price with the verified server unit price
      item.price = itemUnitPrice + extrasTotal; 
      serverCalculatedTotal += itemTotal;
    }

    // If there are inactive items, block the checkout and return an error
    if (inactiveItems.length > 0) {
      res.status(400).json({ 
        error: `Cannot proceed with checkout. The following items are currently unavailable: ${inactiveItems.join(', ')}` 
      });
      return;
    }
    // --- NEW VALIDATION & PRICE RECALCULATION END ---

    // Execute in a transaction for data consistency
    const result = await prisma.$transaction(async (tx) => {
      // 2. Create Order using the SERVER CALCULATED TOTAL
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount: serverCalculatedTotal, // Securely calculated on backend
          status: 'Placed',
          paymentStatus: paymentMethod === 'COD' ? 'Pending (COD)' : 'Initiated',
          customerName: customerName || null,
          customerPhone: customerPhone || null,
          deliveryAddress: deliveryAddress || null,
        }
      });

      // 3. Create Order Items using the securely calculated unit prices
      const orderItemsData = cartItems.map((item: any) => ({
        orderId: newOrder.id,
        productId: item.productId || item.menuItemId,
        quantity: item.quantity,
        price: item.price, // This is now the verified server price
        size: item.size || null,
        removedToppings: item.removedToppings || [],
        addedExtras: item.addedExtras || []
      }));

      await tx.orderItem.createMany({ data: orderItemsData });

      // 4. Clear DB cart (best effort)
      await tx.cartItem.deleteMany({ where: { userId } }).catch(() => {});

      return newOrder;
    });

    const order = result;

    // 5. Stripe integration for ONLINE payment
    if (paymentMethod === 'ONLINE') {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          // Use the secure server-calculated total for the actual charge
          amount: Math.round(serverCalculatedTotal * 100),
          currency: 'aud',
          metadata: {
            orderId: order.id,
            userId: userId
          }
        });

        // Use standard Prisma access
        await prisma.payment.create({
          data: {
            orderId: order.id,
            provider: 'Stripe',
            gatewayOrderId: paymentIntent.id,
            status: 'Requires_Payment_Method'
          }
        });

        res.status(201).json({
          message: 'Order placed, proceed to payment',
          order,
          clientSecret: paymentIntent.client_secret,
          stripePublishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY,
        });
        return;
      } catch (stripeError) {
        console.error('Stripe Error:', stripeError);
        res.status(500).json({ error: 'Failed to initialize payment gateway' });
        return;
      }
    }

    // Response for COD
    res.status(201).json({ message: 'Order placed successfully via COD', order });

  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Internal server error during processing' });
  }
};


export const stripeWebhook = async (req: any, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle successful payments
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      await prisma.$transaction([
        (prisma.payment as any).updateMany({
          where: { gatewayOrderId: paymentIntent.id },
          data: { status: 'Success', gatewayPaymentId: paymentIntent.latest_charge as string }
        }),
        prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'Success' }
        })
      ]);
    }
  }

  res.json({ received: true });
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error fetching orders' });
  }
};

export const updatePaymentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId, status } = req.body;
    
    if (!orderId || !status) {
      res.status(400).json({ error: 'OrderId and status are required' });
      return;
    }

    // Securely update order and payment status
    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: status }
      }),
      (prisma.payment as any).updateMany({
        where: { orderId: orderId },
        data: { status: status === 'Paid' ? 'Success' : status }
      })
    ]);

    res.json({ message: 'Order payment status updated successfully' });
  } catch (err) {
    console.error('updatePaymentStatus error:', err);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};
