import { Project } from '@prisma/client';
import { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '~/server/db.server';
import { requireUserId } from '~/server/session.server';
import { ButtonLink } from '~/UI/components/buttons';
import { H2 } from '~/UI/components/headings';
import { StyledNavLink } from '~/UI/components/link';

type LoaderData = {
  projects: Project[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const projects = await db.project.findMany({
    where: { userId },
  });
  return { projects };
};

export default function Projects() {
  const { projects } = useLoaderData<LoaderData>();

  return (
    <div className="p-5 lg:p-8 flex flex-col gap-10">
      <H2>Your projects</H2>
      <ul className="flex flex-col gap-5">
        {projects.map((project) => (
          <li key={project.id}>
            <StyledNavLink to={`/projects/${project.id}`}>{project.name}</StyledNavLink>
          </li>
        ))}
      </ul>
      <ButtonLink to="/projects/create" isPrimary>
        Create new Project
      </ButtonLink>
    </div>
  );
}
