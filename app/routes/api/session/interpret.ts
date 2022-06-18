import { ActionFunction, redirect } from '@remix-run/node';
import zod from 'zod';
import { matchByIntent } from '~/server/actions.server';
import { getPrivateEnvVars } from '~/server/env.server';
import { DialogFlowService } from '~/modules/cmd-ctr-line/dialogflow.server';
import { sendSlackMessage } from '~/modules/slack-notifications/slack.server';

const CmdFormData = zod.object({
  query: zod.string(),
  redirectTo: zod.string(),
});

function logUsage(message: string) {
  const { slack } = getPrivateEnvVars();
  if (slack.isEnabled) {
    sendSlackMessage(slack.webhook, message);
  }
}

export const action: ActionFunction = async ({ request }): Promise<Response> => {
  const formData = await request.formData();
  const cmdFormData = CmdFormData.safeParse(Object.fromEntries(formData));
  if (!cmdFormData.success) {
    console.error("Couldn't parse form data");
    return redirect('/');
  }
  const { query, redirectTo } = cmdFormData.data;
  try {
    const { dialogflow } = getPrivateEnvVars();
    const dialogflowService = new DialogFlowService(
      dialogflow.projectId,
      dialogflow.privateKey,
      dialogflow.clientEmail,
    );
    const response = await dialogflowService.detectIntent(query);
    if (!response || !response[0].queryResult) {
      logUsage(`Dialog service failed for ${query}`);
      return redirect(redirectTo);
    }
    const queryResult = response[0].queryResult;
    const { intent } = queryResult;
    if (!intent || !intent.displayName) {
      logUsage(`Couldn't detect intent for query ${query}`);
      return redirect(redirectTo);
    }
    const action = matchByIntent(intent.displayName);
    if (!action) {
      logUsage(`Couldn't find action for intent ${intent.displayName} and query ${query}`);
      return redirect(redirectTo);
    }
    logUsage(`Detected intent ${action.intent} for query ${query}`);
    if (action.fulfillment && action.fulfillment.fulfill) {
      return redirect(
        `${redirectTo}?method=${action.fulfillment.method}&action=${encodeURIComponent(action.fulfillment.action)}`,
      );
    }
    return redirect(action.pathname);
  } catch (error) {
    logUsage(`Dialog service failed for ${query} with error ${error}`);
    console.error(error);
    return redirect(redirectTo);
  }
};
