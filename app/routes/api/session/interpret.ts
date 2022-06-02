import { ActionFunction, redirect } from '@remix-run/node';
import zod from 'zod';
import { matchByIntent } from '~/server/actions.server';
import { getPrivateEnvVars } from '~/server/env.server';
import { DialogFlowService } from '~/server/services/dialogflow.server';

const CmdFormData = zod.object({
  query: zod.string(),
  redirectTo: zod.string(),
});

export const action: ActionFunction = async ({ request }): Promise<Response> => {
  const formData = await request.formData();
  const cmdFormData = CmdFormData.safeParse(Object.fromEntries(formData));
  if (!cmdFormData.success) {
    return redirect('/');
  }
  const { query, redirectTo } = cmdFormData.data;
  console.log('user query');
  try {
    const { dialogflow } = getPrivateEnvVars();
    const dialogflowService = new DialogFlowService(
      dialogflow.projectId,
      dialogflow.privateKey,
      dialogflow.clientEmail,
    );
    const response = await dialogflowService.detectIntent(query);
    if (!response || !response[0].queryResult) {
      return redirect(redirectTo);
    }
    const queryResult = response[0].queryResult;
    const { fulfillmentText, intent } = queryResult;
    console.log(fulfillmentText, intent);
    if (!intent || !intent.displayName) {
      return redirect(redirectTo);
    }
    const action = matchByIntent(intent.displayName);
    if (!action) {
      return redirect(redirectTo);
    }
    if (action.form) {
      return redirect(action.form.route);
    }
    return redirect(
      `${redirectTo}?method=${action.fulfillment.method}&action=${encodeURIComponent(action.fulfillment.action)}`,
    );
  } catch (error) {
    console.error(error);
    return redirect(redirectTo);
  }
};
