"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("github", {
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md p-6">
        <Card>
          <CardHeader className="flex flex-col gap-3 pb-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">F</span>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">
                Bienvenue sur Foodie
              </h1>
              <p className="text-sm text-foreground-500 mt-2">
                Connectez-vous pour découvrir et partager vos recettes préférées
              </p>
            </div>
          </CardHeader>

          <Divider />

          <CardBody className="gap-6 pt-6">
            <Button
              className="w-full h-12 text-medium font-semibold"
              color="default"
              startContent={<FaGithub size={20} />}
              variant="bordered"
              onPress={handleGitHubSignIn}
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Continuer avec GitHub"}
            </Button>

            <div className="text-center">
              <p className="text-xs text-foreground-400">
                En vous connectant, vous acceptez nos conditions d'utilisation
                et notre politique de confidentialité.
              </p>
            </div>
          </CardBody>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-foreground-500">
            Première visite ?{" "}
            <span className="text-primary font-medium">
              Connectez-vous avec GitHub pour commencer
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
