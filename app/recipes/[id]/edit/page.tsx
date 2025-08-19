import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import EditRecipeForm from "./_components/edit-recipe-form";
import { getRecipeForEdit } from "@/app/actions/recipes/recipe-update.action";

interface EditRecipePageProps {
  params: { id: string };
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const recipe = await getRecipeForEdit(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <EditRecipeForm recipe={recipe} />
    </div>
  );
}