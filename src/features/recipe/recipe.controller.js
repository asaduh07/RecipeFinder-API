import RecipeRepository from "./recipe.repository.js";


export default class RecipeController{
    constructor(){
        this.recipeRepository= new RecipeRepository();
    }

    async createRecipes(req, res, next) {
        try {
            // Extract ingredients from request body
            const {ingredients, numberOfRecipes} = req.body;
            
            // Check if ingredients are provided
            if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
                return res.status(400).json({ error: "Ingredients are required and should be a non-empty array." });
            }

            // Call generateRecipe with ingredients
            const recipes = await this.recipeRepository.generateRecipes(ingredients, numberOfRecipes);

            // Send response with generated recipe
            res.status(200).json({success:true,res: recipes});
        } catch (error) {
            next(error);
        }
    }
    async saveRecipes(req,res,next){
        try {
            const {selectedRecipes } = req.body;
            const userId=req.userId;
            if (!selectedRecipes || !Array.isArray(selectedRecipes)) {
                res.status(400).json({ error: 'Invalid recipes list' });
            }

            const result =await this.recipeRepository.postRecipes(userId,selectedRecipes);
            if(result.success){
                res.status(200).json({success:true,res:result.res}) 
            }else{
                res.status(400).json({success:false,res:result.res}) 
            }
        } catch (error) {
            next(error);
        }
    }

    async getUserRecipe(req,res,next){
        try {
            const userId=req.userId;
            const result = await this.recipeRepository.fetchRecipeByUserId(userId);
            if(result.success){
                res.status(200).json({success:true,res:result.res})
            }else{
                res.status(404).json({success:false,res:result.res})
            }
            
        } catch (error) {
            next(error);
        }
    }
    async deleteRecipe(req,res,next){
        try {
            const recipeId= req.params.id;
            const result = await this.recipeRepository.deleteRecipeById(recipeId);
            if(result.success){
                res.status(200).json({success:true,res:result.res})
            }else{
                res.status(404).json({success:false,res:result.res})
            }
            
        } catch (error) {
            next(error);
        }
    }

    async searchRecipes(req, res, next) {
        try {
            const { title } = req.query;
            const userId=req.userId;
            const recipes = await this.recipeRepository.searchRecipes(userId,title);
            res.status(200).json({ success: true, res: recipes.res });
        } catch (error) {
            next(error);
        }
    }

    async getRecipeImages(req, res, next) {
        try {
            const { query } = req.query;  // Extract query from req.query instead of req.body
            const result = await this.recipeRepository.fetchRecipeImages(query);
            if (result) {
                res.json({ success: true, images: result });
            } else {
                res.json({ success: false, images: ["default-image-url.jpg"] });
            }
        } catch (error) {
            next(error);
        }
    }

    async updateFav(req, res, next) {
        try {
            const recipeId = req.params.id;
            const result = await this.recipeRepository.toggleFav(recipeId);
            if (result) {
                res.status(200).json({ success: true, res: result.res });
            } else {
                res.status(400).json({ success: false, res: result.res });
            }

        } catch (error) {
            next(error)

        }
    }
    async getFavourites(req, res, next) {
        try {
            
            const result = await this.recipeRepository.fetchFavRecipes();
            if (result) {
                res.status(200).json({ success: true, res: result.res });
            } else {
                res.status(400).json({ success: false, res: result.res });
            }

        } catch (error) {
            next(error)

        }
    }


}