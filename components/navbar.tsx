import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Avatar } from "@heroui/avatar";
import { auth } from "@/lib/auth";
import { ThemeSwitch } from "@/components/theme-switch";
import { SignOutButton } from "@/components/sign-out-button";
import { siteConfig } from "@/config/site";
import { FaPlus } from "react-icons/fa";

export async function Navbar() {
  const session = await auth();

  return (
    <NextUINavbar maxWidth="full" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <Link className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="flex basis-1/5 sm:basis-full" justify="end">
        {session ? (
          <>
            {/* Bouton Ajouter recette - version desktop avec texte */}
            <NavbarItem className="hidden md:flex">
              <Button
                as={Link}
                color="primary"
                href="/recipes/create"
                size="sm"
                variant="flat"
              >
                Ajouter une recette
              </Button>
            </NavbarItem>

            {/* Bouton Ajouter recette - version mobile avec icône */}
            <NavbarItem className="flex md:hidden">
              <Button
                as={Link}
                color="primary"
                href="/recipes/create"
                size="sm"
                variant="flat"
                isIconOnly
                title="Ajouter une recette"
              >
                <FaPlus />
              </Button>
            </NavbarItem>

            {/* Avatar - toujours visible */}
            <NavbarItem>
              <Avatar
                as={Link}
                className="cursor-pointer"
                href="/profile"
                name={session?.user?.name || session?.user?.email || "User"}
                size="sm"
                src={session?.user?.image || undefined}
              />
            </NavbarItem>

            {/* Theme switch - caché sur très petit écran */}
            <NavbarItem className="hidden sm:flex">
              <ThemeSwitch />
            </NavbarItem>

            {/* Bouton déconnexion - version desktop */}
            <NavbarItem className="hidden sm:flex">
              <SignOutButton />
            </NavbarItem>

            {/* Bouton déconnexion - version mobile compact */}
            <NavbarItem className="flex sm:hidden">
              <div className="scale-90">
                <SignOutButton />
              </div>
            </NavbarItem>
          </>
        ) : (
          <>
            {/* Theme switch pour utilisateurs non connectés */}
            <NavbarItem className="hidden sm:flex">
              <ThemeSwitch />
            </NavbarItem>

            {/* Boutons auth - version desktop */}
            <NavbarItem className="hidden sm:flex">
              <Button as={Link} href="/auth/signin" size="sm" variant="flat">
                Connexion
              </Button>
            </NavbarItem>
            <NavbarItem className="hidden sm:flex">
              <Button as={Link} color="primary" href="/auth/signup" size="sm">
                Inscription
              </Button>
            </NavbarItem>

            {/* Boutons auth - version mobile compacte */}
            <NavbarItem className="flex sm:hidden">
              <Button
                as={Link}
                href="/auth/signin"
                size="sm"
                variant="flat"
                className="text-xs px-2"
              >
                Connexion
              </Button>
            </NavbarItem>
            <NavbarItem className="flex sm:hidden">
              <Button
                as={Link}
                color="primary"
                href="/auth/signup"
                size="sm"
                className="text-xs px-2"
              >
                Inscription
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
}
