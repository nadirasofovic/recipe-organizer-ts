export interface Ingredient {
  id: string;
  name: string;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: Ingredient[];
  instructions: string;
  imageDataUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface CreateRecipeDto {
  title: string;
  ingredients: Omit<Ingredient, "id">[] | string[]; // Can accept array of strings or objects
  instructions: string;
  imageDataUrl?: string;
}

export interface UpdateRecipeDto extends Partial<CreateRecipeDto> {}

