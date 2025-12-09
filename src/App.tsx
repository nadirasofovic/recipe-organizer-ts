import { useState } from "react";
import { useRecipes } from "./hooks/useRecipes";

function App() {
  const { recipes, addRecipe, updateRecipe, deleteRecipe } = useRecipes();
  const [search, setSearch] = useState("");

  const filtered = recipes.filter((recipe) =>
    recipe.ingredients.some((ing) =>
      ing.name.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem" }}>
      <h1>Recipe Organizer 🍲</h1>
      <p>Total recipes: {filtered.length}</p>
      {/* Ovdje ćemo kasnije ubaciti SearchBar, RecipeForm i RecipeList */}
    </div>
  );
}

export default App;

