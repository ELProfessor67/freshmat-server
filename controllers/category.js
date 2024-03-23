import path from 'path';
import catchAsyncError from '../middlewares/catchAsyncError.js';
const __dirname = path.resolve();
import CategoryModel from '../models/categories.js';
import categoryModel from '../models/categories.js';
import { deleteFile } from '../utils/deleteFile.js';
import { nextTick } from 'process';
import ErrorHandler from '../utils/errorHandler.js';

export const addCategory = catchAsyncError(async (req, res) => {
	const {name} = req.body;

    if(req.files.length == 0 || !name) return res.status(401).json({
        success: false,
        message: "All fields are required"
    })

    let image = `/uploads/${req.files[0].filename}`
    
    
    await categoryModel.create({
        name,
        image
    })

    res.status(201).json({
        success: true,
        message: "category add successfully"
    });
});

export const editCategory = catchAsyncError(async (req, res,next) => {
	const {name} = req.body;
    const {id} = req.params;
    const category = await CategoryModel.findById(id);
    
    if(!category){
        return next(new ErrorHandler("invalid category"));
    }

    let image = category.image;

    if(req.files.length != 0){
        await deleteFile(`./public/${category.image}`);
        image = `/uploads/${req.files[0].filename}`
    }

    
    
    
    await categoryModel.findByIdAndUpdate(id,{
        name,
        image
    })

    res.status(201).json({
        success: true,
        message: "category update successfully"
    });
});


export const deleteCategory = catchAsyncError(async (req, res,next) => {
	
    const {id} = req.params;
    const category = await CategoryModel.findById(id);
    
    if(!category){
        return next(new ErrorHandler("invalid category"));
    }  

    await deleteFile(`./public/${category.image}`);
    
    await categoryModel.findByIdAndDelete(id)

    res.status(201).json({
        success: true,
        message: "category delete successfully"
    });
});


export const getSingleCategory = catchAsyncError(async (req, res,next) => {
	
    const {id} = req.params;
    const category = await CategoryModel.findById(id);
    
    if(!category){
        return next(new ErrorHandler("invalid category"));
    }  

    res.status(201).json({
        success: true,
        category
    });
});


export const getCategories = catchAsyncError(async (req, res,next) => {
	
    const {id} = req.params;
    const categories = await CategoryModel.find();

    res.status(201).json({
        success: true,
        categories
    });
});