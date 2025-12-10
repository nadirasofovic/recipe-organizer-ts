import { type FormEvent, useState } from "react";
import type { Ingredient } from "../types/recipe";

interface RecipeFormProps {
  onSubmit: (data: {
    title: string;
    ingredients: Ingredient[];
    instructions: string;
    imageDataUrl?: string;
  }) => void;
}

export function RecipeForm({ onSubmit }: RecipeFormProps) {
  const [title, setTitle] = useState("");
  const [ingredientText, setIngredientText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

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
      imageDataUrl,
    });

    setTitle("");
    setIngredientText("");
    setInstructions("");
    setImageDataUrl(undefined);
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

      <div>
        <label>
          Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
      </div>

      <button type="submit" style={{ marginTop: "0.5rem" }}>
        Save Recipe
      </button>
    </form>
  );
}
