import Stripe from "stripe";
import Order from "../models/order.model.js";
import Payment from "../models/payment.model.js";

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const rawBody = req.body;

  let event;

  // 1. Verify the event came from Stripe
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);

      // Get our Payment ID from the metadata
      const { paymentId, orderId } = paymentIntent.metadata;

      try {
        // Find our payment document
        const payment = await Payment.findById(paymentId);
        if (!payment) {
          return res.status(404).send('Payment record not found.');
        }

        // Update payment status to 'succeeded'
        payment.status = 'succeeded';
        await payment.save();

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
          return res.status(404).send('Order not found.');
        }

        // Update order status to 'pickup' (or 'processing', etc.)
        order.status = 'pickup'; // Now the order is paid and ready
        await order.save();

      } catch (err) {
        console.error('Error updating database:', err);
        return res.status(500).json({ error: 'Database update failed' });
      }
      break;

    case 'payment_intent.payment_failed':
      const paymentIntentFailed = event.data.object;
      console.log('PaymentIntent failed.', paymentIntentFailed.id);

      // You can also handle failed payments here
      // e.g., update payment status to 'failed'
      try {
        const { paymentId } = paymentIntentFailed.metadata;
        const payment = await Payment.findById(paymentId);
        if (payment) {
            payment.status = 'failed';
            await payment.save();
        }
      } catch (err) {
        console.error('Error updating failed payment:', err);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // 3. Return a 200 to Stripe
  res.status(200).json({ received: true });
};
