
const userModel = require('../models/customer')



module.exports = {

    // ADMIN SIGNUP MANAGEMENT ------------------------------------------------------------------------------->
    getDashboard: (req, res) => {
        try {
            res.status(200).render('admin/dashboard', { error: req.flash('error') })
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },

    // USER MANAGEMENT -------------------------------------------------------------------------->

    getUserList: async (req, res) => {
        try {
            const pageNumber = parseInt(req.query.page) || 1;
            const options = {
                page: pageNumber,
                limit: 10
            };
            const result = await userModel.paginate({}, options);
            const users = result.docs.filter(val=> !val.blocked)
            res.render('admin/userList', { users, paginationInfo: result, url: "user" });
        } catch (error) {
            res.status(500).send('internal server error')
        }
    },
    deleteUser: async (req, res) => {
        try {
            const userId = req.params.userId
            const blocked = await userModel.findByIdAndUpdate(userId,{$set:{blocked:true}})
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



}