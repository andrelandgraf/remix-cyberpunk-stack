import { NavLink } from '@remix-run/react';
import type { ReactElement } from 'react';
import { useUser } from '~/hooks/useMatchesData';

export const MainLayout = ({ children }: { children: ReactElement }) => {
  const user = useUser();
  return (
    <div>
      <header className="flex gap-10 items-center justify-center">
        <h1>Remix Cyberpunk Stack</h1>
        <nav className="flex gap-5 items-center justify-center">
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            {!!user && (
              <li>
                <NavLink to="/projects">Projects</NavLink>
              </li>
            )}
            {!!user ? (
              <li className="ml-auto mr-5">
                <NavLink to="/logout">Logout</NavLink>
              </li>
            ) : (
              <li className="ml-auto mr-5">
                <NavLink to="/login">Login</NavLink>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer></footer>
    </div>
  );
};
