// const stripe = require('stripe')(process.env.STRIPE_SK);

// app.post('/charge', async (req, res) => {
//   const { amount, token } = req.body;

//   try {
//     const charge = await stripe.charges.create({
//       amount,
//       currency: 'usd',
//       source: token.id,
//       description: 'Charge for test@example.com',
//     });

//     res.send('Payment successful');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Payment failed');
//   }
// });

module.exports = {
  getPayment:(req,res)=>{
    try {
      res.status(200).render('user/payment')
    } catch (error) {
      console.log(error);
    }
  },
}
//   payment:async(req,res)=>{
// try {
//   const totalPrice = req.session.totalPrice
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: totalPrice,
//     currency: "inr",
//     // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
//     automatic_payment_methods: {
//       enabled: true,
//     },
//   });
// } catch (error) {
//   res.status(500).send('internal server error')
// }
//   }
// }
