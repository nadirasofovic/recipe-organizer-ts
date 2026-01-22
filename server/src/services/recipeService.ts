import { getDatabase } from "./database.js";
import { createId } from "./database.js";
import type { Recipe, Ingredient, CreateRecipeDto, UpdateRecipeDto } from "../types/recipe.js";

// Get all recipes (optionally filtered by userId)
export async function getAllRecipes(userId?: string): Promise<Recipe[]> {
  const db = getDatabase();
  
  let recipes: any[];
  if (userId) {
    recipes = db
      .prepare("SELECT * FROM recipes WHERE userId = ? ORDER BY createdAt DESC")
      .all(userId) as any[];
  } else {
    recipes = db
      .prepare("SELECT * FROM recipes ORDER BY createdAt DESC")
      .all() as any[];
  }

  // Get ingredients for each recipe
  return recipes.map((recipe) => {
    const ingredients = db
      .prepare("SELECT * FROM ingredients WHERE recipeId = ?")
      .all(recipe.id) as Ingredient[];

    return {
      ...recipe,
      ingredients,
    };
  });
}

// Get recipe by ID
export async function getRecipeById(id: string): Promise<Recipe | null> {
  const db = getDatabase();
  const recipe = db.prepare("SELECT * FROM recipes WHERE id = ?").get(id) as any;

  if (!recipe) {
    return null;
  }

  const ingredients = db
    .prepare("SELECT * FROM ingredients WHERE recipeId = ?")
    .all(id) as Ingredient[];

  return {
    ...recipe,
    ingredients,
  };
}

// Create new recipe
export async function createRecipe(
  data: CreateRecipeDto,
  userId?: string
): Promise<Recipe> {
  const db = getDatabase();
  const now = new Date().toISOString();

  // Normalize ingredients
  let ingredients: Ingredient[];
  if (data.ingredients.length > 0 && typeof data.ingredients[0] === "string") {
    ingredients = (data.ingredients as string[]).map((name) => ({
      id: createId(),
      name: name.trim(),
    }));
  } else {
    ingredients = (data.ingredients as Omit<Ingredient, "id">[]).map((ing) => ({
      id: createId(),
      name: ing.name.trim(),
    }));
  }

  const recipeId = createId();

  // Insert recipe
  db.prepare(
    "INSERT INTO recipes (id, title, instructions, imageDataUrl, createdAt, updatedAt, userId) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(
    recipeId,
    data.title.trim(),
    data.instructions.trim(),
    data.imageDataUrl || null,
    now,
    now,
    userId || null
  );

  // Insert ingredients
  const insertIngredient = db.prepare(
    "INSERT INTO ingredients (id, recipeId, name) VALUES (?, ?, ?)"
  );
  for (const ingredient of ingredients) {
    insertIngredient.run(ingredient.id, recipeId, ingredient.name);
  }

  return {
    id: recipeId,
    title: data.title.trim(),
    ingredients,
    instructions: data.instructions.trim(),
    imageDataUrl: data.imageDataUrl,
    createdAt: now,
    updatedAt: now,
  };
}

// Update recipe
export async function updateRecipe(
  id: string,
  data: UpdateRecipeDto,
  userId?: string
): Promise<Recipe | null> {
  const db = getDatabase();
  const existingRecipe = await getRecipeById(id);

  if (!existingRecipe) {
    return null;
  }

  // Check ownership if userId provided
  if (userId && existingRecipe.userId !== userId) {
    throw new Error("Not authorized to update this recipe");
  }

  // Normalize ingredients if provided
  let ingredients: Ingredient[] = existingRecipe.ingredients;
  if (data.ingredients) {
    if (
      data.ingredients.length > 0 &&
      typeof data.ingredients[0] === "string"
    ) {
      ingredients = (data.ingredients as string[]).map((name) => ({
        id: createId(),
        name: name.trim(),
      }));
    } else {
      ingredients = (data.ingredients as Omit<Ingredient, "id">[]).map(
        (ing) => ({
          id: createId(),
          name: ing.name.trim(),
        })
      );
    }
  }

  // Update recipe
  db.prepare(
    "UPDATE recipes SET title = ?, instructions = ?, imageDataUrl = ?, updatedAt = ? WHERE id = ?"
  ).run(
    data.title?.trim() ?? existingRecipe.title,
    data.instructions?.trim() ?? existingRecipe.instructions,
    data.imageDataUrl ?? existingRecipe.imageDataUrl ?? null,
    new Date().toISOString(),
    id
  );

  // Delete old ingredients and insert new ones
  db.prepare("DELETE FROM ingredients WHERE recipeId = ?").run(id);
  const insertIngredient = db.prepare(
    "INSERT INTO ingredients (id, recipeId, name) VALUES (?, ?, ?)"
  );
  for (const ingredient of ingredients) {
    insertIngredient.run(ingredient.id, id, ingredient.name);
  }

  return await getRecipeById(id);
}

// Delete recipe
export async function deleteRecipe(id: string, userId?: string): Promise<boolean> {
  const db = getDatabase();
  
  if (userId) {
    const recipe = await getRecipeById(id);
    if (!recipe) {
      return false;
    }
    if (recipe.userId !== userId) {
      throw new Error("Not authorized to delete this recipe");
    }
  }

  const result = db.prepare("DELETE FROM recipes WHERE id = ?").run(id);
  return result.changes > 0;
}

// Search recipes
export async function searchRecipes(query: string, userId?: string): Promise<Recipe[]> {
  const recipes = await getAllRecipes(userId);
  const searchLower = query.toLowerCase();

  return recipes.filter((recipe) => {
    return (
      recipe.title.toLowerCase().includes(searchLower) ||
      recipe.ingredients.some((ing) =>
        ing.name.toLowerCase().includes(searchLower)
      ) ||
      recipe.instructions.toLowerCase().includes(searchLower)
    );
  });
}
