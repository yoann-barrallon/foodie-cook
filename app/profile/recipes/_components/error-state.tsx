import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Card>
      <CardBody className="text-center py-12">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-xl font-semibold mb-2 text-danger">
          Erreur de chargement
        </h3>
        <p className="text-foreground-500 mb-4">{message}</p>
        <Button color="primary" variant="flat" onPress={onRetry}>
          Réessayer
        </Button>
      </CardBody>
    </Card>
  );
}
