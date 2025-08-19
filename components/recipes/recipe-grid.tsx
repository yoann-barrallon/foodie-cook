import { Recipe } from "@/types";
import { RecipeCard } from "./recipe-card";
import { RecipeCardWithActions } from "./recipe-card-with-actions";

interface RecipeGridProps {
  recipes: Recipe[];
  loading?: boolean;
  title?: string;
  emptyMessage?: string;
  showEditButton?: boolean;
}

export function RecipeGrid({
  recipes,
  loading = false,
  title,
  emptyMessage = "Aucune recette trouvée.",
  showEditButton = false,
}: RecipeGridProps) {
  if (loading) {
    return (
      <section className="w-full">
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-default-200 rounded-lg h-48 mb-4"></div>
              <div className="space-y-2">
                <div className="bg-default-200 rounded h-4 w-3/4"></div>
                <div className="bg-default-200 rounded h-3 w-full"></div>
                <div className="bg-default-200 rounded h-3 w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (recipes.length === 0) {
    return (
      <section className="w-full">
        {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold mb-2">Aucune recette trouvée</h3>
          <p className="text-foreground-500">{emptyMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          showEditButton ? (
            <RecipeCardWithActions 
              key={recipe.id} 
              recipe={recipe} 
              showEditButton={true} 
            />
          ) : (
            <RecipeCard key={recipe.id} recipe={recipe} />
          )
        ))}
      </div>
    </section>
  );
}
