const productModel = require('../models/product')
const categoryModel = require('../models/category')
const fs = require('fs')
const path = require('path')
const moment = require('moment')

module.exports = {

    getProducts: async (req, res) => {
        try {
            const pageNumber = parseInt(req.query.page) || 1;
            const options = {
                page: pageNumber,
                limit: 10
            };
            const result = await productModel.paginate({}, options);
            res.render('admin/products', { products: result.docs, paginationInfo: result, url: 'product' })
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },


    getAddProduct: async (req, res) => {
        try {
            const categoryList = await categoryModel.find({})
            res.render('admin/addProduct', { categoryList, url: 'product' })
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' })
        }

    },

    postAddProduct: async (req, res) => {
        try {
            const { name, price, stock, discount, description, colors, subcategory, category } = req.body
            const productExist = await productModel.findOne({ name })
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No files uploaded' });
            }
            if (req.files.length > 5) {

                return res.status(400).json({ error: 'product images exceeded(>5)' })
            }
            if (productExist) {

                return res.status(400).json({ error: 'Product already exist' })
            }

            const image = req.files.map((file) => file.filename)
            const productAdded = moment().format('DD/MM/YYYY')
            const newProduct = await productModel({ name, price, stock, discount, description, image, colors, productAdded, category, subcategory })
            await newProduct.save()
            res.status(200).json({ success: 'product added successfully' })
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' })
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const product_id = req.params.id
            const deletedProduct = await productModel.findByIdAndDelete(product_id)
            if (deletedProduct) {
                deletedProduct.image.forEach((img) => {

                    const oldImagePath = path.join(__dirname, '../public/uploads/products', img)
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }

                })
                res.status(200).json({ success: true, message: 'product deleted successfully' })
            }
            else {
                res.status(404).json({ success: false, message: 'Product not found' });
            }
        } catch (error) {
            console.log('Error while deleting the product');
            res.status(500).json({ message: 'Internal server' })
        }
    },
    getUpdateProduct: async (req, res) => {
        try {
            const id = req.params.productId
            const product = await productModel.find({ _id: id })
            const categoryList = await categoryModel.find({})
            res.status(200).render('admin/updateProduct', { product, categoryList, url: 'product' })
        } catch (error) {
            res.status(500).send('internal server error')
        }

    },
    postUpdateProduct: async (req, res) => {
        try {
            const id = req.params.productId;
            const productDetails = await productModel.findById(id);
            const { name, price, stock, discount, description, colors, subcategory, category } = req.body;
    
            let newFields = { name, price, stock, discount, description, colors, subcategory, category };
    
            if (req.files.length > 0) {
                productDetails.image.forEach((img) => {
                    const oldImagePath = path.join(__dirname, '../public/uploads/products', img);
                    if(fs.existsSync(oldImagePath)){
                        fs.unlinkSync(oldImagePath);    
                    }
                });
    
                const image = req.files.map((file) => file.filename);
                newFields.image = image;
            }
    
            await productModel.findByIdAndUpdate(id, { $set: newFields });
            res.status(200).redirect('/admin/product');
        } catch (error) {
            console.log('Server error:', error);
            res.status(500).send('Internal server error');
        }
    },
    getSingleProduct: async (req, res) => {
        try {
            const id = req.params.productId
            const productDetails = await productModel.findById(id)
            // console.log(productDetails);
            res.status(200).render('admin/singleProductPage', { productDetails, url: 'product' })
        } catch (error) {
            res.status(500).send('Internal server eroor')
        }
    },

}