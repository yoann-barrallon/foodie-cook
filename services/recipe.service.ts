import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { PaginationOptions, PaginatedResponse } from "./types";
import { Recipe } from "@/types";
import {
  calculatePagination,
  createPaginatedResponse,
} from "./utils/pagination";

async function enrichRecipeWithAverage(recipe: any): Promise<Recipe> {
  const ratingResult = await prisma.rating.aggregate({
    where: { recipeId: recipe.id },
    _avg: { score: true },
  });

  return {
    ...recipe,
    averageRating: ratingResult._avg.score || 0,
  };
}

async function enrichRecipesWithAverage(recipes: any[]): Promise<Recipe[]> {
  if (recipes.length === 0) return [];

  const recipeIds = recipes.map((r) => r.id);
  const averages = await prisma.rating.groupBy({
    by: ["recipeId"],
    where: {
      recipeId: {
        in: recipeIds,
      },
    },
    _avg: {
      score: true,
    },
  });

  const averageMap = new Map();
  averages.forEach((avg) => {
    averageMap.set(avg.recipeId, avg._avg.score || 0);
  });

  return recipes.map((recipe) => ({
    ...recipe,
    averageRating: averageMap.get(recipe.id) || 0,
  }));
}

export const recipeService = {
  async createRecipe(data: Prisma.RecipeCreateInput): Promise<Recipe> {
    const recipe = await prisma.recipe.create({
      data,
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { comments: true, favorites: true, ratings: true } },
      },
    });
    return enrichRecipeWithAverage(recipe);
  },

  async getRecipeById(id: string): Promise<Recipe | null> {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { comments: true, favorites: true, ratings: true } },
      },
    });
    if (!recipe) return null;
    return enrichRecipeWithAverage(recipe);
  },

  async getAllRecipes(
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<Recipe>> {
    const { page, limit, skip } = calculatePagination(options);

    const [data, total] = await Promise.all([
      prisma.recipe.findMany({
        skip,
        take: limit,
        orderBy: options.sortBy
          ? { [options.sortBy]: options.sortOrder || "desc" }
          : { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: {
            select: { comments: true, favorites: true, ratings: true },
          },
        },
      }),
      prisma.recipe.count(),
    ]);
    const enrichedData = await enrichRecipesWithAverage(data);
    return createPaginatedResponse(enrichedData, total, page, limit);
  },

  async getRecipesByUserId(
    userId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<Recipe>> {
    const { page, limit, skip } = calculatePagination(options);

    const [data, total] = await Promise.all([
      prisma.recipe.findMany({
        where: { authorId: userId },
        skip,
        take: limit,
        orderBy: options.sortBy
          ? { [options.sortBy]: options.sortOrder || "desc" }
          : { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: {
            select: { comments: true, favorites: true, ratings: true },
          },
        },
      }),
      prisma.recipe.count({ where: { authorId: userId } }),
    ]);

    const enrichedData = await enrichRecipesWithAverage(data);
    return createPaginatedResponse(enrichedData, total, page, limit);
  },

  async searchRecipes(
    query: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<Recipe>> {
    const { page, limit, skip } = calculatePagination(options);

    const whereClause = {
      OR: [
        { title: { contains: query, mode: "insensitive" as const } },
        { description: { contains: query, mode: "insensitive" as const } },
      ],
    };

    const [data, total] = await Promise.all([
      prisma.recipe.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          _count: {
            select: { comments: true, favorites: true, ratings: true },
          },
        },
        orderBy: options.sortBy
          ? { [options.sortBy]: options.sortOrder || "desc" }
          : { createdAt: "desc" },
      }),
      prisma.recipe.count({ where: whereClause }),
    ]);

    const enrichedData = await enrichRecipesWithAverage(data);
    return createPaginatedResponse(enrichedData, total, page, limit);
  },

  async getPopularRecipes(
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<Recipe>> {
    const { page, limit, skip } = calculatePagination(options);

    const [data, total] = await Promise.all([
      prisma.recipe.findMany({
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          _count: {
            select: { comments: true, favorites: true, ratings: true },
          },
        },
        orderBy: {
          ratings: { _count: "desc" },
        },
      }),
      prisma.recipe.count(),
    ]);

    const enrichedData = await enrichRecipesWithAverage(data);
    return createPaginatedResponse(enrichedData, total, page, limit);
  },

  async getRecentRecipes(
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<Recipe>> {
    const { page, limit, skip } = calculatePagination(options);

    const [data, total] = await Promise.all([
      prisma.recipe.findMany({
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          _count: {
            select: { comments: true, favorites: true, ratings: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.recipe.count(),
    ]);

    const enrichedData = await enrichRecipesWithAverage(data);
    return createPaginatedResponse(enrichedData, total, page, limit);
  },

  async updateRecipe(
    id: string,
    data: Prisma.RecipeUpdateInput
  ): Promise<Recipe | null> {
    try {
      const recipe = await prisma.recipe.update({
        where: { id },
        data,
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: {
            select: { comments: true, favorites: true, ratings: true },
          },
        },
      });
      return enrichRecipeWithAverage(recipe);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      }
      throw error;
    }
  },

  async deleteRecipe(id: string): Promise<Recipe | null> {
    try {
      const recipe = await prisma.recipe.delete({
        where: { id },
        include: {
          author: { select: { id: true, name: true, image: true } },
          _count: {
            select: { comments: true, favorites: true, ratings: true },
          },
        },
      });
      return enrichRecipeWithAverage(recipe);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      }
      throw error;
    }
  },

  async hasFavorited(recipeId: string, userId: string): Promise<boolean> {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });
    return !!favorite;
  },
};
