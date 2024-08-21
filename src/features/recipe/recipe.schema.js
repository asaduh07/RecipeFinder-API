import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description:{type:String},
  ingredients: {
    type: [String],
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  imageUrl: String,
  tags: {
    type: [String],  // E.g., ["vegetarian", "quick", "dinner"]
    index: true,     // Add index for faster searches
  },
  cuisine: {
    type: String,    // E.g., "Italian", "Chinese"
    index: true,     // Add index for faster searches
  },
  dietaryPreferences: {
    type: String,    // E.g., "easy", "medium", "hard"
    index: true,     // Add index for faster searches
  },
  fav: { type: Boolean, default: false },


}, { timestamps: true });

const RecipeModel = mongoose.model('Recipe', RecipeSchema);
export default RecipeModel;
