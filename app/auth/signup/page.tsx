import { redirect } from "next/navigation";

export default function SignUpPage() {
  redirect("/auth/signin");
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p>Redirection vers la page de connexion...</p>
      </div>
    </div>
  );
}
