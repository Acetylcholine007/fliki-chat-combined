import { useRouteError } from 'react-router-dom';

export default function ErrorScreen() {
  const error = useRouteError();

  return (
    <div
      id="error-page"
      className="flex h-full w-full flex-col items-center justify-center gap-1"
    >
      <h1 className="text-4xl">Oops!</h1>
      <p>Sorry, an unexpected error has occurred. Please refresh the page.</p>
      <br />
      <p>
        <i>{error instanceof Error ? `${error.message}` : 'Unknown Error'}</i>
      </p>
    </div>
  );
}
