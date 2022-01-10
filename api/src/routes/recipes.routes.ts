import { Express, Request, Response } from "express";
import { getAllRecipes, addRecipe, getRecipe, updateRecipe, deleteRecipe, searchRecipes } from "../controller/recipes.controller"
import imageUpload from "../services/image.services"

export default function (app: Express) {
  app.get("/api/recipes", getAllRecipes);
  app.post("/api/recipes", imageUpload.single('image'), addRecipe);
  app.get('/api/recipes/search', searchRecipes);
  app.get("/api/recipes/:id", getRecipe);
  app.patch("/api/recipes/:id", imageUpload.single('image'), updateRecipe);
  app.delete("/api/recipes/:id", deleteRecipe);
}
