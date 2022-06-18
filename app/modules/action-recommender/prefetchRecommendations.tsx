import { PrefetchPageLinks } from '@remix-run/react';
import { useRecommendedActions } from './actionsProvider';

export function PrefetchRecommendations() {
  const actions = useRecommendedActions();
  return actions ? (
    <>
      {actions.map((action) => (
        <PrefetchPageLinks key={action.intent} page={action.pathname} />
      ))}
    </>
  ) : null;
}
