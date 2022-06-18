import zod from 'zod';
import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/node';
import { Form, useActionData, useTransition } from '@remix-run/react';
import { Button } from '~/UI/components/buttons';
import { H2 } from '~/UI/components/headings';
import { ErrorText, Input } from '~/UI/components/input';
import { createUserSession, getUser, login } from '~/server/session.server';
import { getTrackingId, trackEvent } from '~/modules/event-tracking/session.server';
import { actions } from '~/server/actions.server';

const LoginFormData = zod.object({
  email: zod
    .string({
      invalid_type_error: 'Must be a valid email address',
      required_error: 'Email is required',
    })
    .email({
      message: 'Must be a valid email address',
    }),
  password: zod.string({
    invalid_type_error: 'Must be a valid password',
    required_error: 'Password is required',
  }),
});

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) return redirect('/projects');
  return {};
};

type ActionData = {
  form: {
    error: string;
    email: {
      error: string | null;
    };
    password: {
      error: string | null;
    };
  };
};

function errorJson(headers: Headers | undefined, error: string, emailError?: string, passwordError?: string) {
  const data: ActionData = {
    form: {
      error,
      email: {
        error: emailError || null,
      },
      password: {
        error: passwordError || null,
      },
    },
  };
  return json(data, { headers });
}

export const action: ActionFunction = async ({ request }): Promise<ActionData | Response> => {
  const [trackingId, headers] = await getTrackingId(request);
  trackEvent(trackingId, actions.login.intent);
  try {
    const formData = await request.formData();
    const loginFormData = LoginFormData.safeParse(Object.fromEntries(formData));
    if (!loginFormData.success) {
      console.debug('LoginFormData.safeParse failed', loginFormData);
      return errorJson(
        headers,
        'There are some errors. Please review all fields again.',
        loginFormData.error.formErrors.fieldErrors.email?.join(', '),
        loginFormData.error.formErrors.fieldErrors.password?.join(', '),
      );
    }
    const { email, password } = loginFormData.data;
    const loginData = await login({ email, password });
    if (!loginData) return errorJson(headers, 'Invalid password or email. Please try again.');
    return createUserSession(loginData.id, '/projects', headers);
  } catch (error) {
    console.error(error);
    return errorJson(headers, 'Something went wrong, please try again.');
  }
};

export default function Login() {
  const actionData = useActionData();
  const transition = useTransition();
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Form method="post" className="w-full md:max-w-sm flex flex-col gap-5 items-center justify-center">
        <H2 className="text-center">Login</H2>
        {actionData?.form?.error && <ErrorText>{actionData.form.error}</ErrorText>}
        <div className="w-full">
          <label htmlFor="email-input">Email:</label>
          <Input
            type="text"
            placeholder="tony.stark@starkindustries.com"
            id="email-input"
            autoComplete="current-username"
            name="email"
            aria-invalid={Boolean(actionData?.form?.email?.error)}
            aria-errormessage={actionData?.form?.email?.error ? 'email-error' : undefined}
          />
          {actionData?.form?.email?.error ? (
            <ErrorText id="email-error">{actionData?.form?.email?.error}</ErrorText>
          ) : null}
        </div>
        <div className="w-full">
          <label htmlFor="password-input">Password:</label>
          <Input
            type="password"
            id="password-input"
            autoComplete="current-password"
            name="password"
            aria-invalid={Boolean(actionData?.form?.password?.error)}
            aria-errormessage={actionData?.form?.password?.error ? 'password-error' : undefined}
          />
          {actionData?.form?.password?.error ? (
            <ErrorText id="password-error">{actionData?.form?.password?.error}</ErrorText>
          ) : null}
        </div>
        <Button type="submit" className="w-full" isPrimary isLoading={!!transition.submission}>
          Log in
        </Button>
      </Form>
    </div>
  );
}
