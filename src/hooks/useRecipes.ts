import { useEffect, useState } from "react";
import type { Recipe } from "../types/recipe";
import { recipesApi } from "../services/api";

export function useRecipes(searchQuery?: string) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecipes();
  }, [searchQuery]);

  async function loadRecipes() {
    try {
      setLoading(true);
      setError(null);
      const data = await recipesApi.getAll(searchQuery);
      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load recipes");
      console.error("Error loading recipes:", err);
    } finally {
      setLoading(false);
    }
  }

  async function addRecipe(data: Omit<Recipe, "id" | "createdAt" | "updatedAt">) {
    try {
      setError(null);
      const newRecipe = await recipesApi.create({
        title: data.title,
        ingredients: data.ingredients,
        instructions: data.instructions,
        imageDataUrl: data.imageDataUrl,
      });
      setRecipes((prev) => [...prev, newRecipe]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create recipe");
      throw err;
    }
  }

  async function updateRecipe(id: string, updates: Partial<Omit<Recipe, "id">>) {
    try {
      setError(null);
      const updatedRecipe = await recipesApi.update(id, updates);
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? updatedRecipe : r))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update recipe");
      throw err;
    }
  }

  async function deleteRecipe(id: string) {
    try {
      setError(null);
      await recipesApi.delete(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete recipe");
      throw err;
    }
  }

  return { recipes, addRecipe, updateRecipe, deleteRecipe, loading, error, refresh: loadRecipes };
}
