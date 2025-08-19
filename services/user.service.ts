import { prisma } from '@/lib/prisma';
import { Prisma, type User } from '@/generated/prisma';
import { PaginationOptions, PaginatedResponse, PublicUser } from './types';
import { calculatePagination, createPaginatedResponse } from './utils/pagination';

export const userService = {
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  },

  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  async searchUsers(query: string, options: PaginationOptions = {}): Promise<PaginatedResponse<PublicUser>> {
    const { page, limit, skip } = calculatePagination(options);
    
    const whereClause = {
      OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { email: { contains: query, mode: 'insensitive' as const } },
      ]
    };
    
    const [data, total] = await Promise.all([
      prisma.user.findMany({ 
        where: whereClause,
        skip,
        take: limit,
        orderBy: options.sortBy ? { [options.sortBy]: options.sortOrder || 'asc' } : { name: 'asc' },
        select: { id: true, name: true, email: true, image: true, createdAt: true }
      }),
      prisma.user.count({ where: whereClause })
    ]);

    return createPaginatedResponse(data, total, page, limit);
  },

  async getUserStats(userId: string): Promise<{
    recipesCount: number;
    favoritesCount: number;
    ratingsCount: number;
    commentsCount: number;
    averageRatingReceived: number;
  }> {
    const [
      recipesCount,
      favoritesCount,
      ratingsCount,
      commentsCount,
      ratingsReceived
    ] = await Promise.all([
      prisma.recipe.count({ where: { authorId: userId } }),
      prisma.favorite.count({ where: { userId } }),
      prisma.rating.count({ where: { userId } }),
      prisma.comment.count({ where: { userId } }),
      prisma.rating.aggregate({
        where: { recipe: { authorId: userId } },
        _avg: { score: true }
      })
    ]);

    return {
      recipesCount,
      favoritesCount,
      ratingsCount,
      commentsCount,
      averageRatingReceived: ratingsReceived._avg.score || 0,
    };
  },

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User | null> {
    try {
      return await prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  },

  async deleteUser(id: string): Promise<User | null> {
    try {
      return await prisma.user.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  },
};
