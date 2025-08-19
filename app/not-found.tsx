import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md p-6">
        <Card>
          <CardHeader className="flex flex-col gap-4 pb-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-danger rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">!</span>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
              <h2 className="text-xl font-semibold text-foreground">
                Page non trouvée
              </h2>
              <p className="text-sm text-foreground-500 mt-3">
                Oops ! La page que vous cherchez semble avoir disparu. Elle a
                peut-être été déplacée ou supprimée.
              </p>
            </div>
          </CardHeader>

          <Divider />

          <CardBody className="gap-4 pt-6">
            <div className="flex flex-col gap-3">
              <Button
                as={Link}
                href="/"
                className="w-full h-12 text-medium font-semibold"
                color="primary"
                variant="solid"
              >
                🏠 Retour à l'accueil
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
