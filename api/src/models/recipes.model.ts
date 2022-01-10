import mongoose from "mongoose";

export interface RecipeDocument {
  name: string;
  description: string;
  ingredients: any;
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    description: { type: String, required: false },
    ingredients: { type: Array, required: false },
    image: { type: String, required: false }
  },
  {
    timestamps: true,
  }
);

const RecipeModel = mongoose.model<RecipeDocument>("Recipe", recipeSchema);

export default RecipeModel;
