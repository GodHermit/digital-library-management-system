import { ROUTES } from '@/types/routes';
import { Button } from '@nextui-org/react';
import { FrownIcon } from 'lucide-react';
import { useMemo } from 'react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError();
  const isErrorResponse = isRouteErrorResponse(error);

  const errorMessage = useMemo(() => {
    if (isErrorResponse) {
      if (error.status === 404) {
        return "This page doesn't exist!";
      }

      if (error.status === 401) {
        return "You aren't authorized to see this";
      }

      if (error.status === 503) {
        return 'Looks like our API is down';
      }

      if (error.status === 418) {
        return '🫖';
      }
    }

    return 'Oops... Something went wrong';
  }, [isErrorResponse, error]);

  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className="flex justify-center items-center gap-12 flex-col">
        <div className="p-6 bg-default-100 rounded-2xl">
          <FrownIcon width={40} height={40} />
        </div>
        <h1 className="flex items-center gap-2 text-4xl font-bold">
          {isErrorResponse && error.status} | {errorMessage}
        </h1>
        <div className="flex flex-col gap-2 w-full max-w-64">
          <Button
            variant="solid"
            color="primary"
            size="lg"
            className="w-full"
            onPress={() => window.location.reload()}
          >
            Reload page
          </Button>
          <Button
            as={Link}
            to={ROUTES.HOME}
            variant="flat"
            size="lg"
            className="w-full"
          >
            Go to «Home» page
          </Button>
        </div>
      </div>
    </main>
  );
}
