import { Outlet } from '@remix-run/react';
import { H1 } from '~/UI/components/headings';
import { StyledNavLink, FormLink } from '~/UI/components/link';
import { useUser } from '~/hooks/useMatchesData';
import { CommandLine } from '~/modules/cmd-ctr-line/commandLine';
import { useIntentHandler } from '~/modules/cmd-ctr-line/useIntentHandler';

export default function Layout() {
  useIntentHandler();
  const user = useUser();
  return (
    <div className="w-screen min-h-screen bg-background dark:bg-backgroundDark dark:text-white font-cyberpunk">
      <header className="text-lg p-5 lg:p-8  w-full flex flex-col gap-5">
        <div className="w-full flex gap-5 lg:gap-10 items-center">
          <H1 className="whitespace-nowrap">Remix Cyberpunk Stack</H1>
          <nav className="w-full">
            <ul className="w-full flex gap-5 items-center">
              <li>
                <StyledNavLink to="/" end>
                  Home
                </StyledNavLink>
              </li>
              {!!user && (
                <li>
                  <StyledNavLink to="/projects" end>
                    Projects
                  </StyledNavLink>
                </li>
              )}
              {!!user ? (
                <li className="ml-auto mr-5">
                  <FormLink action="api/session/logout" method="post">
                    Logout
                  </FormLink>
                </li>
              ) : (
                <>
                  <li className="ml-auto">
                    <StyledNavLink to="/login" end>
                      Login
                    </StyledNavLink>
                  </li>
                  <li className="mr-5">
                    <StyledNavLink to="/signup" end>
                      Signup
                    </StyledNavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
        <CommandLine className="m-auto max-w-md" />
      </header>
      <main className="pt-20">
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
}
