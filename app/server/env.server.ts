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
  slack: {
    isEnabled: boolean;
    webhook: string;
  };
};

function isNODE_ENV(value: string | undefined): value is NODE_ENVS {
  return value === 'development' || value === 'production';
}

function isBoolean(value: string | undefined): boolean {
  return value === 'true' || value === 'false';
}

function parseBoolean(value: string | undefined): boolean {
  return value === 'true';
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
  const dialogflowPrivateKey = process.env.DIALOGFLOW_PRIVATE_KEY;
  const dialogflowClientEmail = process.env.DIALOGFLOW_CLIENT_EMAIL;
  const dialogflowProjectId = process.env.DIALOGFLOW_PROJECT_ID;
  invariant(dialogflowPrivateKey, 'DIALOGFLOW_PRIVATE_KEY env variable must be set');
  invariant(dialogflowClientEmail, 'DIALOGFLOW_CLIENT_EMAIL env variable must be set');
  invariant(dialogflowProjectId, 'DIALOGFLOW_PROJECT_ID env variable must be set');
  const slackIsEnabled = process.env.IS_SLACK_ENABLED;
  const slackWebhook = process.env.SLACK_WEBHOOK;
  invariant(isBoolean(slackIsEnabled), 'IS_SLACK_ENABLED env variable must be a boolean');
  invariant(slackWebhook, 'SLACK_WEBHOOK env variable must be set');
  return {
    ...publicVars,
    sessionSecret,
    dialogflow: {
      projectId: dialogflowProjectId,
      privateKey: publicVars.NODE_ENV === 'production' ? JSON.parse(dialogflowPrivateKey) : dialogflowPrivateKey,
      clientEmail: dialogflowClientEmail,
    },
    slack: {
      isEnabled: parseBoolean(slackIsEnabled),
      webhook: slackWebhook,
    },
  };
}
