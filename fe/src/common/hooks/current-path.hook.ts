import { matchRoutes, useLocation } from 'react-router-dom';

const routes = [
  { path: '/' },
  { path: '/join/:chatGroupId' },
  { path: '/participants/:chatGroupId' },
  { path: '/:chatGroupId' },
  { path: '/:sign-in' },
  { path: '/:register' },
];

export default function useCurrentPath() {
  const location = useLocation();
  const [{ route }] = matchRoutes(routes, location)!;

  return route.path;
}
