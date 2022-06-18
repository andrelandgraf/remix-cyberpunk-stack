import { json, LoaderFunction } from '@remix-run/node';
import { recommendActions } from '~/modules/action-recommender/suggestions.server';
import { getTrackingId } from '~/modules/event-tracking/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  const [trackingId, headers] = await getTrackingId(request);
  const actions = await recommendActions(trackingId);
  return json({ actions }, { headers });
};
