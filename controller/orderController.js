const categoryModel = require('../models/category')
const orderModel =  require('../models/order')
const productModel = require('../models/product')
const cartModel = require('../models/cart')
const customerModel = require('../models/customer')
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
  getPayment:async(req,res)=>{
    try {
      const categories = await categoryModel.find({isDeleted:false})
      res.status(200).render('user/payment',{categories})
    } catch (error) {
      console.log(error);
      res.status(500).send('internal server error')
    }
  },
  getCashonDelivery:async(req,res)=>{
    try {
      const categories = await categoryModel.find({isDeleted:false})
      res.status(200).render('user/checkoutOtp',{categories})
    } catch (error) {
      console.log('internal server error');
      res.status(500).send('Internal server error')
    }
  },
  postCashonDelivery:async(req,res)=>{
      try {
        const email = req.session.checkoutEmail
        const products = req.session.productsDetails
        const totalPrice = req.session.totalPrice
        const userId = req.session.userId
        const addressId = req.session.addressId
        console.log(addressId);
        if(!email){
          res.status(401).json('User not found')
        }
        const { digit1, digit2, digit3, digit4 } = req.body;
        const userOtp = parseInt(`${digit1}${digit2}${digit3}${digit4}`);
            const generateOTP = req.session.checkoutOTP;
            if (generateOTP === userOtp) {
              const order = new orderModel({
                userEmail: email,
                products: products.map(product => ({
                    id: product.id,
                    quantity: product.quantity,
                    price:product.price,
                    selectedColor: product.selectedColor,
                    selectedSize: product.selectedSize
                })),
                
                address:addressId,
                totalPrice: totalPrice,
                paymentMethod: 'Cash on Delivery',
                status:'pending'
            });
          const result=   await order.save();
              if(result){
                for(const product of products){
                 await productModel.updateOne(
              {_id:product.id},
              {$set:{$inc:{stock:-product.quantity}}
              
            })
             await cartModel.updateOne(
              { userId },
              { $pull: { productId: { id: product.id} } }
          );
                }
             await orderModel.findByIdAndUpdate(result._id, { status: 'completed' });
                res.status(200).json('success')
              }

          } else {
              res.status(401).json('Invalid otp');
          }
    } catch (error) {
        res.status(500).json('internal server error')
    }
    },
    myOrders:async(req,res)=>{
      try {
        const categories = await categoryModel.find({isDeleted:false})
        const email= req.session.signedEmail
        const myOrders = await orderModel.find({userEmail:email}).populate('products.id')
        res.status(200).render('user/myOrders',{categories,myOrders})
      } catch (error) {
        console.log(error);
        res.status(500).send('internal sever error')
      }
    },
    cancelOrder:async(req,res)=>{
      try {
        const orderId = req.query.id
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId,{status:'cancelled'})
        if(updatedOrder){
          res.status(200).redirect('/my-orders')
        }
      } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error')
      }
    }
  
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
