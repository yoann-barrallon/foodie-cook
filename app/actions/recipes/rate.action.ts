"use server";

import { auth } from "@/lib/auth";
import { ratingService } from "@/services";

export async function rateRecipe(params: { recipeId: string; score: number }) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return { error: "Unauthorized" };
  }

  const rating = await ratingService.getUserRatingForRecipe(
    user.id,
    params.recipeId
  );

  if (rating) {
    await ratingService.updateRating(rating.id, { score: params.score });
  } else {
    await ratingService.createRating({
      recipe: { connect: { id: params.recipeId } },
      user: { connect: { id: user.id } },
      score: params.score,
    });
  }

  const { averageRating, totalRatings } = await ratingService.getAverageRating(
    params.recipeId
  );

  return {
    success: true,
    averageRating,
    totalRatings,
  };
}
