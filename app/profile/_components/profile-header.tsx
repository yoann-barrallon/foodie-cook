import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { FaEdit, FaCog, FaCalendarAlt, FaEnvelope } from "react-icons/fa";
import { User } from "@/types/user";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <Card className="mb-6">
      <CardBody className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar et informations principales */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1">
            <Avatar
              src={user.image || undefined}
              name={user.name || user.email || "User"}
              className="w-24 h-24 text-large"
              isBordered
              color="primary"
            />

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {user.name || "Utilisateur"}
              </h1>

              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-foreground-600">
                  <FaEnvelope className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 text-foreground-600">
                  <FaCalendarAlt className="w-4 h-4" />
                  <span className="text-sm">
                    Membre depuis le {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>

              <Chip color="success" variant="flat" className="text-xs">
                Compte actif
              </Chip>
            </div>
          </div>

          {/* Boutons d'actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              color="primary"
              variant="flat"
              startContent={<FaEdit />}
              className="w-full sm:w-auto"
            >
              Éditer le profil
            </Button>

            <Button
              color="default"
              variant="bordered"
              startContent={<FaCog />}
              className="w-full sm:w-auto"
            >
              Paramètres
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
