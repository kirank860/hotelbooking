import stripe from "stripe";
import Booking from "../models/Booking.js";

// API to handle Stripe Webhooks
export const stripeWebhooks = async (request, response) => {
  // Stripe Gateway Initialize
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const { bookingId } = session.metadata;

      // Mark Payment as Paid
      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentMethod: "stripe" // or session.payment_method_types[0]
      });
      break;
    }
    case 'payment_intent.succeeded': {
      // Optional: Log or handle if needed, but Checkout flow uses session.completed
      console.log("Payment intent succeeded for session.");
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({ received: true });
};