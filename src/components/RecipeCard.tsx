import type { Recipe } from "../types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  onDelete: (id: string) => void;
}

export function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">{recipe.title}</h3>
        <button className="btnDanger" onClick={() => onDelete(recipe.id)}>
          Delete
        </button>
      </div>

      {recipe.imageDataUrl && (
        <img
          className="cardImage"
          src={recipe.imageDataUrl}
          alt={recipe.title}
        />
      )}

      <p className="muted">
        <strong>Ingredients:</strong>{" "}
        {recipe.ingredients.map((i) => i.name).join(", ")}
      </p>

      <p className="muted">
        <strong>Instructions:</strong> {recipe.instructions}
      </p>
    </div>
  );
}
