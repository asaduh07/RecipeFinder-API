import ApplicationError from "../../errorhandler/applicationError.js";
import RecipeModel from "./recipe.schema.js";
import { GoogleGenerativeAI } from '@google/generative-ai';
import UserModel from "../user/user.schema.js";
import mongoose from "mongoose";
import axios from 'axios';
export default class RecipeRepository {

    async generateRecipes(ingredients, numberOfRecipes = 3) {
        // Validate ingredients
        if (!Array.isArray(ingredients)) {
            throw new TypeError("Ingredients should be an array");
        }

        // Initialize the Google Generative AI client with API Key
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);

        // Construct the prompt based on ingredients
        const prompt = `Generate ${numberOfRecipes} different recipes using the following ingredients: ${ingredients.join(', ')}. Include the title, cooking time (in minutes), description, and detailed instructions for each step.`;

        // Get the generative model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        try {
            // Generate content using the prompt
            const result = await model.generateContent(prompt);
            const generatedText = result.response.text();
            

            // Ensure the generated text is a string
            if (typeof generatedText !== 'string') {
                throw new TypeError("Expected generatedText to be a string");
            }

            // Split the generated text into individual recipes
            const recipeStrings = generatedText.split(/##/).filter(str => str.trim() !== "");

            const recipes = recipeStrings.map(recipeString => {
                const titleMatch = recipeString.match(/^\s*(.+)\n/);
                const title = titleMatch ? titleMatch[1].trim() : "Generated Recipe Title";

                const descriptionMatch = recipeString.match(/\*\*Description:\*\*\s*(.+?)\*\*/);
                const description = descriptionMatch ? descriptionMatch[1].trim() : "Description not provided.";

                const ingredientsMatch = recipeString.match(/\*\*Ingredients:\*\*([\s\S]+?)\*\*Instructions:\*\*/);
                const ingredientsList = ingredientsMatch ? ingredientsMatch[1].trim().split('\n').map(item => item.replace(/^\*\s*/, '').trim()) : ingredients;

                const instructionsStart = recipeString.indexOf("**Instructions:**");
                const instructionsText = instructionsStart > -1
                    ? recipeString.substring(instructionsStart + "**Instructions:**".length).trim()
                    : "Instructions not found in generated text.";

                return {
                    title,
                    description,
                    ingredients: ingredientsList,
                    instructions: instructionsText,


                };
            });

            return recipes;
        } catch (error) {
            console.error('Error generating recipes:', error);
            throw new ApplicationError('Failed to generate recipes, try again later', 500);
        }
    }



    async postRecipes(userId, selectedRecipes) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new ApplicationError('User not found', 404);
            }

            const savedRecipes = [];
            for (const recipeData of selectedRecipes) {
                let title = recipeData.title;
                // Split the title by period and take the second part if available
                if (title.includes('.')) {
                    const splitTitle = title.split('.');
                    // Ensure there's a second part and it isn't empty
                    if (splitTitle.length > 1 && splitTitle[1].trim() !== '') {
                        title = splitTitle.slice(1).join('.').trim(); // Join any remaining parts if the title contains additional periods
                    }
                }

                // Update recipeData with the cleaned title
                recipeData.title = title;


                const newRecipe = new RecipeModel({
                    user: new mongoose.Types.ObjectId(userId),
                    ...recipeData,
                });

                const savedRecipe = await newRecipe.save();
                savedRecipes.push(savedRecipe);

                user.mealPlans.push({
                    date: new Date(),
                    recipes: [savedRecipe._id],
                });
            }

            await user.save();
            return { success: true, res: savedRecipes };
        } catch (error) {
            console.error('Error saving recipes:', error);
            throw new ApplicationError('Failed to save recipes, try again later', 500);
        }
    }



    async fetchRecipeByUserId(userId) {
        try {
            const recipes = await RecipeModel.find({ user: new mongoose.Types.ObjectId(userId) });
            if (recipes.length) {
                return { success: true, res: recipes }
            } else {
                return { success: false, res: "No recipe found" }
            }

        } catch (error) {
            throw new ApplicationError('Something went wrong, please try again later', 500);
        }
    }

    async deleteRecipeById(recipeId) {
        try {
            const recipe = await RecipeModel.findByIdAndDelete(recipeId);
            if (recipe) {
                return { success: true, res: "Recipe deleted successfully" }
            } else {
                return { success: false, res: "Recipe Not found" }
            }

        } catch (error) {
            throw new ApplicationError('Something went wrong, please try again later', 500);
        }
    }

    async searchRecipes(userId, title) {
        try {
            const searchCriteria = {
                user: userId // Filter by the user's ID
            };


            if (title) {
                searchCriteria.title = { $regex: title, $options: 'i' };  // case-insensitive regex search
            }
            const recipes = await RecipeModel.find(searchCriteria);
            return { success: true, res: recipes };
        } catch (error) {
            console.error('Error searching recipes:', error);
            throw new ApplicationError('Failed to search recipes, try again later', 500);
        }
    }

    async fetchRecipeImages(query) {
        const apiKey = process.env.GOOGLE_API_KEY;
        const cx = process.env.GOOGLE_CSE_ID;

        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&searchType=image&q=${query}`;

        try {
            const response = await axios.get(url);
            const images = response.data.items.map(item => item.link); // Extract image URLs
            return images;
        } catch (error) {
            console.error('Error fetching images:', error);
            throw new Error('Failed to fetch images, please try again later.');
        }
    }

    async toggleFav(recipeId) {
        try {
            const recipeExist = await RecipeModel.findById(recipeId);
            if (recipeExist) {
                recipeExist.fav = !recipeExist.fav;
                const savedRecipe = await recipeExist.save();
                return { success: true, res: savedRecipe };
            }
            else {
                return { success: false, res: "Recipe not found" }
            }

        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong, please try later', 500);
        }
    }
    async fetchFavRecipes() {
        try {
            const favRecipes = await RecipeModel.find({
                fav: true
            });
            if (favRecipes.length) {

                return { success: true, res: favRecipes };
            }
            else {
                return { success: false, res: "No favourite recipes" }
            }

        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong, please try later', 500);
        }
    }


}