import { useFetcher, useLocation } from '@remix-run/react';
import { createContext, useContext, useEffect } from 'react';
import { Action } from '~/server/actions.server';

type ActionsContext = {
  actions: Action[];
};

const ActionsContext = createContext<ActionsContext>({
  actions: [],
});

export const ActionsProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const fetcher = useFetcher<{ actions: Action[] }>();

  useEffect(() => {
    fetcher.load(`/api/session/recommend`);
  }, [location.pathname]);

  return <ActionsContext.Provider value={{ actions: fetcher.data?.actions || [] }}>{children}</ActionsContext.Provider>;
};

export function useRecommendedActions() {
  return useContext(ActionsContext).actions;
}
