import { useState } from "react";
import { useRecipes } from "./hooks/useRecipes";
import { SearchBar } from "./components/SearchBar";
import { RecipeForm } from "./components/RecipeForm";
import { RecipeList } from "./components/RecipeList";

function App() {
  const { recipes, addRecipe, deleteRecipe } = useRecipes();
  const [search, setSearch] = useState("");

  const filtered = recipes.filter((recipe) =>
    recipe.ingredients.some((ing) =>
      ing.name.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="container">
      <div className="titleRow">
        <h1>Recipe Organizer</h1>
      </div>

      <div className="panel">
        <SearchBar value={search} onChange={setSearch} />

        <RecipeForm onSubmit={(data) => addRecipe({ ...data })} />

        <div className="metaRow">
          <p className="muted">Total recipes: {filtered.length}</p>
        </div>
      </div>

      <RecipeList recipes={filtered} onDelete={deleteRecipe} />
    </div>
  );
}

export default App;

