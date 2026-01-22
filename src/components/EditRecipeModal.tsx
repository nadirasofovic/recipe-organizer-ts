import { type FormEvent, useState, useEffect } from "react";
import type { Recipe, Ingredient } from "../types/recipe";

function createId() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

interface EditRecipeModalProps {
  recipe: Recipe;
  onSave: (id: string, updates: Partial<Omit<Recipe, "id">>) => void;
  onClose: () => void;
}

export function EditRecipeModal({ recipe, onSave, onClose }: EditRecipeModalProps) {
  const [title, setTitle] = useState(recipe.title);
  const [ingredientText, setIngredientText] = useState(
    recipe.ingredients.map((i) => i.name).join(", ")
  );
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(
    recipe.imageDataUrl
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setTitle(recipe.title);
    setIngredientText(recipe.ingredients.map((i) => i.name).join(", "));
    setInstructions(recipe.instructions);
    setImageDataUrl(recipe.imageDataUrl);
    setErrors({});
  }, [recipe]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    const ingredients = ingredientText
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);

    if (ingredients.length === 0) {
      newErrors.ingredients = "At least one ingredient is required";
    }

    if (!instructions.trim()) {
      newErrors.instructions = "Instructions are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size must be less than 5MB",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setErrors((prev) => ({
        ...prev,
        image: "Failed to read image file",
      }));
    };
    reader.onload = () => {
      // Compress image if it's too large
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 1200;
        const maxHeight = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setImageDataUrl(compressedDataUrl);
        setErrors((prev) => {
          const { image, ...rest } = prev;
          return rest;
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setImageDataUrl(undefined);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const ingredients: Ingredient[] = ingredientText
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({
        id: createId(),
        name,
      }));

    onSave(recipe.id, {
      title: title.trim(),
      ingredients,
      instructions: instructions.trim(),
      imageDataUrl,
    });

    onClose();
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h2>Edit Recipe</h2>
          <button className="btnClose" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Title <span className="required">*</span>
          </label>
          <input
            className={`input ${errors.title ? "inputError" : ""}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <span className="errorMessage" id="title-error">
              {errors.title}
            </span>
          )}

          <label>
            Ingredients (comma-separated) <span className="required">*</span>
          </label>
          <input
            className={`input ${errors.ingredients ? "inputError" : ""}`}
            value={ingredientText}
            onChange={(e) => setIngredientText(e.target.value)}
            aria-invalid={!!errors.ingredients}
            aria-describedby={errors.ingredients ? "ingredients-error" : undefined}
          />
          {errors.ingredients && (
            <span className="errorMessage" id="ingredients-error">
              {errors.ingredients}
            </span>
          )}

          <label>
            Instructions <span className="required">*</span>
          </label>
          <textarea
            className={`input ${errors.instructions ? "inputError" : ""}`}
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            aria-invalid={!!errors.instructions}
            aria-describedby={errors.instructions ? "instructions-error" : undefined}
          />
          {errors.instructions && (
            <span className="errorMessage" id="instructions-error">
              {errors.instructions}
            </span>
          )}

          <label>Image</label>
          {imageDataUrl && (
            <div className="imagePreview">
              <img src={imageDataUrl} alt="Preview" />
              <button
                type="button"
                className="btnDanger"
                onClick={handleRemoveImage}
              >
                Remove Image
              </button>
            </div>
          )}
          <label className="fileUpload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
            <span>{imageDataUrl ? "Change Image" : "Select Image"}</span>
          </label>
          {errors.image && (
            <span className="errorMessage">{errors.image}</span>
          )}

          <div className="modalActions">
            <button type="button" className="btnSecondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn" type="submit">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

