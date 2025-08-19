import { prisma } from '@/lib/prisma';
import { Prisma, type Ingredient } from '@/generated/prisma';
import { PaginationOptions, PaginatedResponse } from './types';
import { calculatePagination, createPaginatedResponse } from './utils/pagination';

export const ingredientService = {
  async createIngredient(data: Prisma.IngredientCreateInput): Promise<Ingredient> {
    return prisma.ingredient.create({ data });
  },

  async getIngredientById(id: string): Promise<Ingredient | null> {
    return prisma.ingredient.findUnique({ where: { id } });
  },
  
  async getAllIngredients(options: PaginationOptions = {}): Promise<PaginatedResponse<Ingredient>> {
    const { page, limit, skip } = calculatePagination(options);
    
    const [data, total] = await Promise.all([
      prisma.ingredient.findMany({ 
        skip,
        take: limit,
        orderBy: options.sortBy ? { [options.sortBy]: options.sortOrder || 'asc' } : { name: 'asc' }
      }),
      prisma.ingredient.count()
    ]);

    return createPaginatedResponse(data, total, page, limit);
  },

  async searchIngredients(query: string, options: PaginationOptions = {}): Promise<PaginatedResponse<Ingredient>> {
    const { page, limit, skip } = calculatePagination(options);
    
    const whereClause = {
      name: { contains: query, mode: 'insensitive' as const }
    };
    
    const [data, total] = await Promise.all([
      prisma.ingredient.findMany({ 
        where: whereClause,
        skip,
        take: limit,
        orderBy: options.sortBy ? { [options.sortBy]: options.sortOrder || 'asc' } : { name: 'asc' }
      }),
      prisma.ingredient.count({ where: whereClause })
    ]);

    return createPaginatedResponse(data, total, page, limit);
  },

  async getIngredientsByRecipeId(recipeId: string): Promise<Array<Ingredient & { quantity?: number; unit?: string }>> {
    const recipeIngredients = await prisma.recipeIngredient.findMany({
      where: { recipeId },
      include: { ingredient: true }
    });

    return recipeIngredients.map(ri => ({
      ...ri.ingredient,
      quantity: ri.quantity || undefined,
      unit: ri.unit || undefined
    }));
  },

  async getPopularIngredients(options: PaginationOptions = {}): Promise<PaginatedResponse<Ingredient & { usageCount: number }>> {
    const { page, limit, skip } = calculatePagination(options);
    
    const [data, total] = await Promise.all([
      prisma.ingredient.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: { recipes: true }
          }
        },
        orderBy: {
          recipes: { _count: 'desc' }
        }
      }),
      prisma.ingredient.count()
    ]);

    const formattedData = data.map(ingredient => ({
      ...ingredient,
      usageCount: ingredient._count.recipes,
      _count: undefined
    }));

    return createPaginatedResponse(formattedData, total, page, limit);
  },

  async updateIngredient(id: string, data: Prisma.IngredientUpdateInput): Promise<Ingredient | null> {
    try {
      return await prisma.ingredient.update({
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

  async deleteIngredient(id: string): Promise<Ingredient | null> {
    try {
      return await prisma.ingredient.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  },
};
