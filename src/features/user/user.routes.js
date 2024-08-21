import express from 'express';
import UserController from './user.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';
import { upload } from '../../middlewares/fileUpload.middleware.js';
const userController= new UserController();
const userRouter=express.Router();

userRouter.route('/signup').post((req,res,next)=>{
    userController.signUp(req,res,next);

});
userRouter.route('/signin').post((req,res,next)=>{
    userController.signIn(req,res,next);

});
userRouter.route('/').put(jwtAuth,upload.single('imageUrl'),(req,res,next)=>{
    userController.uploadProfileImage(req,res,next);

});
userRouter.route('/me').get(jwtAuth,(req,res,next)=>{
    userController.fetchUserById(req,res,next);

});

export default userRouter;