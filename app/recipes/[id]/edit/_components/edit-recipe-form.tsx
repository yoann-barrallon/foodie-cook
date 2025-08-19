"use client";

import { updateRecipe } from "@/app/actions/recipes/recipe-update.action";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import Image from "next/image";
import { FaPlus, FaTrash } from "react-icons/fa";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface EditRecipeFormProps {
  recipe: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    prepTime: number;
    category: string;
    instructions: string | null;
    formattedIngredients: Ingredient[];
  };
}

const categories = [
  { value: "entrée", label: "Entrée" },
  { value: "plat", label: "Plat principal" },
  { value: "dessert", label: "Dessert" },
  { value: "snack", label: "Snack" },
  { value: "boisson", label: "Boisson" },
  { value: "sauce", label: "Sauce" },
  { value: "accompagnement", label: "Accompagnement" },
];

const units = [
  { value: "g", label: "Grammes" },
  { value: "kg", label: "Kilogrammes" },
  { value: "ml", label: "Millilitres" },
  { value: "l", label: "Litres" },
  { value: "c.à.s", label: "Cuillère à soupe" },
  { value: "c.à.c", label: "Cuillère à café" },
  { value: "tasse", label: "Tasse" },
  { value: "pièce", label: "Pièce" },
  { value: "pincée", label: "Pincée" },
];

export default function EditRecipeForm({ recipe }: EditRecipeFormProps) {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    recipe.formattedIngredients.length > 0
      ? recipe.formattedIngredients
      : [{ name: "", quantity: 1, unit: "pièce" }]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(recipe.imageUrl);
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description);
  const [prepTime, setPrepTime] = useState(recipe.prepTime.toString());
  const [category, setCategory] = useState(recipe.category);
  const [instructions, setInstructions] = useState(recipe.instructions || "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: 1, unit: "pièce" }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Ajouter les ingrédients au formData
    const validIngredients = ingredients.filter(
      (ing) => ing.name.trim() !== ""
    );
    formData.set("ingredients", JSON.stringify(validIngredients));

    try {
      const result = await updateRecipe(recipe.id, formData);

      if (result.success) {
        addToast({
          title: "Recette modifiée avec succès!",
          color: "success",
        });
        router.push(`/recipes/${recipe.id}`);
      } else {
        addToast({
          title: result.error || "Erreur lors de la modification",
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
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col items-start px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Modifier la Recette
        </h1>
        <p className="text-gray-600 mt-1">
          Modifiez les informations de votre recette
        </p>
      </CardHeader>

      <CardBody className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Informations de base
            </h2>
            <Input
              label="Titre de la recette"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Tarte aux pommes maison"
              isRequired
              variant="bordered"
            />

            <Textarea
              label="Description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre recette..."
              isRequired
              variant="bordered"
              minRows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Temps de préparation (minutes)"
                name="prepTime"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                min="1"
                isRequired
                variant="bordered"
              />

              <Select
                label="Catégorie"
                name="category"
                selectedKeys={[category]}
                onChange={(e) => setCategory(e.target.value)}
                isRequired
                variant="bordered"
              >
                {categories.map((cat) => (
                  <SelectItem key={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {/* Image */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Image de la recette
            </h2>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Aperçu de la recette"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <Input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                variant="bordered"
                label="Changer l'image (optionnel)"
              />
              <p className="text-sm text-gray-500">
                Laissez vide pour conserver l'image actuelle
              </p>
            </div>
          </div>

          {/* Ingrédients */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Ingrédients
            </h2>
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Nom de l'ingrédient"
                    value={ingredient.name}
                    onChange={(e) =>
                      updateIngredient(index, "name", e.target.value)
                    }
                    variant="bordered"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Quantité"
                    value={ingredient.quantity.toString()}
                    onChange={(e) =>
                      updateIngredient(index, "quantity", parseFloat(e.target.value) || 1)
                    }
                    variant="bordered"
                    className="w-24"
                    min="0.1"
                    step="0.1"
                  />
                  <Select
                    value={ingredient.unit}
                    onChange={(e) =>
                      updateIngredient(index, "unit", e.target.value)
                    }
                    variant="bordered"
                    className="w-40"
                    selectedKeys={[ingredient.unit]}
                  >
                    {units.map((unit) => (
                      <SelectItem key={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Button
                    type="button"
                    color="danger"
                    variant="flat"
                    isIconOnly
                    onClick={() => removeIngredient(index)}
                    isDisabled={ingredients.length === 1}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              color="primary"
              variant="flat"
              onClick={addIngredient}
              startContent={<FaPlus />}
            >
              Ajouter un ingrédient
            </Button>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Instructions
            </h2>
            <Textarea
              name="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Décrivez étape par étape comment préparer votre recette..."
              variant="bordered"
              minRows={6}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="flat"
              onClick={() => router.back()}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              color="primary"
              variant="solid"
              isLoading={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Modification en cours..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}