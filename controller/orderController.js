const categoryModel = require('../models/category')
const orderModel = require('../models/order')
const productModel = require('../models/product')
const cartModel = require('../models/cart')
const { default: mongoose } = require('mongoose')
const profileModel = require('../models/profile')
const crypto = require('crypto')
const ratingModel = require('../models/rating')
const sendMail = require('../utility/sendMail');
const couponModel = require('../models/coupon')
const customerModel = require('../models/customer')
const razorpay = require('razorpay');
var instance = new razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET })
module.exports = {

  // COD otp verification get
  getCashonDelivery: async (req, res) => {
    try {

        const categories = await categoryModel.find({ isDeleted: false })
        res.status(200).render('user/checkoutOtp', { categories })
      
    } catch (error) {
      console.log('internal server error');
      res.status(500).send('Internal server error')
    }
  },

  // COD otp verification post

  postCashonDelivery: async (req, res) => {
    try {
      const email = req.session.checkoutEmail;
      const products = req.session.productsDetails;
      const userId = req.session.userId;
      const addressId = new mongoose.Types.ObjectId(req.session.addressId);

      if (!email) {
        return res.status(401).json('User not found');
      }

      const { digit1, digit2, digit3, digit4 } = req.body;
      const userOtp = parseInt(`${digit1}${digit2}${digit3}${digit4}`);
      const generateOTP = req.session.checkoutOTP;

      if (generateOTP === userOtp) {
        for (const product of products) {
          const order = new orderModel({
            userEmail: email,
            products: [{
              id: product.id,
              quantity: product.quantity,
              price: product.price,
              selectedColor: product.selectedColor,
              selectedSize: product.selectedSize
            }],
            address: addressId,
            totalPrice: product.price * product.quantity,
            paymentMethod: 'Cash on Delivery',
            status: 'pending'
          });

          const result = await order.save();

          if (result) {
            await productModel.updateOne(
              { _id: product.id },
               { $inc: { stock: -product.quantity }  }
            );

            await cartModel.updateOne(
              { userId },
              { $pull: { productId: { id: product.id } } }
            );

            await orderModel.findByIdAndUpdate(result._id, { status: 'completed' });
          }
        }
        delete req.session.productDetails
        res.status(200).json('success');
      } else {
        res.status(401).json('Invalid otp');
      }
    } catch (error) {
      console.log(error);
      res.status(500).json('Internal server error');
    }
  },
  //Renering the checkout page 
  getCheckout: async (req, res) => {
    try {
        const userId = req.session.userId
        if (!userId) {
          return res.status(401).redirect('/login')
        } else {
          const categories = await categoryModel.find({ isDeleted: false })
          let users;
          usersAddressExist = await profileModel.findOne({ userId })
          if (usersAddressExist) {
            users = await profileModel.findOne({ userId }).populate('userId')
          } else {
            users = await customerModel.findOne({ _id: userId })
          }
          let products,totalPrice,discount;
          if(req.query.productId){
            req.session.productId = req.query.productId
            const productId = req.query.productId
            const productDetails = await productModel.findOne({ _id: productId })
            totalPrice =Math.floor(productDetails.price - (productDetails.price * productDetails.discount/100))
            req.session.productDetails = productDetails
            const singleProduct = {
              userId: userId,
              productId: [{
                id: productDetails,
                quantity: 1,
              }]
            }
            products = singleProduct
          } else {
            let mrp;
            products = await cartModel.findOne({ userId }).populate('productId.id')
             mrp = products.productId.reduce((acc,data)=>{
            return acc += (((data.id.price)-(data.id.price*data.id.discount/100))*data.quantity)
          },0)
          totalPrice = Math.floor(mrp- (mrp * 4/100))
          }
          discount =  parseInt(totalPrice*.02)
          const applicableCoupons = await couponModel.find({
            $and: [
              { purchaseAbove: { $gte: totalPrice } },
              { purchaseminimum: { $lte: totalPrice } }
            ]
          });
          req.session.totalPrice = Math.floor(totalPrice)
          res.status(200).render('user/checkout', { categories, users, totalPrice, discount, products, applicableCoupons })
      }
    } catch (error) {
      res.status(500).send('Internal server error')
    }
  },
  postCheckout: async (req, res) => {
    try {
      const { payment, email, products, addressId } = req.body
      const totalPrice = req.session.totalPrice
      req.session.productsDetails = products
      req.session.addressId = addressId
      req.session.payment = payment
      const key = process.env.KEY_ID
      if (payment == 'Online_Payment') {
        const amount = Number(totalPrice) * 100
        const orderOptions = {
          amount: amount,
          currency: 'INR',
          receipt: 'receipt_order_1',
          payment_capture: 1
        };
        const order = await instance.orders.create(orderOptions);
        req.session.checkoutEmail = email
        res.status(200).json({ online: true, order, key });
      } else {
        req.session.checkoutEmail = email
        const generateOTP = req.session.generateOTP || Math.floor(1000 + Math.random() * 9000);
        req.session.checkoutOTP = generateOTP;
        await sendMail(email, `${generateOTP}`);
        res.status(200).json({ cod: true })
      }
    } catch (error) {
      console.log(error);
      res.status(500).json('internal server error')
    }
  },
  //coupon discount adding
  couponApply: async (req, res) => {
    try {
      const { coupon} = req.body
      const discounted = Math.floor(req.session.totalPrice * .02)
      const totalPrice =  req.session.totalPrice -  discounted
      const couponDetail = await couponModel.findOne({ couponCode: coupon })
      const discount = couponDetail.discount
      const grandTotal = parseInt(totalPrice) - (parseInt(totalPrice) * parseInt(discount) / 100)
      req.session.totalPrice = Math.floor(grandTotal)
      res.status(200).json({ discount: grandTotal })
    } catch (error) {
      console.log(error);
      res.staus(500).json('internal server error')
    }

  },
  // adding new address from checkout get 
  checkoutAddress: async (req, res) => {
    try {
      const categories = await categoryModel.find({ isDeleted: false })
      res.status(200).render('user/checkout-address', { categories })
    } catch (error) {
      console.log(error);
      res.status(500).redirect('/error')
    }
  },
  // adding new address from checkout 
  postcheckoutAddress: async (req, res) => {
    try {
      const { address, city, house_No, postcode, altr_number, state, country, district } = req.body
      const userId = req.session.userId
      const productId = req.session.productId
      if (!userId) {
       return res.status(401).json('invalid user')
      } else {
        const addressExist = await profileModel.findOne({ userId })
        if (!addressExist) {
          const newAdress = new profileModel({ userId, addresses: [{ address, city, house_No, postcode, altr_number, state, country, district }] })
          await newAdress.save()
          res.status(200).json({productId:productId??''})
        } else {
          addressExist.addresses.push({ address, city, house_No, postcode, altr_number, state, country, district })
          addressExist.save()
          res.status(200).json({productId:productId??''})
        }
      }
    } catch (error) {
      res.status(500).json('Internal server error')
    }
  },
  // user orders rendering
  myOrders: async (req, res) => {
    try {
      const categories = await categoryModel.find({ isDeleted: false })
      const email = req.session.signedEmail
      const myOrders = await orderModel.find({ userEmail: email }).populate('products.id').sort({createdAt:-1});
      res.status(200).render('user/myOrders', { categories, myOrders })
    } catch (error) {
      console.log(error);
      res.status(500).send('internal sever error')
    }
  },
  //cancel user order 
  cancelOrder: async (req, res) => {
    try {
      const orderId = req.query.id
      const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status: 'cancelled' })
      if (updatedOrder) {
        for (const product of updatedOrder.products) {
          await productModel.updateOne(
            { _id: product.id },
            {
               $inc: { stock: product.quantity } 
            })
        }
        res.status(200).redirect('/my-orders')
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal server error')
    }
  },
  // Getting single order details
  orderDetails: async (req, res) => {
    try {
      const userId = req.session.userId
      if (!userId) {
        return res.status(401).redirect('/login')
      }
      const categories = await categoryModel.find({ isDeleted: false })
      const orderId = req.query.id
      const orderDetails = await orderModel.findById(orderId).populate('products.id')
      const addressId = orderDetails.address
      const userAddress = await profileModel.findOne({ userId })
      const orderAddress = userAddress.addresses.find(addr => addr._id.toString() == addressId)
      let ratedProduct, existingReview;
      for (const product of orderDetails.products) {
        ratedProduct = await ratingModel.findOne({ productId: product.id })
      }

      if (ratedProduct) {
        existingReview = ratedProduct.reviews.find(review => review.userId == userId)
      }
      res.status(200).render('user/orderDetails', { categories, existingReview, orderDetails, orderAddress })
    } catch (error) {
      console.log(error);
      res.status(500).send('internal server error')
    }
  },
  // online payment confirmation
  paymentConfirmation: async (req, res) => {
    try {
      const { data } = req.body;
      let generated_signature = crypto.createHmac('sha256', process.env.KEY_SECRET);
      generated_signature.update(data.razorpay_order_id + '|' + data.razorpay_payment_id);
      generated_signature = generated_signature.digest('hex');
      if (generated_signature === data.razorpay_signature) {
        const email = req.session.checkoutEmail;
        const products = req.session.productsDetails;
        const userId = req.session.userId;
        const addressId = new mongoose.Types.ObjectId(req.session.addressId);
        for (const product of products) {
          const order = new orderModel({
            userEmail: email,
            products: [{
              id: product.id,
              quantity: product.quantity,
              price: product.price,
              selectedColor: product.selectedColor,
              selectedSize: product.selectedSize
            }],
            address: addressId,
            totalPrice: product.price * product.quantity,
            paymentMethod: 'Online Payment',
            status: 'pending'
          });

          const result = await order.save();

          if (result) {
            await productModel.updateOne(
              { _id: product.id },
               { $inc: { stock: -product.quantity }  }
            );
            await cartModel.updateOne(
              { userId },
              { $pull: { productId: { id: product.id } } }
            );
            await orderModel.findByIdAndUpdate(result._id, { status: 'completed' });
          }
        }
        delete req.session.addressId
        delete req.session.productDetails
        res.status(200).json({ payment: true });
      } else {
        res.status(400).json({ payment: false });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json('internal server error');
    }
  }

}


