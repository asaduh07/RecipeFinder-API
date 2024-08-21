import express from 'express';
import RecipeController from './recipe.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';
const recipeRouter= express.Router();
const recipeController= new RecipeController();
recipeRouter.route('/generate').post(jwtAuth,(req,res,next)=>{
    recipeController.createRecipes(req,res,next);
})
recipeRouter.route('/save').post(jwtAuth,(req,res,next)=>{
    recipeController.saveRecipes(req,res,next);
})
recipeRouter.route('/').get(jwtAuth,(req,res,next)=>{
    recipeController.getUserRecipe(req,res,next);
})
recipeRouter.route('/:id').delete(jwtAuth,(req,res,next)=>{
    recipeController.deleteRecipe(req,res,next);
})
recipeRouter.route('/toggleFav/:id').put(jwtAuth,(req,res,next)=>{
    recipeController.updateFav(req,res,next);
})

recipeRouter.route('/search').get(jwtAuth,(req,res,next)=>{
    recipeController.searchRecipes(req,res,next);
})
recipeRouter.route('/images').get(jwtAuth,(req,res,next)=>{
    recipeController.getRecipeImages(req,res,next);
})
recipeRouter.route('/favourites').get(jwtAuth,(req,res,next)=>{
    recipeController.getFavourites(req,res,next);
})

export default recipeRouter;