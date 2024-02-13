const categoryModel = require('../models/category')
const fs = require('fs')
const path = require('path')
module.exports = {

    getCategoryList: async (req, res) => {
        try {

            const pageNumber = parseInt(req.query.page) || 1;
            const options = {
                page: pageNumber,
                limit: 10
            };
            const result = await categoryModel.paginate({}, options);
            res.render('admin/category', { categoryList: result.docs, paginationInfo: result, url: 'category' });
        } catch (error) {
            console.log('server error');
            res.status(500).send('Internal server error')
        }
    },
    getAddCategory: (req, res) => {
        try {
            res.status(200).render('admin/addCategory', { url: 'category' })
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },
    postAddCategory: async (req, res) => {
        try {
            const { subCategory, categoryName } = req.body;
            const category = JSON.parse(categoryName)
            const subcategory = JSON.parse(subCategory)
            const categoryimage = req.file?.filename
            const lowerCaseName = category.toLowerCase();
            const categoryExist = await categoryModel.findOne({ categoryName:lowerCaseName });
            if (categoryExist) {
                const subCategoryExist = subCategory.find(element => element === categoryExist.subCategory);

                if (subCategoryExist) {
                    return res.status(400).json({ error: 'SubCategory already exists' });
                } else {
                    await categoryModel.updateOne({ categoryName }, { $push: { subCategory: { $each: subCategory } } });
                    res.status(200).json({ message: 'Subcategories added successfully' });
                }
            } else {
                await categoryModel.create({
                    categoryName: category,
                    categoryimage,
                    subCategory: subcategory
                });
                res.status(200).json({ message: 'Category created successfully' });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    deleteCategory: async (req, res) => {
        const categoryId = req.params.categoryId
        const existingCategory = await categoryModel.findOne({ _id: categoryId })
        try {
            const oldImagePath = path.join(__dirname, '../public/uploads/category', existingCategory.categoryimage)
            if (oldImagePath) {
                fs.unlinkSync(oldImagePath)
            }
            const deleted = await categoryModel.deleteOne({ _id: categoryId })
            if (deleted.deletedCount == 0) {
                res.status(400).json({ message: 'category not found' })
            }

            res.status(200).json({ message: 'category deleted successfully' })

        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: 'Internal server error' })
        }
    },
    getUpdateCategory: async (req, res) => {
        try {
            const categoryId = req.params.categoryId
            const category = await categoryModel.find({ _id: categoryId })
            res.status(200).render('admin/updateCategory', { category, url: 'category' })
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },
    postUpdateCategory: async (req, res) => {
        try {
            const categoryId = req.params.categoryId
            const { subCategory, categoryName } = req.body;
            const category = JSON.parse(categoryName)
            const subcategories = JSON.parse(subCategory)
            const categoryimage = req.file?.filename
            if (categoryimage) {
                const existingCategory = await categoryModel.findOne({ _id: categoryId })
                const pathOfImage = path.join(__dirname, '../public/uploads/category', existingCategory.categoryimage)
                fs.unlinkSync(pathOfImage)
            }
            const updatedCategory = await categoryModel.findByIdAndUpdate(categoryId, { $set: { categoryimage, category } })
            updatedCategory.subCategory.push(...subcategories)
            await updatedCategory.save()
            res.status(200).json({ message: 'category added' })
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' })
        }

    },
    subCategoryDelete: async (req, res) => {
        try {
            const categoryId = req.query.catId
            const subCategoryVal = req.query.id
            await categoryModel.updateOne({ _id: categoryId }, { $pull: { subCategory: subCategoryVal } })
            res.status(200).json({message:'the subcategory deleted successfully'})
        } catch (error) {
            res.status(500).json({messaage:'Internal server error'})
        }

    }
}