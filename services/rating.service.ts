import { prisma } from "@/lib/prisma";
import { Prisma, type Rating } from "@/generated/prisma";
import { PaginationOptions, PaginatedResponse } from "./types";
import {
  calculatePagination,
  createPaginatedResponse,
} from "./utils/pagination";

export const ratingService = {
  async createRating(data: Prisma.RatingCreateInput): Promise<Rating> {
    return prisma.rating.create({ data });
  },

  async getRatingById(id: string): Promise<Rating | null> {
    return prisma.rating.findUnique({ where: { id } });
  },

  async getAverageRating(
    recipeId: string
  ): Promise<{ averageRating: number; totalRatings: number }> {
    const result = await prisma.rating.aggregate({
      where: { recipeId },
      _avg: { score: true },
      _count: { score: true },
    });

    return {
      averageRating: result._avg.score || 0,
      totalRatings: result._count.score || 0,
    };
  },

  async getRatingsByUserId(
    userId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<Rating>> {
    const { page, limit, skip } = calculatePagination(options);

    const [data, total] = await Promise.all([
      prisma.rating.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: options.sortBy
          ? { [options.sortBy]: options.sortOrder || "desc" }
          : { createdAt: "desc" },
        include: {
          recipe: { select: { id: true, title: true, imageUrl: true } },
        },
      }),
      prisma.rating.count({ where: { userId } }),
    ]);

    return createPaginatedResponse(data, total, page, limit);
  },

  async getUserRatingForRecipe(
    userId: string,
    recipeId: string
  ): Promise<Rating | null> {
    return prisma.rating.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
    });
  },

  async updateRating(
    id: string,
    data: Prisma.RatingUpdateInput
  ): Promise<Rating | null> {
    try {
      return await prisma.rating.update({
        where: { id },
        data,
      });
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

  async deleteRating(id: string): Promise<Rating | null> {
    try {
      return await prisma.rating.delete({ where: { id } });
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
