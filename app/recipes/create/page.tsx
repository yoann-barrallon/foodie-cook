"use client";
import { createRecipe } from "@/app/actions/recipes/recipe-add.action";
import { useState } from "react";
import IngredientsSection from "./_components/ingredients-section";
import ImageUpload from "./_components/image-upload";
import BasicInfoSection from "./_components/basic-info-section";
import InstructionsSection from "./_components/instructions-section";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export default function CreateRecipePage() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", quantity: 1, unit: "pièce" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      const validIngredients = ingredients.filter(
        (ing) => ing.name.trim() !== ""
      );
      formData.set("ingredients", JSON.stringify(validIngredients));

      const result = await createRecipe(formData);

      if (result.success) {
        addToast({
          title: "Recette créée avec succès!",
          color: "success",
        });
        router.push(`/recipes/${result.recipe?.id}`);
      } else {
        addToast({
          title: result.error || "Erreur lors de la création",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Une erreur inattendue s'est produite",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col items-start px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Créer une Recette
          </h1>
          <p className="text-gray-600 mt-1">
            Partagez votre recette préférée avec la communauté
          </p>
        </CardHeader>

        <CardBody className="px-6 pb-6">
          <form id="recipe-form" action={handleSubmit} className="space-y-6">
            <BasicInfoSection />
            <ImageUpload />
            <IngredientsSection
              ingredients={ingredients}
              onIngredientsChange={setIngredients}
            />
            <InstructionsSection />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              color="primary"
              variant="solid"
              isLoading={isSubmitting}
              size="lg"
            >
              {isSubmitting ? "Création en cours..." : "Créer la Recette"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
