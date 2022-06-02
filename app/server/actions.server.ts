export const actions = [
  {
    intent: 'Login',
    form: {
      route: '/login',
      method: 'post',
    },
  },
  {
    intent: 'Signup',
    form: {
      route: '/signup',
      method: 'post',
    },
  },
  {
    intent: 'Logout',
    fulfillment: {
      method: 'post',
      action: '/api/session/logout',
    },
  },
  {
    intent: 'View Projects',
    fulfillment: {
      method: 'get',
      action: '/projects',
    },
  },
  {
    intent: 'Create Project',
    form: {
      route: '/projects/create',
      method: 'post',
    },
  },
];

export function matchByIntent(intent: string) {
  const action = actions.find((a) => a.intent === intent);
  return action;
}
