import { useMatches } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { User } from '~/types';

export function useMatchesData(key: string) {
  const routeModules = useMatches();
  const route = routeModules.find((route) => route.data['key'] !== undefined);
  return route?.data[key];
}

function isUserOrUndefined(user: any): user is User | undefined {
  return (
    !user ||
    (typeof user === 'object' &&
      typeof user['id'] === 'string' &&
      typeof user['email'] === 'string' &&
      typeof user['name'] === 'string')
  );
}

export function useUser() {
  const user = useMatchesData('user');
  invariant(isUserOrUndefined(user), `useUser: user is not a valid user: ${JSON.stringify(user)}`);
  return user;
}

export function useRequiredUser() {
  const user = useUser();
  invariant(user, 'useRequiredUser: user is not defined');
  return user;
}
