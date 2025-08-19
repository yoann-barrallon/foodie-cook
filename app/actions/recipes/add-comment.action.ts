"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { commentService } from "@/services";

export async function addComment(formData: FormData) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { recipeId, content } = Object.fromEntries(formData);

  const validatedData = z
    .object({
      recipeId: z.string(),
      content: z.string().min(1),
    })
    .parse({ recipeId, content });

  const comment = await commentService.createComment({
    content: validatedData.content,
    user: {
      connect: {
        id: user.id,
      },
    },
    recipe: {
      connect: { id: validatedData.recipeId },
    },
  });

  const comments = await commentService.getCommentsByRecipeId(
    validatedData.recipeId,
    {
      page: 1,
      limit: 10,
    }
  );

  return { success: true, comment, comments };
}
