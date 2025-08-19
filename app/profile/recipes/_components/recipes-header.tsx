import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";
import { FaUtensils, FaPlus, FaArrowLeft, FaSort } from "react-icons/fa";

interface RecipesHeaderProps {
  totalRecipes: number;
  currentPage: number;
  totalPages: number;
  sortOrder: "desc" | "asc";
  onBack: () => void;
  onSortChange: () => void;
}

export function RecipesHeader({
  totalRecipes,
  currentPage,
  totalPages,
  sortOrder,
  onBack,
  onSortChange,
}: RecipesHeaderProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="bordered"
              size="sm"
              onPress={onBack}
              startContent={<FaArrowLeft />}
            >
              Retour
            </Button>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FaUtensils className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Mes Recettes
                </h1>
                <p className="text-foreground-600">
                  Gérez et consultez toutes vos créations culinaires
                </p>
              </div>
            </div>
          </div>

          <Button
            as={Link}
            href="/recipes/create"
            color="primary"
            variant="solid"
            startContent={<FaPlus />}
            className="w-full md:w-auto"
          >
            Nouvelle recette
          </Button>
        </div>
      </CardHeader>

      <Divider />

      <CardBody className="pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Chip color="primary" variant="flat" className="text-sm">
              {totalRecipes} recette{totalRecipes !== 1 ? "s" : ""}
            </Chip>

            {totalRecipes > 0 && (
              <div className="text-sm text-foreground-500">
                Page {currentPage} sur {totalPages}
              </div>
            )}
          </div>

          {totalRecipes > 1 && (
            <Button
              variant="bordered"
              size="sm"
              startContent={<FaSort />}
              onPress={onSortChange}
            >
              {sortOrder === "desc" ? "Plus récentes" : "Plus anciennes"}
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
