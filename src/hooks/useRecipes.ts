import { useEffect, useState } from "react";
import type { Recipe } from "../types/recipe";
import { loadRecipes, saveRecipes } from "../services/storage";

function createId() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    setRecipes(loadRecipes());
  }, []);

  useEffect(() => {
    saveRecipes(recipes);
  }, [recipes]);

  function addRecipe(data: Omit<Recipe, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    const newRecipe: Recipe = {
      id: createId(),
      createdAt: now,
      updatedAt: now,
      ...data,
    };
    setRecipes((prev) => [...prev, newRecipe]);
  }

  function updateRecipe(id: string, updates: Partial<Omit<Recipe, "id">>) {
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, ...updates, updatedAt: new Date().toISOString() }
          : r
      )
    );
  }

  function deleteRecipe(id: string) {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  }

  return { recipes, addRecipe, updateRecipe, deleteRecipe };
}
