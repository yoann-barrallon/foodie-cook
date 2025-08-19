"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { saveUploadedFile } from "@/lib/upload";

const createRecipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().min(1),
  prepTime: z.number().min(1),
  category: z.string().min(1),
  ingredients: z.array(
    z.object({
      name: z.string().min(1),
      quantity: z.number().min(1),
      unit: z.string().min(1),
    })
  ),
  instructions: z.string(),
});

export async function createRecipe(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const user = session.user;

    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const prepTimeStr = formData.get("prepTime")?.toString() || "0";
    const category = formData.get("category")?.toString() || "";
    const instructions = formData.get("instructions")?.toString() || "";

    const imageFile = formData.get("image") as File;
    if (!imageFile || imageFile.size === 0) {
      return {
        success: false,
        error: "Veuillez sélectionner une image pour la recette.",
      };
    }

    let imageUrl: string;
    try {
      imageUrl = await saveUploadedFile(imageFile);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'upload de l'image.",
      };
    }

    let ingredients = [];
    const ingredientsStr = formData.get("ingredients")?.toString();

    if (ingredientsStr) {
      try {
        ingredients = JSON.parse(ingredientsStr);
      } catch {
        ingredients = ingredientsStr
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
          .map((name) => ({
            name,
            quantity: 1,
            unit: "pièce",
          }));
      }
    }

    if (!user.id) {
      return {
        success: false,
        error: "ID utilisateur manquant. Veuillez vous reconnecter.",
      };
    }

    const validatedData = createRecipeSchema.parse({
      title,
      description,
      imageUrl,
      prepTime: parseInt(prepTimeStr, 10),
      category,
      ingredients,
      instructions,
    });

    const recipe = await prisma.$transaction(async (prisma) => {
      const newRecipe = await prisma.recipe.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          imageUrl: validatedData.imageUrl,
          prepTime: validatedData.prepTime,
          category: validatedData.category,
          instructions: validatedData.instructions,
          author: {
            connect: { id: user.id },
          },
        },
      });

      for (const ingredient of validatedData.ingredients) {
        if (!ingredient || ingredient.name.trim() === "") {
          continue;
        }

        const existingIngredient = await prisma.ingredient.findUnique({
          where: { name: ingredient.name.toLowerCase() },
        });

        let ingredientId;

        if (existingIngredient) {
          ingredientId = existingIngredient.id;
        } else {
          const newIngredient = await prisma.ingredient.create({
            data: { name: ingredient.name.toLowerCase() },
          });
          ingredientId = newIngredient.id;
        }

        await prisma.recipeIngredient.create({
          data: {
            recipeId: newRecipe.id,
            ingredientId,
            quantity: ingredient.quantity || 0,
            unit: ingredient.unit?.trim() || null,
          },
        });
      }

      return await prisma.recipe.findUnique({
        where: { id: newRecipe.id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
    });

    return {
      success: true,
      recipe,
    };
  } catch (error) {
    console.error("Error creating recipe:", error);
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? "Données invalides: " +
            error.issues.map((e: z.ZodIssue) => e.message).join(", ")
          : "Erreur lors de la création de la recette",
    };
  }
}
