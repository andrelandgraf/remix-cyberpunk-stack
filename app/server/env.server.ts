import invariant from 'tiny-invariant';

type NODE_ENVS = 'development' | 'production';

type PublicEnvVars = {
  NODE_ENV: NODE_ENVS;
};

type PrivateEnvVars = PublicEnvVars & {
  sessionSecret: string;
};

function isNODE_ENV(value: string | undefined): value is NODE_ENVS {
  return value === 'development' || value === 'production';
}

export function getPublicEnvVars(): PublicEnvVars {
  const NODE_ENV = process.env.NODE_ENV;
  invariant(isNODE_ENV(NODE_ENV), `NODE_ENV value ${NODE_ENV} not supported.`);
  return {
    NODE_ENV,
  };
}

export function getPrivateEnvVars(): PrivateEnvVars {
  const publicVars = getPublicEnvVars();
  const sessionSecret = process.env.SESSION_SECRET;
  invariant(sessionSecret, 'SESSION_SECRET env variable must be set');
  return {
    ...publicVars,
    sessionSecret,
  };
}
