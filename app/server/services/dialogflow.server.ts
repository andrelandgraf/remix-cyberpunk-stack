import { SessionsClient } from '@google-cloud/dialogflow';
import { randomUUID } from 'crypto';

export class DialogFlowService {
  locale: string;
  projectId: string;
  sessionClient: SessionsClient;

  constructor(projectId: string, privateKey: string, clientEmail: string, locale = 'en-US') {
    this.projectId = projectId;
    this.locale = locale;

    const config = {
      credentials: {
        private_key: privateKey,
        client_email: clientEmail,
      },
    };

    this.sessionClient = new SessionsClient(config);
  }

  async detectIntent(textMessage: string, sessionId?: string) {
    let _sessionId = sessionId;
    if (!_sessionId) {
      _sessionId = randomUUID();
    }

    // Define session path
    const sessionPath = this.sessionClient.projectAgentSessionPath(this.projectId, _sessionId);
    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: textMessage,
          languageCode: this.locale,
        },
      },
    };
    try {
      return this.sessionClient.detectIntent(request);
    } catch (err) {
      console.error('DialogFlow.sendTextMessageToDialogFlow ERROR:', err);
      throw err;
    }
  }
}
