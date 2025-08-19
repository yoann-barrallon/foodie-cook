"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deleteRecipe(recipeId: string) {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId, authorId: session.user.id },
  });

  if (!recipe) {
    return {
      success: false,
      error: "Recipe not found",
    };
  }

  await prisma.recipe.delete({ where: { id: recipeId } });

  redirect("/");
}
