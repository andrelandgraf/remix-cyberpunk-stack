import { NavLink, NavLinkProps, FormProps, Form } from '@remix-run/react';
import { getFocusClasses } from '../aria';

export const FormLink = ({ children, className = '', ...props }: FormProps) => (
  <Form {...props} className={className}>
    <button
      type="submit"
      className={`${getFocusClasses(
        true,
      )} underline focus:no-underline underline-offset-4 decoration-4 transition-all hover:underline-offset-2 decoration-primary dark:decoration-primaryDark`}
    >
      {children}
    </button>
  </Form>
);

export const StyledNavLink = ({ children, className = '', ...props }: NavLinkProps) => {
  return (
    <NavLink
      {...props}
      className={({ isActive }) =>
        `${getFocusClasses(true)} underline focus:no-underline underline-offset-4 decoration-4 ${
          isActive
            ? 'pointer-events-none decoration-secondary'
            : 'transition-all hover:underline-offset-2 decoration-primary dark:decoration-primaryDark'
        }`
      }
    >
      {children}
    </NavLink>
  );
};
