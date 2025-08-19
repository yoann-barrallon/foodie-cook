import { auth } from "@/lib/auth";
import { userService } from "@/services/user.service";
import { recipeService } from "@/services/recipe.service";
import { favoriteService } from "@/services/favorite.service";
import { redirect } from "next/navigation";
import { ProfileStats } from "./_components/profile-stats";
import ProfileHeader from "./_components/profile-header";
import { Divider } from "@heroui/divider";
import ProfileRecipes from "./_components/profile-recipes";
import { DEFAULT_LIMIT_PER_PAGE } from "@/lib/constants";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await userService.getUserByEmail(session.user.email);

  if (!user) {
    redirect("/auth/signin");
  }

  const [userStats, initialRecipes, initialFavorites] = await Promise.all([
    userService.getUserStats(user.id),
    recipeService.getRecipesByUserId(user.id, {
      page: 1,
      limit: DEFAULT_LIMIT_PER_PAGE,
    }),
    favoriteService.getFavoriteRecipesWithDetails(user.id, {
      page: 1,
      limit: DEFAULT_LIMIT_PER_PAGE,
    }),
  ]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <ProfileHeader user={user} />

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Vos statistiques
        </h2>
        <ProfileStats
          recipesCount={userStats.recipesCount}
          favoritesCount={userStats.favoritesCount}
          ratingsCount={userStats.ratingsCount}
          commentsCount={userStats.commentsCount}
          averageRatingReceived={userStats.averageRatingReceived}
        />
      </div>

      <Divider className="my-8" />

      <ProfileRecipes
        recipesCount={userStats.recipesCount}
        favoritesCount={userStats.favoritesCount}
        initialRecipes={initialRecipes}
        initialFavorites={initialFavorites}
      />
    </div>
  );
}
