"use client";

import { Button } from "@heroui/button";
import { FaTrash } from "react-icons/fa";
import { deleteRecipe } from "@/app/actions/recipes/recipe-delete.action";
import { useTransition } from "react";
import { addToast } from "@heroui/toast";

interface DeleteRecipeButtonProps {
  recipeId: string;
}

export default function DeleteRecipeButton({
  recipeId,
}: DeleteRecipeButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir supprimer cette recette ? Cette action est irréversible."
      )
    ) {
      startTransition(async () => {
        try {
          const result = await deleteRecipe(recipeId);
          if (result.success) {
            addToast({
              title: "Recette supprimée avec succès",
              color: "success",
            });
          } else {
            addToast({
              title: result.error || "Erreur lors de la suppression",
              color: "danger",
            });
          }
        } catch (error) {
          addToast({
            title: "Une erreur inattendue s'est produite",
            color: "danger",
          });
        }
      });
    }
  };

  return (
    <Button
      color="danger"
      variant="flat"
      startContent={<FaTrash />}
      onPress={handleDelete}
      isLoading={isPending}
      isDisabled={isPending}
    >
      {isPending ? "Suppression..." : "Supprimer la recette"}
    </Button>
  );
}
