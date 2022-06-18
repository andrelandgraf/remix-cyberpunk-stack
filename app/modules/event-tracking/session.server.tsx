import crypto from 'crypto';
import { createCookieSessionStorage } from '@remix-run/node';
import { getPrivateEnvVars } from '~/server/env.server';
import { db } from '~/server/db.server';

const { trackingSecret, NODE_ENV } = getPrivateEnvVars();

const storage = createCookieSessionStorage({
  cookie: {
    name: 'cyberpunk-tracking',
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: NODE_ENV === 'production',
    secrets: [trackingSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

function getTrackingSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}

export async function getTrackingId(request: Request): Promise<[string, Headers | undefined]> {
  const session = await getTrackingSession(request);
  const trackingId = session.get('trackingId');
  if (!trackingId || typeof trackingId !== 'string') {
    return createTrackingSession();
  }
  return [trackingId, undefined];
}

export async function createTrackingSession(): Promise<[string, Headers]> {
  const session = await storage.getSession();
  const trackingId = crypto.randomUUID();
  session.set('trackingId', trackingId);
  const headers = new Headers({
    'Set-Cookie': await storage.commitSession(session),
  });
  return [trackingId, headers];
}

export async function trackEvent(trackingId: string, intent: string) {
  await db.event.create({ data: { trackingId, intent } });
}
