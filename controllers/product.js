import path from 'path';
import catchAsyncError from '../middlewares/catchAsyncError.js';
const __dirname = path.resolve();
import productModel from '../models/product.js';
import { deleteFile } from '../utils/deleteFile.js';
import ErrorHandler from '../utils/errorHandler.js';

export const addProduct = catchAsyncError(async (req, res) => {
	const {name,slug, description, shortdescription, price, category:productCategory, quantity} = req.body;
    if(req.files.length == 0 || !slug || !name || !description || !shortdescription || !price || !productCategory || !quantity ) return res.status(401).json({
        success: false,
        message: "All fields are required"
    })

    let images = [];

    for (let index = 0; index < req.files.length; index++) {
        let image = `/uploads/${req.files[index].filename}`
        images.push(image);
    }

    
    
    
    await productModel.create({
        slug,
        category: Date.now(),
        description, shortdescription, price, quantity,images,name,productCategory
    })

    res.status(201).json({
        success: true,
        message: "product add successfully"
    });
});

export const editProduct = catchAsyncError(async (req, res,next) => {
	let {name,slug, description, shortdescription, price, category:productCategory, quantity,images:clientImages} = req.body;
    const {id} = req.params;
    const product = await productModel.findById(id);
    
    if(!product){
        return next(new ErrorHandler("invalid product"));
    }
    if(typeof clientImages == 'string'){
        clientImages = [clientImages];
    }

    let images = [...clientImages];
    let deleteImages = []
    for (let index = 0; index < product.images.length; index++) {
        if(!clientImages.includes( product.images[0])){
            deleteImages.push(product.images[0]);
        }
    }

    for (let index = 0; index < deleteImages.length; index++) {
        await deleteFile(`./public/${deleteImages[index]}`);
    }


    
    if(req.files.length != 0){
        console.log("Uploading")
        for (let index = 0; index < req.files.length; index++) {
            let image = `/uploads/${req.files[index].filename}`
            images.push(image);
        }
    }

    
    
    
    await productModel.findByIdAndUpdate(id,{
        name,slug,
        description, shortdescription, price, productCategory, quantity,images
    })



    res.status(201).json({
        success: true,
        message: "product update successfully"
    });
});


export const deleteProduct = catchAsyncError(async (req, res,next) => {
	
    const {id} = req.params;
    const product = await productModel.findById(id);
    
    if(!product){
        return next(new ErrorHandler("invalid product"));
    } 

    for (let index = 0; index < product.images.length; index++) {
        await deleteFile(`./public/${product.images[index]}`);
    }
    
    
    await productModel.findByIdAndDelete(id);

    res.status(201).json({
        success: true,
        message: "product delete successfully"
    });
});


export const getSingleProduct = catchAsyncError(async (req, res,next) => {
	
    const {slug} = req.params;
    const product = await productModel.findOne({slug});
    
    if(!product){
        return next(new ErrorHandler("invalid product"));
    }  

    res.status(201).json({
        success: true,
        product
    });
});


export const getProducts = catchAsyncError(async (req, res,next) => {
	
    const {id} = req.params;
    const products = await productModel.find();

    res.status(201).json({
        success: true,
        products
    });
});