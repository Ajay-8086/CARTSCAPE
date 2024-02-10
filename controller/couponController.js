const couponModel = require('../models/coupon')
module.exports = {
    getCoupons: async (req, res) => {
        try {
            const pageNumber = parseInt(req.query.page) || 1;
            const options = {
                page: pageNumber,
                limit: 10
            };
            const result = await couponModel.paginate({}, options);
            res.render('admin/coupons', { coupons: result.docs, paginationInfo: result, url: 'coupon' });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: 'Internal server error' })
        }
    },
    getAddCoupon: (req, res) => {
        try {
            res.status(200).render('admin/addCoupon', { url: 'coupon' })

        } catch (error) {
            res.status(500).send('internal server error')
        }
    },
    postAddCoupon: async (req, res) => {
        try {
            const { couponCode, couponName, discount, purchaseAbove, validFrom, validTo } = req.body
            const newCoupon = await couponModel(
                { couponCode, couponName, discount, purchaseAbove, validFrom, validTo }
            )
            await newCoupon.save()
            res.status(200).redirect('/admin/coupons')
        } catch (error) {
            console.log('error');
        }

    },
    getUpdateCoupon: async (req, res) => {
        try {
            const id = req.params.couponId
            const coupon = await couponModel.find({ _id: id })
            res.status(200).render('admin/updateCoupons', { coupon, url: 'coupon' })
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: 'Internal server error' })
        }
    },
    postUpdateCoupon: async (req, res) => {
        try {

            const id = req.params.couponId

            const { couponCode, couponName, discount, purchaseAbove, validFrom, validTo } = req.body

            const updateCoupon = await couponModel.findByIdAndUpdate(id, { $set: { couponCode, couponName, discount, purchaseAbove, validFrom, validTo } })
            if (updateCoupon) {
                res.status(200).json({ msg: 'coupon updated successfully' })
            } else {
                res.status(400).json({ msg: 'product updating failed' })
            }
        } catch (error) {
            res.status(500).json({ msg: 'internal server error' })
        }
    },
    deleteCoupon: async (req, res) => {
        try {
            const id = req.params.couponId
            const deleteCoupon = await couponModel.findByIdAndDelete(id)
            if (deleteCoupon) {
                res.status(200).json({ message: 'Coupon deleted successfully' })
            } else {
                res.status(400).json({ message: 'Can not delete the coupon' })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' })
        }

    }
}