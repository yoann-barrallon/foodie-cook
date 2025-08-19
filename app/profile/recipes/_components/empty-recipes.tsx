import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { FaUtensils, FaPlus } from "react-icons/fa";

export function EmptyRecipes() {
  return (
    <Card>
      <CardBody className="text-center py-12">
        <FaUtensils className="w-16 h-16 text-foreground-300 mx-auto mb-6" />
        <h3 className="text-xl font-semibold mb-3">Aucune recette créée</h3>
        <p className="text-foreground-500 mb-6">
          Commencez à partager vos créations culinaires avec la communauté !
        </p>
        <Button
          as={Link}
          href="/recipes/create"
          color="primary"
          size="lg"
          startContent={<FaPlus />}
        >
          Créer ma première recette
        </Button>
      </CardBody>
    </Card>
  );
}
