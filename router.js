import express from 'express';
import passport from 'passport';
const router = express.Router();
import UserModel from './models/user.js';
import {changePassword, loadme, login, logout, register, updateUser,forgotPassword,resetPassword} from './controllers/user.js';
import { isAuthenticate, isCheckRole } from './middlewares/auth.js';
import { sendToken } from './utils/sendToken.js';
import { addCategory, deleteCategory, editCategory, getCategories, getSingleCategory } from './controllers/category.js';
import { uploader } from './middlewares/uploader.js';
import { addProduct, deleteProduct, editProduct, getProducts, getSingleProduct } from './controllers/product.js';

router.get('/',(req,res) => {
    res.send(process.env.PORT);
})

// users routes
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(isAuthenticate,loadme);
router.route('/logout').get(logout);
router.route('/user/update').put(isAuthenticate,updateUser);
router.route('/user/change-password').put(isAuthenticate,changePassword);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').put(resetPassword);




// product 
router.route('/product/add').post(isAuthenticate,isCheckRole('admin'),uploader.array('files'),addProduct);
router.route('/product/update/:id').put(isAuthenticate,isCheckRole('admin'),uploader.array('files'),editProduct);
router.route('/product/delete/:id').delete(isAuthenticate,isCheckRole('admin'), deleteProduct);
router.route('/product/:slug').get(getSingleProduct);
router.route('/products').get(getProducts);


// category 
router.route('/category/add').post(isAuthenticate,isCheckRole('admin'),uploader.array('files'),addCategory);
router.route('/category/update/:id').put(isAuthenticate,isCheckRole('admin'),uploader.array('files'),editCategory);
router.route('/category/delete/:id').delete(isAuthenticate,isCheckRole('admin'), deleteCategory);
router.route('/category/:id').get( getSingleCategory);
router.route('/categories').get(getCategories);


// passport
router.get(
    "/googlelogin",
    passport.authenticate("google", {
      scope: ["profile","email"],
    })
);
router.get(
    "/goole/callback",
    passport.authenticate("google", {
      successRedirect: process.env.FRONTEND_URL,
      failureRedirect: `${process.env.FRONTEND_URL}/sign_in`
    }),
    async (req,res) => {
      res.redirect(process.env.FRONTEND_URL);
    }
);
  


export default router;