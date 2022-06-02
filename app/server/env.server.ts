import invariant from 'tiny-invariant';

type NODE_ENVS = 'development' | 'production';

type PublicEnvVars = {
  NODE_ENV: NODE_ENVS;
};

type PrivateEnvVars = PublicEnvVars & {
  sessionSecret: string;
  dialogflow: {
    projectId: string;
    privateKey: string;
    clientEmail: string;
  };
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
  const dialogflowPrivateKey = process.env.DIALOGFLOW_PRIVATE_KEY;
  const dialogflowClientEmail = process.env.DIALOGFLOW_CLIENT_EMAIL;
  const dialogflowProjectId = process.env.DIALOGFLOW_PROJECT_ID;
  invariant(sessionSecret, 'SESSION_SECRET env variable must be set');
  invariant(dialogflowPrivateKey, 'DIALOGFLOW_PRIVATE_KEY env variable must be set');
  invariant(dialogflowClientEmail, 'DIALOGFLOW_CLIENT_EMAIL env variable must be set');
  invariant(dialogflowProjectId, 'DIALOGFLOW_PROJECT_ID env variable must be set');
  return {
    ...publicVars,
    sessionSecret,
    dialogflow: {
      projectId: dialogflowProjectId,
      privateKey: dialogflowPrivateKey,
      clientEmail: dialogflowClientEmail,
    },
  };
}
