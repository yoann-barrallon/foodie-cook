"use client";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import Link from "next/link";
import {
  FaClock,
  FaStar,
  FaComment,
  FaUtensils,
  FaHeart,
  FaEdit,
} from "react-icons/fa";
import { Recipe } from "@/types";
import { useRouter } from "next/navigation";

interface RecipeCardWithActionsProps {
  recipe: Recipe;
  showEditButton?: boolean;
}

export function RecipeCardWithActions({ 
  recipe, 
  showEditButton = false 
}: RecipeCardWithActionsProps) {
  const router = useRouter();
  const hasValidImage = recipe.imageUrl && recipe.imageUrl.trim() !== "";

  const handleCardClick = () => {
    router.push(`/recipes/${recipe.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/recipes/${recipe.id}/edit`);
  };

  return (
    <Card
      isPressable
      onPress={handleCardClick}
      className="w-full transition-transform hover:scale-105"
    >
      <CardBody className="p-0">
        <div className="relative">
          {hasValidImage ? (
            <img
              alt={recipe.title}
              className="h-48 w-full object-cover"
              src={recipe.imageUrl}
            />
          ) : (
            <div className="h-48 w-full bg-default-200 flex items-center justify-center">
              <FaUtensils className="w-12 h-12 text-default-400" />
            </div>
          )}
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
            {recipe.category}
          </span>
          
          {showEditButton && (
            <Button
              isIconOnly
              color="primary"
              variant="flat"
              className="absolute top-2 left-2"
              onClick={handleEditClick}
              size="sm"
              aria-label="Modifier la recette"
            >
              <FaEdit />
            </Button>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2 mb-2">
            {recipe.title}
          </h3>

          <p className="text-sm text-foreground-500 line-clamp-2 mb-3">
            {recipe.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 text-sm text-foreground-600">
              <FaClock className="w-4 h-4" />
              <span>{recipe.prepTime} min</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-foreground-500">
                <FaComment className="w-4 h-4" />
                <span>{recipe._count.comments}</span>
              </div>
              <div className="flex items-center gap-1 text-foreground-500">
                <FaHeart className="w-4 h-4" />
                <span>{recipe._count.favorites}</span>
              </div>
              <div className="flex items-center gap-1 text-foreground-500">
                <FaStar className="w-4 h-4" />
                <span>
                  {recipe.averageRating.toFixed(1)}/5 ({recipe._count.ratings})
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>

      <CardFooter className="pt-0 px-4 pb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {recipe.author && (
              <>
                <Avatar
                  name={recipe.author.name || "Utilisateur"}
                  size="sm"
                  src={recipe.author.image || undefined}
                />
                <span className="text-sm font-medium">
                  {recipe.author.name || "Utilisateur anonyme"}
                </span>
              </>
            )}
          </div>

          <span className="text-xs text-foreground-400">
            {new Date(recipe.createdAt).toLocaleDateString("fr-FR")}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}