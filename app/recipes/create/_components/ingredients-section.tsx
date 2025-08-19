"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface IngredientsSectionProps {
  ingredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

export default function IngredientsSection({
  ingredients,
  onIngredientsChange,
}: IngredientsSectionProps) {
  const addIngredient = () => {
    onIngredientsChange([
      ...ingredients,
      { name: "", quantity: 1, unit: "pièce" },
    ]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      onIngredientsChange(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string | number
  ) => {
    const updatedIngredients = ingredients.map((ingredient, i) =>
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    onIngredientsChange(updatedIngredients);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <label className="block text-sm font-medium text-gray-700">
          Ingrédients *
        </label>
        <Button
          type="button"
          onPress={addIngredient}
          size="sm"
          color="primary"
          variant="bordered"
        >
          + Ajouter
        </Button>
      </div>

      <div className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2 items-end">
            <Input
              type="text"
              value={ingredient.name}
              onChange={(e) => updateIngredient(index, "name", e.target.value)}
              placeholder="Nom de l'ingrédient"
              variant="bordered"
              className="flex-1"
              size="sm"
            />
            <Input
              type="number"
              value={ingredient.quantity.toString()}
              onChange={(e) =>
                updateIngredient(index, "quantity", Number(e.target.value))
              }
              min="0.1"
              step="0.1"
              variant="bordered"
              className="w-20"
              size="sm"
            />
            <Select
              selectedKeys={[ingredient.unit]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                updateIngredient(index, "unit", value);
              }}
              variant="bordered"
              className="w-32"
              size="sm"
              aria-label="Unité"
            >
              <SelectItem key="pièce">pièce</SelectItem>
              <SelectItem key="g">g</SelectItem>
              <SelectItem key="kg">kg</SelectItem>
              <SelectItem key="ml">ml</SelectItem>
              <SelectItem key="l">l</SelectItem>
              <SelectItem key="cuillère à soupe">c. à s.</SelectItem>
              <SelectItem key="cuillère à café">c. à c.</SelectItem>
              <SelectItem key="tasse">tasse</SelectItem>
            </Select>
            <Button
              type="button"
              onPress={() => removeIngredient(index)}
              disabled={ingredients.length === 1}
              color="danger"
              variant="light"
              size="sm"
              isIconOnly
            >
              ✕
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
