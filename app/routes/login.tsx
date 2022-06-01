import { ActionFunction, LoaderFunction, redirect } from '@remix-run/cloudflare';
import { Form } from '@remix-run/react';
import invariant from 'tiny-invariant';
// import { createUserSession, getUser, login } from '~/utils/index.server';

// export const loader: LoaderFunction = async ({ request }) => {
//   const user = await getUser(request);
//   if (user) return redirect('/projects');
//   return {};
// };

// export const action: ActionFunction = async ({ request }) => {
//   const formData = await request.formData();
//   const { email, password } = Object.fromEntries(formData);
//   if (!email || !password) return { formError: 'Please enter an email and password' };
//   invariant(typeof email === 'string', 'email is required');
//   invariant(typeof password === 'string', 'password is required');
//   const loginData = await login({ email, password });
//   if (!loginData) return { formError: 'Invalid email or password' };
//   return createUserSession(loginData.id, '/projects');
// };

export function Login() {
  return (
    <Form method="post" className="w-full m-auto flex flex-col gap-5">
      <h2>Login</h2>
      <input type="email" autoComplete="username" />
      <input type="password" autoComplete="current-password" />
      <button type="submit">Log in</button>
    </Form>
  );
}
