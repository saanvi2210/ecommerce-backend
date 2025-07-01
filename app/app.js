import express from 'express'
import dbConnect from "../config/dbConnect.js";
import userRoutes from '../routes/usersRoute.js';
import { globalErrorHandler, notFound } from '../middlewares/globalErrorHandler.js';
import productRoutes from '../routes/productsRoute.js';
import categoryRoutes from '../routes/categoriesRoute.js';
import brandRoutes from '../routes/brandsRoute.js';
import colorRoutes from '../routes/colorsRoute.js';
import reviewRoutes from '../routes/reviewsRoute.js';
import orderRoutes from '../routes/ordersRoute.js';
import Stripe from 'stripe'
import dotenv from "dotenv"
import Order from '../models/Order.js'
import couponRoutes from '../routes/couponsRoute.js';

dotenv.config()
dbConnect()

const app = express()

//stripe webhook
// This is your test secret API key.
const stripe = new Stripe(process.env.STRIPE_KEY);
const endpointSecret = 'whsec_c43d1f53d52e1d4723e8782b4414be388ee6dd7cccaf9c850125c50319d4a536';

app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  let event = request.body;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    //   console.log(event, "event")
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
    
  }

  if(event.type === 'checkout.session.completed'){
    //update the order
    const session = event.data.object
    const {orderId} = session.metadata
    const paymentStatus = session.payment_status
    const paymentMethod = session.payment_method_types[0]
    const totalAmount = session.amount_total
    const currency = session.currency
    //find order and update status
    const order = await Order.findByIdAndUpdate(JSON.parse(orderId),{
        totalPrice: totalAmount/100,
        currency,
        paymentMethod,
        paymentStatus
    },
{
    new: true
})
console.log(order)
}else{
    return
}

  // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
//       // Then define and call a method to handle the successful payment intent.
//       // handlePaymentIntentSucceeded(paymentIntent);
//       break;
//     case 'payment_method.attached':
//       const paymentMethod = event.data.object;
//       // Then define and call a method to handle the successful attachment of a PaymentMethod.
//       // handlePaymentMethodAttached(paymentMethod);
//       break;
//     default:
//       // Unexpected event type
//       console.log(`Unhandled event type ${event.type}.`);
//   }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.use(express.json())
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/brands', brandRoutes)
app.use('/api/v1/colors', colorRoutes)
app.use('/api/v1/reviews', reviewRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/coupons', couponRoutes)




//if not found in user routes it will go here
app.use(notFound)

// gloabl error handling middleware
app.use(globalErrorHandler)
export default app