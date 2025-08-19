"use client";
import { likeDislikeRecipe } from "@/app/actions/recipes/recipe-like.action";
import { rateRecipe } from "@/app/actions/recipes/rate.action";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { useState } from "react";
import { FaComment, FaHeart, FaStar } from "react-icons/fa";

interface SocialActionsProps {
  recipeId: string;
  initialHasFavorited: boolean;
  initialFavoritesCount: number;
  initialUserRating: number;
  averageRating: number;
  totalRatings: number;
}

export default function SocialActions({
  recipeId,
  initialHasFavorited,
  initialFavoritesCount,
  initialUserRating,
  averageRating,
  totalRatings,
}: SocialActionsProps) {
  const [hasFavorited, setHasFavorited] = useState(initialHasFavorited);
  const [favoritesCount, setFavoritesCount] = useState(initialFavoritesCount);
  const [userRating, setUserRating] = useState(initialUserRating);
  const [currentAverage, setCurrentAverage] = useState(averageRating);
  const [currentTotal, setCurrentTotal] = useState(totalRatings);

  const handleLike = async () => {
    const result = await likeDislikeRecipe(recipeId);
    if (result.success) {
      addToast({
        title: result.isLiked
          ? "Recette ajoutée aux favoris"
          : "Recette retirée des favoris",
        color: "default",
      });
      setHasFavorited(result.isLiked ?? false);
      setFavoritesCount(result.likeCount ?? favoritesCount);
    } else {
      addToast({
        title: "Erreur lors de l'ajout aux favoris",
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast({
      title: "Lien copié dans le presse-papiers",
    });
  };

  const handleRating = async (score: number) => {
    const result = await rateRecipe({ recipeId, score });
    if (result.success) {
      const previousRating = userRating;
      setUserRating(score);

      let newAverage = result.averageRating;
      let newTotal = result.totalRatings;

      setCurrentAverage(newAverage);
      setCurrentTotal(newTotal);

      addToast({
        title: "Note enregistrée avec succès",
        color: "success",
      });
    } else {
      addToast({
        title: "Erreur lors de l'enregistrement de la note",
        color: "danger",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 justify-center">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <FaStar
                  className="w-6 h-6 cursor-pointer"
                  color={star <= userRating ? "#fbbf24" : "#d1d5db"}
                />
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500 text-center">
            Moyenne: {currentAverage.toFixed(1)}/5 ({currentTotal} avis)
          </div>
        </div>
        <Button
          onPress={handleLike}
          color="primary"
          size="lg"
          className="px-8"
          startContent={hasFavorited ? <FaHeart color="red" /> : <FaHeart />}
        >
          {hasFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
        </Button>
        <Button
          onPress={handleShare}
          color="secondary"
          variant="bordered"
          size="lg"
          className="px-8"
        >
          Partager
        </Button>
      </div>

      <div className="flex gap-2 justify-end">
        <div className="flex items-center gap-2">
          <FaHeart color={hasFavorited ? "red" : "gray"} />
          {favoritesCount}
        </div>
      </div>
    </div>
  );
}
