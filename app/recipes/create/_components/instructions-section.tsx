import { Textarea } from "@heroui/input";

export default function InstructionsSection() {
  return (
    <Textarea
      name="instructions"
      label="Instructions"
      placeholder="Décrivez étape par étape comment préparer cette recette..."
      isRequired
      variant="bordered"
      minRows={6}
      className="w-full"
    />
  );
}
