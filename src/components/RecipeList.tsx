import type { Recipe } from "../types/recipe";
import { RecipeCard } from "./RecipeCard";

interface RecipeListProps {
  recipes: Recipe[];
  onDelete: (id: string) => void;
}

export function RecipeList({ recipes, onDelete }: RecipeListProps) {
  if (recipes.length === 0) {
    return <p className="muted">No recipes yet.</p>;
  }

  return (
    <div className="list">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
