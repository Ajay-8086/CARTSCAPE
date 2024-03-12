
const userModel = require('../models/customer');
const orderModel = require('../models/order');
const sendMail = require('../utility/sendMail');


module.exports = {
    // USER MANAGEMENT -------------------------------------------------------------------------->
    //To view the user details
    getUserList: async (req, res) => {
        try {
            const adminLoggedIn =  req.session.adminLoggedIn
            if(!adminLoggedIn){
                return res.status(401).redirect('/admin/login')
            }
            const pageNumber = parseInt(req.query.page) || 1;
            const options = {
                page: pageNumber,
                limit: 10
            };
            const result = await userModel.paginate({blocked:false}, options);
            const users = result.docs
            res.render('admin/userList', { users, paginationInfo: result, url: "user" });
        } catch (error) {
            res.status(500).send('internal server error')
        }
    },
    // To block the users 
    blockUser: async (req, res) => {
        try {
            const adminLoggedIn =  req.session.adminLoggedIn
            if(!adminLoggedIn){
                return res.status(401).redirect('/admin/login')
            }
            const userId = req.params.userId
            const blocked = await userModel.findByIdAndUpdate(userId, { $set: { blocked: true } })
            if (blocked) {
                res.status(200).json({ success: true, message: 'user blocked successfully' })
            }
            else {
                res.status(400).json({ error: 'user not blocked' })
            }
        } catch (error) {
            console.log('Server error');
            res.status(500).json({ error: 'Internal server error' })
        }
    },
    //To view the blocked users
    getBlockedUsers: async (req, res) => {
        try {
            const adminLoggedIn =  req.session.adminLoggedIn
            if(!adminLoggedIn){
                return res.status(401).redirect('/admin/login')
            }
            const pageNumber = parseInt(req.query.page) || 1;
            const options = {
                page: pageNumber,
                limit: 10
            };
            const result = await userModel.paginate({}, options);
            const users = result.docs.filter(val => val.blocked)
            res.render('admin/blockedUsers', { users, paginationInfo: result, url: "blockeduser" });
        } catch (error) {
            res.status(500).send('internal server error')
        }
    },
    //Unblock the blocked user
    unBlockUser:async(req,res)=>{
        try {
            const userId = req.params.userId
            const unblock = await userModel.findByIdAndUpdate(userId,{$set:{blocked:false}})
            if(unblock){
                res.status(200).json({message:'User unblocked successfully'})
            }else{
                res.status(400).json({error:"User unblocking failed"})
            }
        } catch (error) {
            console.log('Server error');
            res.status(500).json({ error: 'Internal server error' })
        }
    },
    // To view complete user order
    getUserOrders : async (req, res) => {
        try {
            const adminLoggedIn =  req.session.adminLoggedIn
            if(!adminLoggedIn){
                return res.status(401).redirect('/admin/login')
            }
            const pageNumber = parseInt(req.query.page) || 1;
            const options = {
                page: pageNumber,
                limit: 10,
                populate: { path: 'products.id', model: 'products' } 
            }; 
            const result = await orderModel.paginate({}, options);
            const orders = result.docs;
    
            res.status(200).render('admin/userOrders', { orders, paginationInfo: result, url: "order" });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error');
        }
    },
    //User order cancelling
    userOrderCancel:async(req,res)=>{
        try {
            const adminLoggedIn =  req.session.adminLoggedIn
            if(!adminLoggedIn){
                return res.status(401).redirect('/admin/login')
            }
            const orderId = req.query.id
            const updatedOrder = await orderModel.findByIdAndUpdate(orderId,{status:'cancelled'})
         if(updatedOrder){
            for(const product of updatedOrder.products){
                await productModel.updateOne(
             {_id:product.id},
             {$set:{$inc:{stock:-product.quantity}}
                
           })
          }
          res.status(200).json('orderCancelled')
        }else{
            res.status(400).json('order cant canccel')
        }
        } catch (error) {
            res.status(500).json('Internal server error')
        }
    },
    // Order delivery confirming
    userOrderdeliver:async(req,res)=>{
        try {
            const adminLoggedIn =  req.session.adminLoggedIn
            if(!adminLoggedIn){
                return res.status(401).redirect('/admin/login')
            }
            const orderId = req.query.id
            const orderDeliverd = await orderModel.findByIdAndUpdate(orderId,{status:'deliverd'})
            const userEmail = orderDeliverd.userEmail
            if(orderDeliverd){
            const deliverd =  await sendMail(userEmail,'deliverd');
        }
        res.status(200).json('Order Deliverd')
        } catch (error) {
            res.status(500).json('Internal server error')
        }
    }
}