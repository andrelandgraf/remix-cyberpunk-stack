import { H3 } from '~/UI/components/headings';
import { StyledNavLink } from '~/UI/components/link';
import { useRecommendedActions } from './actionsProvider';

export function ActionsPicker() {
  const actions = useRecommendedActions();
  return actions && actions.length ? (
    <div className="w-full flex items-center justify-center gap-2">
      <H3>Quick: </H3>
      <ul className="flex flex-row items-center justify-center gap-2">
        {actions.map((action) => (
          <li key={action.intent}>
            <StyledNavLink to={action.pathname}>{action.intent}</StyledNavLink>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
}
