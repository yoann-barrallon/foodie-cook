import { PaginatedResponse } from "@/services/types";
import { Recipe } from "@/types";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import Link from "next/link";
import { FaUtensils, FaPlus, FaHeart } from "react-icons/fa";

interface ProfileRecipesProps {
  recipesCount: number;
  favoritesCount: number;
  initialRecipes: PaginatedResponse<Recipe>;
  initialFavorites: PaginatedResponse<any>;
}

export default function ProfileRecipes({
  recipesCount,
  favoritesCount,
  initialRecipes,
  initialFavorites,
}: ProfileRecipesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FaUtensils className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Mes Recettes</h3>
              <p className="text-sm text-foreground-500">
                {recipesCount} recette
                {recipesCount !== 1 ? "s" : ""} créée
                {recipesCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button
            as={Link}
            href="/recipes/create"
            color="primary"
            variant="flat"
            startContent={<FaPlus />}
            size="sm"
          >
            Nouvelle recette
          </Button>
        </CardHeader>
        <CardBody>
          {initialRecipes.data.length > 0 ? (
            <div className="space-y-3">
              {initialRecipes.data.slice(0, 3).map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-default-50 hover:bg-default-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">
                      {recipe.title}
                    </h4>
                    <p className="text-xs text-foreground-500">
                      {recipe.category} • {recipe.prepTime} min
                    </p>
                  </div>
                </div>
              ))}
              {initialRecipes.data.length > 3 && (
                <Button
                  as={Link}
                  href="/profile/recipes"
                  variant="light"
                  color="primary"
                  className="w-full mt-3"
                  size="sm"
                >
                  Voir toutes mes recettes ({recipesCount})
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaUtensils className="w-12 h-12 text-foreground-300 mx-auto mb-3" />
              <p className="text-foreground-500 mb-4">
                Vous n'avez pas encore créé de recette
              </p>
              <Button
                as={Link}
                href="/recipes/create"
                color="primary"
                startContent={<FaPlus />}
              >
                Créer ma première recette
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-danger/10 rounded-lg">
              <FaHeart className="w-5 h-5 text-danger" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Mes Favoris</h3>
              <p className="text-sm text-foreground-500">
                {favoritesCount} recette
                {favoritesCount !== 1 ? "s" : ""} favorite
                {favoritesCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button
            as={Link}
            href="/recipes"
            color="danger"
            variant="flat"
            size="sm"
          >
            Découvrir
          </Button>
        </CardHeader>
        <CardBody>
          {initialFavorites.data.length > 0 ? (
            <div className="space-y-3">
              {initialFavorites.data.slice(0, 3).map((favorite) => (
                <div
                  key={favorite.recipe.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-default-50 hover:bg-default-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">
                      {favorite.recipe.title}
                    </h4>
                    <p className="text-xs text-foreground-500">
                      Par {favorite.recipe.author?.name || "Anonyme"}
                    </p>
                  </div>
                </div>
              ))}
              {initialFavorites.data.length > 3 && (
                <Button
                  as={Link}
                  href="/profile/favorites"
                  variant="light"
                  color="danger"
                  className="w-full mt-3"
                  size="sm"
                >
                  Voir tous mes favoris ({favoritesCount})
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaHeart className="w-12 h-12 text-foreground-300 mx-auto mb-3" />
              <p className="text-foreground-500 mb-4">
                Vous n'avez pas encore de recettes favorites
              </p>
              <Button as={Link} href="/recipes" color="danger" variant="flat">
                Découvrir des recettes
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
