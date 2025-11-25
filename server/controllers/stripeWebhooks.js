import stripe from "stripe";
import Booking from "../models/Booking";

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
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    // Getting Session Metadata
    const session = await stripeInstance.checkout.sessions.list({
      payment_intent: paymentIntentId,
    });

    const { bookingId } = session.data[0].metadata;

    // Mark Payment as Paid
    await Booking.findByIdAndUpdate(bookingId, {
     isPaid:true,
     paymentMethod:"stripe"
    });

    // You can add more logic here like sending confirmation email, etc.
  }else{
    console.log("unhandle event type:",event.type)
  }
  response.json({received:true})

  // Return a 200 response to acknowledge receipt of the event
  response.status(200).send({ received: true });
};