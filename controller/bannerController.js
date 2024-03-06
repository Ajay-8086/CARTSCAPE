const bannerModel = require('../models/banner')
const fs = require('fs')
const path = require('path')
module.exports = {
    // View the banners
    getBanner: async (req, res) => {
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
            const result = await bannerModel.paginate({}, options);
            res.status(200).render('admin/banner', { banners: result.docs, paginationInfo: result, url: 'banner' });
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },
    //Adding banner form get
    getAddBanner: (req, res) => {
        try {
            const adminLoggedIn =  req.session.adminLoggedIn
            if(!adminLoggedIn){
                return res.status(401).redirect('/admin/login')
            }
            res.status(200).render('admin/addBanner', { url: 'banner' })
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },
    //Adding banner post
    postAddBanner: async (req, res) => {
        try {
            const { bannerName, bannerHeading, specialPrice, validFrom, validTo } = req.body
            const bannerImage = req.file?.filename;
            const newBanner = await bannerModel({ bannerName, bannerHeading, specialPrice, validFrom, validTo: new Date(validTo), bannerImage })
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
                if(fs.existsSync(oldImagePath)){
                    fs.unlinkSync(oldImagePath)
                    res.status(200).json({ message: 'banner deleted successfully' })
                }else{
                    res.status(200).json({ message: 'banner deleted successfully without image' })
                }
            } else {
                 res.status(400).json({ message: 'Can not delete the banner' })
            }
        } catch (error) {
            console.log(error);
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