import { Project, Task } from '@prisma/client';
import zod from 'zod';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { Form, useActionData, useFetcher, useLoaderData, useTransition } from '@remix-run/react';
import { db } from '~/server/db.server';
import { requireUserId } from '~/server/session.server';
import { H2, H3 } from '~/UI/components/headings';
import { ErrorText, Input } from '~/UI/components/input';
import { Button } from '~/UI/components/buttons';
import invariant from 'tiny-invariant';

const minProjectNameSize = 3;
const maxProjectNameSize = 255;
const TaskFormData = zod.object({
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
  projectId: zod.string(),
});

type ActionData = {
  form: {
    success: boolean;
    error: string | null;
    name: {
      error: string | null;
    };
  };
};

function getActionData(error?: string, nameError?: string): ActionData {
  return {
    form: {
      success: !error,
      error: error || null,
      name: {
        error: nameError || null,
      },
    },
  };
}

async function handleCreateTask(formData: FormData) {
  const loginFormData = TaskFormData.safeParse(Object.fromEntries(formData));
  if (!loginFormData.success) {
    console.debug('TaskFormData.safeParse failed', loginFormData);
    return getActionData(
      'There are some errors. Please review all fields again.',
      loginFormData.error.formErrors.fieldErrors.name?.join(', '),
    );
  }
  const { name, projectId } = loginFormData.data;
  await db.task.create({
    data: { name, projectId },
  });
  return getActionData();
}

export const action: ActionFunction = async ({ request }): Promise<ActionData | Response> => {
  try {
    const reqClone = await request.clone();
    await requireUserId(reqClone);
    const formData = await request.formData();
    if (formData.get('intent') === 'create') {
      return handleCreateTask(formData);
    } else {
      const taskId = formData.get('taskId');
      invariant(typeof taskId === 'string', 'taskId must be a string');
      await db.task.delete({
        where: { id: taskId },
      });
      return getActionData();
    }
  } catch (error) {
    console.log(error);
    return getActionData('Something went wrong, please try again.');
  }
};

type LoaderData = {
  project: Project;
  tasks: Task[];
};

export const loader: LoaderFunction = async ({ request, params }): Promise<Response | LoaderData> => {
  const userId = await requireUserId(request);
  const project = await db.project.findUnique({
    where: { id: params.id },
  });
  if (!project || project.userId !== userId) {
    return redirect('/projects');
  }
  const tasks = await db.task.findMany({
    where: { projectId: project.id },
  });
  return { project, tasks };
};

export default function ProjectDetails() {
  const fetcher = useFetcher();
  const { project, tasks } = useLoaderData<LoaderData>();
  const actionData = useActionData();
  const transition = useTransition();

  return (
    <div className="p-5 lg:p-8 flex flex-col gap-10">
      <H2>{project.name}</H2>
      {Boolean(tasks.length) && (
        <section className="flex flex-col gap-5">
          <H3>Tasks</H3>
          <ul className="list-disc list-inside">
            {tasks.map((task) => (
              <li key={task.id} className="flex gap-2 items-center">
                {task.name}
                <input
                  type="checkbox"
                  name="taskId"
                  value={task.id}
                  className="crusor-pointer"
                  onClick={() =>
                    fetcher.submit(
                      {
                        intent: 'delete',
                        taskId: task.id,
                      },
                      { method: 'post' },
                    )
                  }
                />
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="flex flex-col gap-5">
        <H3>Add task</H3>
        <Form method="post" className="w-full md:max-w-sm flex flex-col gap-5 items-center justify-center">
          {actionData?.form?.error && <ErrorText>{actionData.form.error}</ErrorText>}
          <input type="hidden" name="projectId" value={project.id} />
          <div className="w-full">
            <label htmlFor="name-input">Name:</label>
            <Input
              type="text"
              id="name-input"
              name="name"
              autoComplete="off"
              placeholder="Find replacement for Palladium"
              aria-invalid={Boolean(actionData?.form?.name?.error)}
              aria-errormessage={actionData?.form?.name?.error ? 'name-error' : undefined}
            />
            {actionData?.form?.name?.error ? (
              <ErrorText id="name-error">{actionData?.form?.name?.error}</ErrorText>
            ) : null}
          </div>
          <Button
            type="submit"
            name="intent"
            value="create"
            className="w-full"
            isPrimary
            isLoading={!!transition.submission}
          >
            Create
          </Button>
        </Form>
      </section>
    </div>
  );
}
