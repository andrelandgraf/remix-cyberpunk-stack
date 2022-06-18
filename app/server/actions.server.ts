export type Action = {
  intent: string;
  pathname: string;
  fulfillment?: {
    fulfill?: boolean;
    method: string;
    action: string;
  };
};

export enum ActionIds {
  login = 'login',
  logout = 'logout',
  signup = 'signup',
  viewProject = 'viewProject',
  viewProjects = 'viewProjects',
  createProject = 'createProject',
  createTask = 'createTask',
  deleteTask = 'deleteTask',
}

export const actions: Record<ActionIds, Action> = {
  login: {
    intent: 'Login',
    pathname: '/login',
    fulfillment: {
      action: '/login',
      method: 'post',
    },
  },
  signup: {
    intent: 'Signup',
    pathname: '/signup',
    fulfillment: {
      action: '/signup',
      method: 'post',
    },
  },
  logout: {
    intent: 'Logout',
    pathname: '/',
    fulfillment: {
      fulfill: true,
      action: '/api/session/logout',
      method: 'post',
    },
  },
  viewProjects: {
    intent: 'View Projects',
    pathname: '/projects',
  },
  createProject: {
    intent: 'Create Project',
    pathname: '/projects/create',
    fulfillment: {
      action: '/projects/create',
      method: 'post',
    },
  },
  viewProject: {
    intent: 'View Project',
    pathname: '/projects/$id',
  },
  createTask: {
    intent: 'Create Task',
    pathname: '/projects/$id',
    fulfillment: {
      action: '/projects/$id',
      method: 'post',
    },
  },
  deleteTask: {
    intent: 'Delete Task',
    pathname: '/projects/$id',
    fulfillment: {
      action: '/projects/$id',
      method: 'delete',
    },
  },
};

export function matchByIntent(intent: string) {
  const action = Object.values(actions).find((a) => a.intent === intent);
  return action;
}
