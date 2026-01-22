import { useState, useMemo, useEffect } from "react";
import { useRecipes } from "./hooks/useRecipes";
import { SearchBar } from "./components/SearchBar";
import { RecipeForm } from "./components/RecipeForm";
import { RecipeList } from "./components/RecipeList";
import { EditRecipeModal } from "./components/EditRecipeModal";
import { ErrorBoundary } from "./components/ErrorBoundary";
import type { Recipe } from "./types/recipe";

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc" | "ingredients-asc" | "ingredients-desc";

function App() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  
  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const { recipes, addRecipe, updateRecipe, deleteRecipe, loading, error } = useRecipes(debouncedSearch || undefined);

  const filteredAndSorted = useMemo(() => {
    // If search is provided, backend handles filtering, so just sort
    // Otherwise filter locally
    let filtered = recipes;
    if (search) {
      // Backend already filtered, just use recipes as-is
      filtered = recipes;
    } else {
      filtered = recipes;
    }

    // Then sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "ingredients-asc":
          return a.ingredients.length - b.ingredients.length;
        case "ingredients-desc":
          return b.ingredients.length - a.ingredients.length;
        default:
          return 0;
      }
    });

    return sorted;
  }, [recipes, search, sortBy]);

  return (
    <ErrorBoundary>
      <div className="container">
        <div className="titleRow">
          <h1>Recipe Organizer</h1>
        </div>

        <div className="panel">
          <SearchBar value={search} onChange={setSearch} />

          <div className="sortControls">
            <label>
              Sort by:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort recipes"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="ingredients-asc">Fewest Ingredients</option>
                <option value="ingredients-desc">Most Ingredients</option>
              </select>
            </label>
          </div>

          <RecipeForm onSubmit={(data) => addRecipe({ ...data })} />

          <div className="metaRow">
            <p className="muted">Total recipes: {filteredAndSorted.length}</p>
            {loading && <p className="muted">Loading...</p>}
            {error && <p style={{ color: "#ef4444" }}>Error: {error}</p>}
          </div>
        </div>

        {loading && recipes.length === 0 ? (
          <p className="muted">Loading recipes...</p>
        ) : (
          <RecipeList
            recipes={filteredAndSorted}
            onDelete={deleteRecipe}
            onEdit={setEditingRecipe}
          />
        )}

        {editingRecipe && (
          <EditRecipeModal
            recipe={editingRecipe}
            onSave={updateRecipe}
            onClose={() => setEditingRecipe(null)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;

