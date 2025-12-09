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
}
