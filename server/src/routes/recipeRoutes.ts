import { Router } from "express";
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
} from "../services/recipeService.js";
import { validateCreateRecipe, validateUpdateRecipe } from "../middleware/validation.js";
import { AppError } from "../middleware/errorHandler.js";

const router = Router();

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Get all recipes
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of recipes
 */
// GET /api/recipes - Get all recipes (with optional search query)
// Authentication is optional - if authenticated, returns user's recipes, otherwise all recipes
router.get("/", async (req, res, next) => {
  try {
    const { search } = req.query;
    const userId = req.userId; // Will be set if authenticated

    if (search && typeof search === "string") {
      const recipes = await searchRecipes(search, userId);
      res.json({
        status: "success",
        data: recipes,
        count: recipes.length,
      });
    } else {
      const recipes = await getAllRecipes(userId);
      res.json({
        status: "success",
        data: recipes,
        count: recipes.length,
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe found
 *       404:
 *         description: Recipe not found
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await getRecipeById(id);

    if (!recipe) {
      throw new AppError(404, `Recipe with ID ${id} not found`);
    }

    res.json({
      status: "success",
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Create new recipe
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - ingredients
 *               - instructions
 *             properties:
 *               title:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               instructions:
 *                 type: string
 *               imageDataUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Recipe created
 */
router.post("/", validateCreateRecipe, async (req, res, next) => {
  try {
    const recipe = await createRecipe(req.body, req.userId);
    res.status(201).json({
      status: "success",
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     summary: Update recipe
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               ingredients:
 *                 type: array
 *               instructions:
 *                 type: string
 *     responses:
 *       200:
 *         description: Recipe updated
 *       404:
 *         description: Recipe not found
 */
router.put("/:id", validateUpdateRecipe, async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await updateRecipe(id, req.body, req.userId);

    if (!recipe) {
      throw new AppError(404, `Recipe with ID ${id} not found`);
    }

    res.json({
      status: "success",
      data: recipe,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("authorized")) {
      next(new AppError(403, error.message));
    } else {
      next(error);
    }
  }
});

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: Delete recipe
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe deleted
 *       404:
 *         description: Recipe not found
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await deleteRecipe(id, req.userId);

    if (!deleted) {
      throw new AppError(404, `Recipe with ID ${id} not found`);
    }

    res.json({
      status: "success",
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("authorized")) {
      next(new AppError(403, error.message));
    } else {
      next(error);
    }
  }
});

export default router;

