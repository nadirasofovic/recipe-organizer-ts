import { FormEvent, useState } from "react";
import type { Ingredient } from "../types/recipe";

interface RecipeFormProps {
  onSubmit: (data: {
    title: string;
    ingredients: Ingredient[];
    instructions: string;
  }) => void;
}

export function RecipeForm({ onSubmit }: RecipeFormProps) {
  const [title, setTitle] = useState("");
  const [ingredientText, setIngredientText] = useState("");
  const [instructions, setInstructions] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const ingredients: Ingredient[] = ingredientText
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({
        id: Math.random().toString(36).slice(2),
        name,
      }));

    onSubmit({
      title: title.trim(),
      ingredients,
      instructions: instructions.trim(),
    });

    setTitle("");
    setIngredientText("");
    setInstructions("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ margin: "1rem 0" }}>
      <h2>Add Recipe</h2>

      <div>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "0.4rem" }}
          />
        </label>
      </div>

      <div>
        <label>
          Ingredients (comma-separated)
          <input
            value={ingredientText}
            onChange={(e) => setIngredientText(e.target.value)}
            style={{ width: "100%", padding: "0.4rem" }}
          />
        </label>
      </div>

      <div>
        <label>
          Instructions
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "0.4rem" }}
          />
        </label>
      </div>

      <button type="submit" style={{ marginTop: "0.5rem" }}>
        Save Recipe
      </button>
    </form>
  );
}
