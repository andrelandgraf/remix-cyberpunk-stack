import zod from 'zod';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { Form, useActionData, useTransition } from '@remix-run/react';
import { Button } from '~/UI/components/buttons';
import { H2 } from '~/UI/components/headings';
import { ErrorText, Input } from '~/UI/components/input';
import { createUserSession, getUser, register } from '~/server/session.server';

const minPasswordSize = 8;
const minNameSize = 3;
const maxStringSize = 255;
const LoginFormData = zod.object({
  email: zod
    .string({
      invalid_type_error: 'Must be a valid email address',
      required_error: 'Email is required',
    })
    .email({
      message: 'Must be a valid email address',
    }),
  name: zod
    .string({
      invalid_type_error: 'Must be a valid name',
      required_error: 'Name is required',
    })
    .min(minNameSize, {
      message: 'Name must be at least 3 characters',
    })
    .max(maxStringSize, {
      message: 'Name must be at most 255 characters',
    }),
  password: zod
    .string({
      invalid_type_error: 'Must be a valid password',
      required_error: 'Password is required',
    })
    .min(minPasswordSize, {
      message: `Password must be at least ${minPasswordSize} characters`,
    })
    .max(maxStringSize, {
      message: `Password must be at most ${maxStringSize} characters`,
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
    name: {
      error: string | null;
    };
    password: {
      error: string | null;
    };
  };
};

function errorJson(error: string, nameError?: string, emailError?: string, passwordError?: string): ActionData {
  return {
    form: {
      error,
      name: {
        error: nameError || null,
      },
      email: {
        error: emailError || null,
      },
      password: {
        error: passwordError || null,
      },
    },
  };
}

export const action: ActionFunction = async ({ request }): Promise<ActionData | Response> => {
  try {
    const formData = await request.formData();
    const loginFormData = LoginFormData.safeParse(Object.fromEntries(formData));
    if (!loginFormData.success) {
      console.debug('LoginFormData.safeParse failed', loginFormData);
      return errorJson(
        'There are some errors. Please review all fields again.',
        loginFormData.error.formErrors.fieldErrors.name?.join(', '),
        loginFormData.error.formErrors.fieldErrors.email?.join(', '),
        loginFormData.error.formErrors.fieldErrors.password?.join(', '),
      );
    }
    const { email, password, name } = loginFormData.data;
    const signupData = await register({ email, name, password });
    if (!signupData) return errorJson('User already exists');
    return createUserSession(signupData.id, '/projects');
  } catch (error) {
    console.log(error);
    return errorJson('Something went wrong, please try again.');
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
          <label htmlFor="name-input">Name:</label>
          <Input
            type="text"
            id="name-input"
            autoComplete="name"
            name="name"
            placeholder="Tony Stark"
            aria-invalid={Boolean(actionData?.form?.name?.error)}
            aria-errormessage={actionData?.form?.name?.error ? 'name-error' : undefined}
          />
          {actionData?.form?.name?.error ? (
            <ErrorText id="name-error">{actionData?.form?.name?.error}</ErrorText>
          ) : null}
        </div>
        <div className="w-full">
          <label htmlFor="email-input">Email:</label>
          <Input
            type="text"
            id="email-input"
            autoComplete="current-username"
            name="email"
            placeholder="tony.stark@starkindustries.com"
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
