import { Event } from '@prisma/client';
import { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '~/server/db.server';
import { H2 } from '~/UI/components/headings';

type LoaderData = {
  events: Array<Event>;
};

export const loader: LoaderFunction = async () => {
  const events = await db.event.findMany({});
  return { events };
};

export default function EventsPage() {
  const { events } = useLoaderData<LoaderData>();
  return (
    <div className="p-5 lg:p-8 flex flex-col gap-10">
      <H2>Events</H2>
      <ul className="flex flex-col gap-5">
        {events.map((event) => (
          <li key={event.id}>
            <b>{event.intent}</b>
            <br />
            {event.trackingId}
          </li>
        ))}
      </ul>
    </div>
  );
}
