import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

export default function BasicInfoSection() {
  return (
    <div className="space-y-4">
      <Input
        type="text"
        name="title"
        label="Titre de la recette"
        placeholder="Ex: Tarte aux pommes"
        isRequired
        variant="bordered"
        className="w-full"
      />

      <Textarea
        name="description"
        label="Description"
        placeholder="Décrivez votre recette en quelques mots..."
        isRequired
        variant="bordered"
        minRows={3}
        className="w-full"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          name="prepTime"
          label="Temps de préparation (minutes)"
          placeholder="30"
          isRequired
          min={1}
          variant="bordered"
          className="w-full"
        />

        <Select
          name="category"
          label="Catégorie"
          placeholder="Choisissez une catégorie"
          isRequired
          variant="bordered"
          className="w-full"
        >
          <SelectItem key="entrée">Entrée</SelectItem>
          <SelectItem key="plat">Plat principal</SelectItem>
          <SelectItem key="dessert">Dessert</SelectItem>
          <SelectItem key="apéritif">Apéritif</SelectItem>
          <SelectItem key="boisson">Boisson</SelectItem>
        </Select>
      </div>
    </div>
  );
}
