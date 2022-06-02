import { Form, useLocation } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { Button } from '~/UI/components/buttons';
import { Input } from '~/UI/components/input';

export const CommandLine = ({ className = '' }: { className?: string }) => {
  const location = useLocation();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.reset();
    }
  }, [location.pathname]);

  return (
    <Form
      ref={formRef}
      method="post"
      action="/api/session/interpret"
      className={`w-full flex gap-2 items-center ${className}`}
    >
      <h2 className="sr-only">Insert your command here</h2>
      <Input type="text" name="query" placeholder="Create new project" autoComplete="off" />
      <Input type="hidden" name="redirectTo" value={location.pathname} />
      <Button type="submit">Cmd</Button>
    </Form>
  );
};
