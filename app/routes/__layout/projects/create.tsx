import zod from 'zod';
import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/node';
import { Form, useActionData, useTransition } from '@remix-run/react';
import { Button } from '~/UI/components/buttons';
import { H2 } from '~/UI/components/headings';
import { ErrorText, Input } from '~/UI/components/input';
import { requireUserId } from '~/server/session.server';
import { db } from '~/server/db.server';
import { useRequiredUser } from '~/hooks/useMatchesData';
import { getTrackingId, trackEvent } from '~/modules/event-tracking/session.server';
import { actions } from '~/server/actions.server';

const minProjectNameSize = 3;
const maxProjectNameSize = 255;
const ProjectFormData = zod.object({
  name: zod
    .string({
      invalid_type_error: 'Must be a valid email address',
      required_error: 'Name is required',
    })
    .min(minProjectNameSize, {
      message: `Name must be at least ${minProjectNameSize} characters`,
    })
    .max(maxProjectNameSize, {
      message: `Name must be at most ${maxProjectNameSize} characters`,
    }),
  userId: zod.string(),
});

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return {};
};

type ActionData = {
  form: {
    error: string;
    name: {
      error: string | null;
    };
  };
};

function errorJson(headers: Headers | undefined, error: string, nameError?: string): Response {
  const data: ActionData = {
    form: {
      error,
      name: {
        error: nameError || null,
      },
    },
  };
  return json(data, { headers });
}

export const action: ActionFunction = async ({ request }): Promise<ActionData | Response> => {
  const [trackingId, headers] = await getTrackingId(request);
  try {
    const reqClone = await request.clone();
    const userId = await requireUserId(reqClone);
    trackEvent(trackingId, actions.createProject.intent);
    const formData = await request.formData();
    const loginFormData = ProjectFormData.safeParse(Object.fromEntries(formData));
    if (!loginFormData.success) {
      console.debug('ProjectFormData.safeParse failed', loginFormData);
      return errorJson(
        headers,
        'There are some errors. Please review all fields again.',
        loginFormData.error.formErrors.fieldErrors.name?.join(', '),
      );
    }
    const { name, userId: formUserId } = loginFormData.data;
    if (userId !== formUserId) {
      return errorJson(headers, 'You are not authorized to create this project.');
    }
    const project = await db.project.create({
      data: { name, userId },
    });
    return redirect(`/projects/${project.id}`, { headers });
  } catch (error) {
    console.error(error);
    return errorJson(headers, 'Something went wrong, please try again.');
  }
};

export default function CreateProject() {
  const actionData = useActionData();
  const transition = useTransition();
  const user = useRequiredUser();
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Form method="post" className="w-full md:max-w-sm flex flex-col gap-5 items-center justify-center">
        <H2 className="text-center">Create Project</H2>
        {actionData?.form?.error && <ErrorText>{actionData.form.error}</ErrorText>}
        <input type="hidden" name="userId" value={user.id} />
        <div className="w-full">
          <label htmlFor="name-input">Name:</label>
          <Input
            type="text"
            id="name-input"
            name="name"
            autoComplete="off"
            placeholder="Build Mach 3"
            aria-invalid={Boolean(actionData?.form?.name?.error)}
            aria-errormessage={actionData?.form?.name?.error ? 'name-error' : undefined}
          />
          {actionData?.form?.name?.error ? (
            <ErrorText id="name-error">{actionData?.form?.name?.error}</ErrorText>
          ) : null}
        </div>
        <Button type="submit" className="w-full" isPrimary isLoading={!!transition.submission}>
          Create
        </Button>
      </Form>
    </div>
  );
}
