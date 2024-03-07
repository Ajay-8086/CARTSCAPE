const customerModel = require('../models/customer');
const OrderModel = require('../models/order');
const productModel = require('../models/product');

module.exports = {
    //Admin dashboard get
    adminDahboardGet:(req,res)=>{
        try {
            const adminLoggedIn =  req.session.adminLoggedIn
            if(!adminLoggedIn){
                return res.status(401).redirect('/admin/login')
            }
            res.render('admin/adminDashboard',{url:'home'})
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error')
        }
    },

    //Product stock chart 

    categoryChart: async (req, res) => {
        try {
            const categoryData = await productModel.aggregate([{
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }]);
            const labels = categoryData.map(item => item._id);
            const data = categoryData.map(item => item.count);
            res.status(200).json({ labels, data });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    // user order  details in a single year
    orderChart:async(req,res)=>{
        try {
            const currentDate = new Date()
            const currentYear = currentDate.getFullYear()
            const nextYear = currentYear+1
            const startOfCurrentYear = new Date(currentYear,0,1)
            const endOfNextYear = new Date(nextYear,11,31,23,59,59)
            const orders = await OrderModel.find({
                createdAt:{
                    $gte:startOfCurrentYear,
                    $lt:endOfNextYear
                },
                status: "deliverd"
            })
            const productCounts = {}
            const allProducts = await productModel.find({}, {_id: 1, name: 1})

            orders.forEach(order=>{
                order.products.forEach(product=>{
                    const productName = allProducts.find(p => p._id.equals(product.id)).name;
                    productCounts[productName] = (productCounts[productName]||0) + product.quantity
                })
            })
            res.status(200).json({startOfCurrentYear,endOfNextYear,productCounts})
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error')
        }
    },
    // Daily signedup user chart
    customerGrowth:async(req,res)=>{
        try {
            const dailySignup = await customerModel.aggregate([{
                $group:{
                    _id:{
                        year:{$year:'$createdAt'},
                        month:{$month:'$createdAt'},
                        day:{$dayOfMonth:'$createdAt'}
                    },
                    count:{$sum:1}
                }
            }])
            const dates = dailySignup.map(day => `${day._id.year}-${day._id.month}-${day._id.day}`);
            const counts = dailySignup.map(day => day.count);
            res.json({ dates, counts }); 
          } catch (error) {
            console.error('Error fetching daily signed users:', error);
            res.status(500).json({ error: 'Internal server error' });
          }
       
    }
};
