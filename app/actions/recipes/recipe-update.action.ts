"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { saveUploadedFile } from "@/lib/upload";
import { unlink } from "fs/promises";
import { join } from "path";

const updateRecipeSchema = z.object({
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

export async function updateRecipe(recipeId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      error: "Non autorisé",
    };
  }

  try {
    // Vérifier que l'utilisateur est l'auteur de la recette
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!existingRecipe) {
      return {
        success: false,
        error: "Recette non trouvée",
      };
    }

    if (existingRecipe.authorId !== session.user.id) {
      return {
        success: false,
        error: "Vous n'êtes pas autorisé à modifier cette recette",
      };
    }

    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const prepTimeStr = formData.get("prepTime")?.toString() || "0";
    const category = formData.get("category")?.toString() || "";
    const instructions = formData.get("instructions")?.toString() || "";

    let imageUrl = existingRecipe.imageUrl;
    const imageFile = formData.get("image") as File;
    
    // Si une nouvelle image est fournie, l'uploader
    if (imageFile && imageFile.size > 0) {
      try {
        imageUrl = await saveUploadedFile(imageFile);
        
        // Essayer de supprimer l'ancienne image si elle était hébergée localement
        if (existingRecipe.imageUrl.startsWith("/uploads/")) {
          try {
            const oldImagePath = join(process.cwd(), "public", existingRecipe.imageUrl);
            await unlink(oldImagePath);
          } catch (error) {
            // Ignorer l'erreur si le fichier n'existe pas
            console.warn("Could not delete old image:", error);
          }
        }
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Erreur lors de l'upload de l'image.",
        };
      }
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

    const validatedData = updateRecipeSchema.parse({
      title,
      description,
      imageUrl,
      prepTime: parseInt(prepTimeStr, 10),
      category,
      ingredients,
      instructions,
    });

    const recipe = await prisma.$transaction(async (prisma) => {
      // Mettre à jour la recette
      const updatedRecipe = await prisma.recipe.update({
        where: { id: recipeId },
        data: {
          title: validatedData.title,
          description: validatedData.description,
          imageUrl: validatedData.imageUrl,
          prepTime: validatedData.prepTime,
          category: validatedData.category,
          instructions: validatedData.instructions,
        },
      });

      // Supprimer les anciens liens recette-ingrédients
      await prisma.recipeIngredient.deleteMany({
        where: { recipeId: recipeId },
      });

      // Ajouter les nouveaux ingrédients
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
            recipeId: updatedRecipe.id,
            ingredientId,
            quantity: ingredient.quantity || 0,
            unit: ingredient.unit?.trim() || null,
          },
        });
      }

      return await prisma.recipe.findUnique({
        where: { id: updatedRecipe.id },
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
    console.error("Error updating recipe:", error);
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? "Données invalides: " +
            error.issues.map((e: z.ZodIssue) => e.message).join(", ")
          : "Erreur lors de la modification de la recette",
    };
  }
}

export async function getRecipeForEdit(recipeId: string) {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const recipe = await prisma.recipe.findUnique({
    where: { 
      id: recipeId,
      authorId: session.user.id // S'assurer que l'utilisateur est l'auteur
    },
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
  });

  if (!recipe) {
    return null;
  }

  // Formater les ingrédients pour le formulaire
  const formattedIngredients = recipe.ingredients.map((ri) => ({
    name: ri.ingredient.name,
    quantity: ri.quantity || 1,
    unit: ri.unit || "pièce",
  }));

  return {
    ...recipe,
    formattedIngredients,
  };
}