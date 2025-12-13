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
    <form onSubmit={handleSubmit}>
      <h2>Add Recipe</h2>

      <label>Title</label>
      <input
        className="input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Ingredients (comma-separated)</label>
      <input
        className="input"
        value={ingredientText}
        onChange={(e) => setIngredientText(e.target.value)}
      />

      <label>Instructions</label>
      <textarea
        className="input"
        rows={4}
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
      />

      <label>Image</label>
      <label className="fileUpload">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          hidden
        />
        <span>Select image</span>
      </label>

      <br />
      <br />

      <button className="btn" type="submit">
        Save Recipe
      </button>
    </form>
  );
}

