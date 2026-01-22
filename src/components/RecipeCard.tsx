import type { Recipe } from "../types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  onDelete: (id: string) => void;
  onEdit: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onDelete, onEdit }: RecipeCardProps) {
  return (
    <div className="card">
      <div className="cardHeader">
        <h3 className="cardTitle">{recipe.title}</h3>
        <div className="cardActions">
          <button
            className="btnSecondary"
            onClick={() => onEdit(recipe)}
            aria-label={`Edit ${recipe.title}`}
          >
            Edit
          </button>
          <button
            className="btnDanger"
            onClick={() => onDelete(recipe.id)}
            aria-label={`Delete ${recipe.title}`}
          >
            Delete
          </button>
        </div>
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
