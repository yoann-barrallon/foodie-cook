"use client";

import { Button } from "@heroui/button";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <Button size="sm" variant="light" onPress={handleSignOut}>
      Déconnexion
    </Button>
  );
}
