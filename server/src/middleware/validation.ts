import type { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler.js";
import type { CreateRecipeDto, UpdateRecipeDto } from "../types/recipe.js";

export function validateCreateRecipe(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const data = req.body as CreateRecipeDto;

  if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
    throw new AppError(400, "Title is required");
  }

  if (
    !data.ingredients ||
    !Array.isArray(data.ingredients) ||
    data.ingredients.length === 0
  ) {
    throw new AppError(400, "At least one ingredient is required");
  }

  if (
    !data.instructions ||
    typeof data.instructions !== "string" ||
    !data.instructions.trim()
  ) {
    throw new AppError(400, "Instructions are required");
  }

  next();
}

export function validateUpdateRecipe(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const data = req.body as UpdateRecipeDto;

  if (data.title !== undefined) {
    if (typeof data.title !== "string" || !data.title.trim()) {
      throw new AppError(400, "Title must be a non-empty string");
    }
  }

  if (data.ingredients !== undefined) {
    if (
      !Array.isArray(data.ingredients) ||
      data.ingredients.length === 0
    ) {
      throw new AppError(400, "Ingredients must be a non-empty array");
    }
  }

  if (data.instructions !== undefined) {
    if (typeof data.instructions !== "string" || !data.instructions.trim()) {
      throw new AppError(400, "Instructions must be a non-empty string");
    }
  }

  next();
}

