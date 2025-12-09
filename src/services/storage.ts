import type { Recipe } from "../types/recipe";

const STORAGE_KEY = "recipe-organizer-recipes";

export function loadRecipes(): Recipe[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Recipe[];
  } catch {
    return [];
  }
}

export function saveRecipes(recipes: Recipe[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}
