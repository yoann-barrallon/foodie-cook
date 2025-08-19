import { notFound } from "next/navigation";
import { recipeService } from "@/services/recipe.service";
import { ingredientService } from "@/services/ingredient.service";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { FaClock, FaUsers, FaStar, FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import SocialActions from "./_components/social-actions";
import { auth } from "@/lib/auth";
import CommentSection from "./_components/comment-section";
import { commentService, ratingService } from "@/services";

interface RecipePageProps {
  params: { id: string };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const session = await auth();

  const [recipe, ingredients, comments, averageRating, userRating] =
    await Promise.all([
      recipeService.getRecipeById(id),
      ingredientService.getIngredientsByRecipeId(id),
      commentService.getCommentsByRecipeId(id),
      ratingService.getAverageRating(id),
      session?.user
        ? ratingService.getUserRatingForRecipe(session.user.id, id)
        : null,
    ]);

  if (!recipe) {
    notFound();
  }

  const hasFavorited = session?.user
    ? await recipeService.hasFavorited(id, session.user.id)
    : false;

  const isAuthor = session?.user?.id === recipe.author?.id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Actions de l'auteur */}
        {isAuthor && (
          <div className="flex justify-end gap-2">
            <Link href={`/recipes/${id}/edit`}>
              <Button
                color="primary"
                variant="flat"
                startContent={<FaEdit />}
              >
                Modifier la recette
              </Button>
            </Link>
          </div>
        )}

        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <Card shadow="md">
          <CardHeader className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {recipe.title}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={recipe.author?.image || undefined}
                      name={recipe.author?.name || "Anonyme"}
                      size="sm"
                    />
                    <span className="text-sm text-gray-600">
                      Par {recipe.author?.name || "Anonyme"}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(recipe.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
              <SocialActions
                recipeId={recipe.id}
                initialHasFavorited={hasFavorited}
                initialFavoritesCount={recipe._count.favorites}
                initialUserRating={userRating?.score || 0}
                averageRating={averageRating.averageRating}
                totalRatings={averageRating.totalRatings}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Chip color="primary" variant="flat">
                {recipe.category}
              </Chip>
              <Chip color="secondary" variant="flat" startContent={<FaClock />}>
                {recipe.prepTime} min
              </Chip>
              <Chip color="warning" variant="flat" startContent={<FaStar />}>
                {averageRating.totalRatings > 0
                  ? `${averageRating.averageRating.toFixed(1)}/5 (${averageRating.totalRatings} avis)`
                  : "Aucun avis"}
              </Chip>
            </div>
          </CardHeader>

          <CardBody className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {recipe.description}
              </p>
            </div>

            <Divider />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaUsers />
                Ingrédients
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ingredients.length > 0 ? (
                  ingredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium">{ingredient.name}</span>
                      <span className="text-primary font-semibold">
                        {ingredient.quantity
                          ? `${ingredient.quantity} ${ingredient.unit || ""}`.trim()
                          : "Au goût"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 py-4">
                    Aucun ingrédient spécifié pour cette recette.
                  </div>
                )}
              </div>
            </div>

            <Divider />

            {recipe.instructions && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Instructions
                </h2>
                <div className="prose prose-gray max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {recipe.instructions}
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
        <CommentSection
          recipeId={recipe.id}
          initialCommentCount={recipe._count.comments}
          initialComments={comments}
        />
      </div>
    </div>
  );
}
