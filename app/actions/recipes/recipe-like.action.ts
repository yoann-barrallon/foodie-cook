"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const likeDislikeRecipeSchema = z.object({
  recipeId: z.string(),
});

export async function likeDislikeRecipe(recipeId: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  const validatedData = likeDislikeRecipeSchema.parse({ recipeId });

  const recipe = await prisma.recipe.findUnique({
    where: { id: validatedData.recipeId },
  });

  if (!recipe) {
    return { success: false, error: "Recipe not found" };
  }

  const existingLike = await prisma.favorite.findFirst({
    where: {
      recipeId: validatedData.recipeId,
      userId: user.id,
    },
  });

  const commentCount = await prisma.comment.count({
    where: {
      recipeId: validatedData.recipeId,
    },
  });
  if (existingLike) {
    await prisma.favorite.delete({
      where: { id: existingLike.id },
    });

    const likeCount = await prisma.favorite.count({
      where: {
        recipeId: validatedData.recipeId,
      },
    });

    return {
      success: true,
      isLiked: false,
      likeCount,
      commentCount,
    };
  }
  await prisma.favorite.create({
    data: {
      recipeId: validatedData.recipeId,
      userId: user.id,
    },
  });

  const likeCount = await prisma.favorite.count({
    where: {
      recipeId: validatedData.recipeId,
    },
  });

  return {
    success: true,
    isLiked: true,
    likeCount,
    commentCount,
  };
}
