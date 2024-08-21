import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  imageUrl: { type: String, default: "/src/assets/placeholder.png" },
  dietaryPreferences: {
    type: [String], // e.g., ['vegetarian', 'gluten-free']
    default: []
  },
  favoriteRecipes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  mealPlans: [{
    date: {
      type: Date,
      required: true
    },
    recipes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }]
  }],

}, { timestamps: true });

const UserModel = mongoose.model('users', UserSchema);
export default UserModel;
