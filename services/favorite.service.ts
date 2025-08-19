import { prisma } from "@/lib/prisma";
import { Prisma, type Favorite } from "@/generated/prisma";
import { PaginationOptions, PaginatedResponse } from "./types";
import {
  calculatePagination,
  createPaginatedResponse,
} from "./utils/pagination";

export const favoriteService = {
  async createFavorite(data: Prisma.FavoriteCreateInput): Promise<Favorite> {
    return prisma.favorite.create({ data });
  },

  async getFavoriteById(id: string): Promise<Favorite | null> {
    return prisma.favorite.findUnique({ where: { id } });
  },

  async getFavoritesByUserId(
    userId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<Favorite>> {
    const { page, limit, skip } = calculatePagination(options);

    const [data, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: options.sortBy
          ? { [options.sortBy]: options.sortOrder || "desc" }
          : { createdAt: "desc" },
      }),
      prisma.favorite.count({ where: { userId } }),
    ]);

    return createPaginatedResponse(data, total, page, limit);
  },

  async isFavorite(userId: string, recipeId: string): Promise<boolean> {
    const favorite = await prisma.favorite.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
    });
    return !!favorite;
  },

  async toggleFavorite(
    userId: string,
    recipeId: string
  ): Promise<{ action: "added" | "removed"; favorite: Favorite | null }> {
    const existingFavorite = await prisma.favorite.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });
      return { action: "removed", favorite: null };
    } else {
      const newFavorite = await prisma.favorite.create({
        data: { userId, recipeId },
      });
      return { action: "added", favorite: newFavorite };
    }
  },

  async getFavoriteRecipesWithDetails(
    userId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<Favorite & { recipe: any }>> {
    const { page, limit, skip } = calculatePagination(options);

    const [data, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: options.sortBy
          ? { [options.sortBy]: options.sortOrder || "desc" }
          : { createdAt: "desc" },
        include: {
          recipe: {
            include: {
              author: { select: { id: true, name: true, image: true } },
              _count: { select: { ratings: true, comments: true } },
            },
          },
        },
      }),
      prisma.favorite.count({ where: { userId } }),
    ]);

    return createPaginatedResponse(data, total, page, limit);
  },

  async deleteFavorite(id: string): Promise<Favorite | null> {
    try {
      return await prisma.favorite.delete({ where: { id } });
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
};
