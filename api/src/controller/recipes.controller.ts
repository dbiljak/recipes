import { Request, Response } from "express";
import RecipeModel from "../models/recipes.model";

export async function getAllRecipes(req: Request, res: Response) {
  const page = parseInt(req.query.page as string);
  const limit = 5;
  const skipIndex = (page - 1) * limit;
  let order = 1;

  if (req.query.order) {
    order = parseInt(req.query.order as string);
  }

  try {
    const recipes = await RecipeModel.find().sort({ name: order })
      .limit(limit)
      .skip(skipIndex)
      .exec();

    res.statusCode = 200;
    res.json(recipes);
  } catch (err) {
    res.statusCode = 404;
    res.json({'error':err});
  }
}

export async function addRecipe(req: Request, res: Response) {
  try {
    const body = req.body;
    const file = req.file;

    let imageName = "";
    let ingredients = [];

    if (file) {
      imageName = file.filename
    }

    if (body.ingredients) {
      console.log("first", body.ingredients);
      const raw = body.ingredients.split(",");

      ingredients = raw.map((element: string) => {
        return element.trim();
      });

      console.log("second", ingredients);
    }

    const recipe = new RecipeModel({
      name: body.name,
      description: body.description,
      ingredients: ingredients,
      image: imageName
    });

    const response = await recipe.save();
  
    res.statusCode = 201;
    res.json(response);
  } catch (err) {
    res.statusCode = 400;
    res.json({'error':err});
  }
}

export async function getRecipe(req: Request, res: Response) {
  try {
    const recipe = await RecipeModel.findById(req.params.id);
  
    res.statusCode = 200;
    res.json(recipe);
  } catch (e) {
    res.statusCode = 400;
    res.json({'error':e});
  }
}

export async function updateRecipe(req: Request, res: Response) {
  const file = req.file;
  let ingredients = [];
  let imageName = "";

  if (file) {
    req.body.image = file.filename
  }

  if (req.body.ingredients) {
    const raw = req.body.ingredients.split(",");

    ingredients = raw.map((element: string) => {
      return element.trim();
    });

    req.body.ingredients = ingredients;
  }

  RecipeModel.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true}, function (err: any, recipe: any) {
    if (err) {
      res.statusCode = 400;
      res.json(err)
    } else if(!recipe) {
      res.statusCode = 404;
      res.json({"eror":  `No recipe with id:${req.params.id}`})
    } else {
      res.statusCode = 200;
      res.json(recipe);
    }
  });
}

export async function deleteRecipe(req: Request, res: Response) {
  RecipeModel.findByIdAndDelete(req.params.id, function (err: any, recipe: any) {
    if (err) {
      res.statusCode = 400;
      res.json(err)
    } else if(!recipe) {
      res.statusCode = 404;
      res.json({"eror":  `No recipe with id:${req.params.id}`})
    } else {
      res.statusCode = 200;
      res.json({"deleted": req.params.id});
    }
  });
}

export async function searchRecipes(req: Request, res: Response) {
  const page = parseInt(req.query.page as string);
  const limit = 5;
  const skipIndex = (page - 1) * limit;

  if(!req.query.s) {
    res.json({"error": "invalid search key"});
  } else {
    try {
      const recipes = await RecipeModel.find({
        $or:[
          {['name']: { "$regex": req.query.s, "$options": "i" } },
          {['ingredients']:  { "$regex": req.query.s, "$options": "i" } }
        ]
      })
        .limit(limit)
        .skip(skipIndex)
        .exec();
  
      res.statusCode = 200;
      res.json(recipes);
    } catch (err) {
      res.statusCode = 404;
      res.json({'error':err});
    }
  }
}
