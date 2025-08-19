import { prisma } from "@/lib/prisma";
import { Comment } from "@/types";
import { PaginationOptions, PaginatedResponse } from "./types";
import {
  calculatePagination,
  createPaginatedResponse,
} from "./utils/pagination";
import { Prisma } from "@/generated/prisma";

export const commentService = {
  async createComment(data: Prisma.CommentCreateInput): Promise<Comment> {
    return prisma.comment.create({
      data,
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });
  },

  async getCommentById(id: string): Promise<Comment | null> {
    return prisma.comment.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });
  },

  async getCommentsByRecipeId(
    recipeId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<Comment>> {
    const { page, limit, skip } = calculatePagination(options);

    const [data, total] = await Promise.all([
      prisma.comment.findMany({
        where: { recipeId },
        skip,
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        take: limit,
        orderBy: options.sortBy
          ? { [options.sortBy]: options.sortOrder || "desc" }
          : { createdAt: "desc" },
      }),
      prisma.comment.count({ where: { recipeId } }),
    ]);

    return createPaginatedResponse(data, total, page, limit);
  },

  async getCommentsByUserId(
    userId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<Comment>> {
    const { page, limit, skip } = calculatePagination(options);

    const [data, total] = await Promise.all([
      prisma.comment.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: options.sortBy
          ? { [options.sortBy]: options.sortOrder || "desc" }
          : { createdAt: "desc" },
        include: {
          recipe: { select: { id: true, title: true, imageUrl: true } },
          user: { select: { id: true, name: true, image: true } },
        },
      }),
      prisma.comment.count({ where: { userId } }),
    ]);

    return createPaginatedResponse(data, total, page, limit);
  },

  async getRecentComments(
    options: PaginationOptions = {}
  ): Promise<PaginatedResponse<Comment>> {
    const { page, limit, skip } = calculatePagination(options);

    const [data, total] = await Promise.all([
      prisma.comment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, image: true } },
          recipe: { select: { id: true, title: true, imageUrl: true } },
        },
      }),
      prisma.comment.count(),
    ]);

    return createPaginatedResponse(data, total, page, limit);
  },

  async updateComment(
    id: string,
    data: Prisma.CommentUpdateInput
  ): Promise<Comment | null> {
    try {
      return await prisma.comment.update({
        where: { id },
        data,
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
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

  async deleteComment(id: string): Promise<Comment | null> {
    try {
      return await prisma.comment.delete({
        where: { id },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
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
};
