import { Card, CardBody } from "@heroui/card";
import {
  FaUtensils,
  FaHeart,
  FaStar,
  FaComment,
  FaAward,
  FaTrophy,
} from "react-icons/fa";

interface ProfileStatsProps {
  recipesCount: number;
  favoritesCount: number;
  ratingsCount: number;
  commentsCount: number;
  averageRatingReceived: number;
}

export function ProfileStats({
  recipesCount,
  favoritesCount,
  ratingsCount,
  commentsCount,
  averageRatingReceived,
}: ProfileStatsProps) {
  const statItems = [
    {
      label: "Recettes",
      value: recipesCount,
      description: "recettes créées",
      icon: <FaUtensils className="w-5 h-5" />,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Favoris",
      value: favoritesCount,
      description: "recettes favorites",
      icon: <FaHeart className="w-5 h-5" />,
      color: "text-danger",
      bgColor: "bg-danger/10",
    },
    {
      label: "Évaluations",
      value: ratingsCount,
      description: "données",
      icon: <FaStar className="w-5 h-5" />,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Commentaires",
      value: commentsCount,
      description: "publiés",
      icon: <FaComment className="w-5 h-5" />,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      label: "Note moyenne",
      value:
        averageRatingReceived > 0 ? averageRatingReceived.toFixed(1) : "N/A",
      description: "reçue sur vos recettes",
      suffix: averageRatingReceived > 0 ? "/5" : "",
      icon:
        averageRatingReceived >= 4.5 ? (
          <FaTrophy className="w-5 h-5" />
        ) : (
          <FaAward className="w-5 h-5" />
        ),
      color: averageRatingReceived >= 4.5 ? "text-warning" : "text-success",
      bgColor: averageRatingReceived >= 4.5 ? "bg-warning/10" : "bg-success/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardBody className="text-center p-4">
            <div
              className={`mx-auto mb-3 w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center`}
            >
              <span className={item.color}>{item.icon}</span>
            </div>

            <div
              className={`text-2xl md:text-3xl font-bold mb-1 ${item.color}`}
            >
              {item.value}
              {item.suffix}
            </div>

            <div className="text-sm font-medium text-foreground-700 mb-1">
              {item.label}
            </div>

            <div className="text-xs text-foreground-500">
              {item.description}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
