

module.exports = {
    home: (req, res) => {
        try {
            res.status(200).render('user/userDashboard')
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },


    getCart: (req, res) => {
        try {
            res.status(200).render('user/cart')
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },

    getWishList: (req, res) => res.render('user/wishlist')
};
