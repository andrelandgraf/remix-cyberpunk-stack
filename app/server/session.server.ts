import bcrypt from 'bcryptjs';
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { getPrivateEnvVars } from './env.server';

import { db } from './db.server';

type SignupForm = {
  name: string;
  email: string;
  password: string;
};

export async function register({ name, email, password }: SignupForm) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { name, email: email.toLowerCase(), password: passwordHash },
  });
  return { id: user.id, email, name };
}

type LoginForm = {
  email: string;
  password: string;
};

export async function login({ email, password }: LoginForm) {
  const user = await db.user.findUnique({
    where: { email },
  });
  if (!user) return null;
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) return null;
  return { id: user.id, email };
}

const { sessionSecret, NODE_ENV } = getPrivateEnvVars();

const storage = createCookieSessionStorage({
  cookie: {
    name: 'cyberpunk-session',
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== 'string') {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
    return user;
  } catch (error) {
    console.error(error);
    throw logout(request);
  }
}

export async function logout(request: Request, headers: Headers | undefined = new Headers()) {
  const session = await getUserSession(request);
  const headersValue = await storage.destroySession(session);
  headers.set('Set-Cookie', headersValue);
  return redirect('/login', { headers });
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') return null;
  return userId;
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function createUserSession(
  userId: string,
  redirectTo: string,
  headers: Headers | undefined = new Headers(),
) {
  const session = await storage.getSession();
  session.set('userId', userId);
  const headersValue = await storage.commitSession(session);
  headers.set('Set-Cookie', headersValue);
  return redirect(redirectTo, { headers });
}
