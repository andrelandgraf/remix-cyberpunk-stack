import { ActionFunction } from '@remix-run/node';
import { logout } from '~/server/session.server';

export const action: ActionFunction = async ({ request }): Promise<Response> => {
  return logout(request);
};
