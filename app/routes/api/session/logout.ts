import { ActionFunction } from '@remix-run/node';
import { getTrackingId, trackEvent } from '~/modules/event-tracking/session.server';
import { actions } from '~/server/actions.server';
import { logout } from '~/server/session.server';

export const action: ActionFunction = async ({ request }): Promise<Response> => {
  const [trackingId, headers] = await getTrackingId(request);
  trackEvent(trackingId, actions.logout.intent);
  return logout(request, headers);
};
