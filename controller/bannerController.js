const bannerModel = require('../models/banner')
const fs = require('fs')
const path = require('path')
module.exports = {
    getBanner: async (req, res) => {
        try {
            const pageNumber = parseInt(req.query.page) || 1;
            const options = {
                page: pageNumber,
                limit: 10
            };
            const result = await bannerModel.paginate({}, options);
            res.render('admin/banner', { banners: result.docs, paginationInfo: result, url: 'banner' });
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },
    getAddBanner: (req, res) => {
        try {
            res.status(200).render('admin/addBanner', { url: 'banner' })

        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },
    postAddBanner: async (req, res) => {
        try {
            const { bannerName, bannerHeading, specialPrice, validFrom, validTo } = req.body
            const bannerImage = req.file?.filename;
            const newBanner = await bannerModel({ bannerName, bannerHeading, specialPrice, validFrom, validTo, bannerImage })
            await newBanner.save()
            res.status(200).json({ message: "Banner added successfully" })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' })
        }

    },
    deleteBanner: async (req, res) => {
        try {
            const id = req.params.bannerId
            const deleteBanner = await bannerModel.findByIdAndDelete(id)
            if (deleteBanner) {
                const oldImagePath = path.join(__dirname, '../public/uploads/banners', deleteBanner.bannerImage)
                fs.unlinkSync(oldImagePath)
                res.status(200).json({ message: 'Coupon deleted successfully' })
            } else {
                res.status(400).json({ message: 'Can not delete the coupon' })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' })
        }

    },
    getUpdateBanner: async (req, res) => {
        try {
            const id = req.params.bannerId
            const banner = await bannerModel.findById(id)
            res.render('admin/updateBanner', { banner, url: 'banner' })
        } catch (error) {

        }
    },
    postUpdateBanner: async (req, res) => {
        try {
            const id = req.params.bannerId
            const banner = await bannerModel.findOne({ _id: id })
            const { bannerName, bannerHeading, specialPrice, validFrom, validTo } = req.body
            const image = req.file?.filename;
            const previousImage = banner.bannerImage
            const newImage = image ?? previousImage
            const upadateBanner = await bannerModel.findByIdAndUpdate(id, { $set: { bannerName, bannerHeading, specialPrice, validFrom, validTo, bannerImage: newImage } })
            if (upadateBanner) {
                if (image) {
                    const oldImagePath = path.join(__dirname, '../public/uploads/banners', upadateBanner.bannerImage)
                    fs.unlinkSync(oldImagePath)
                }
                res.status(200).json({ message: 'banner updater successfully' })
            }
            else {
                res.status(400).json({ message: 'error occured' })
            }

        } catch (error) {
            res.status(500).send("Internal server error")
        }
    }


}