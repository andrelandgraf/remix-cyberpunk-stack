import { useFetcher, useSearchParams, FormMethod, useNavigate } from '@remix-run/react';
import { useEffect } from 'react';

function isMethod(method: string | null): method is FormMethod {
  return method === 'get' || method === 'post' || method === 'delete' || method === 'put';
}

export function useIntentHandler() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const action = search.get('action');
  const method = search.get('method');
  useEffect(() => {
    if (action && isMethod(method)) {
      if (method === 'get') {
        navigate(action);
      } else {
        fetcher.submit({}, { method, action });
      }
    }
  }, [action, method]);
}
