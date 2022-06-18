export async function sendSlackMessage(webhook: string, message: string) {
  try {
    console.debug('sending slack...');
    await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: message }),
    });
    console.debug('slack sent!');
  } catch (error) {
    console.error(error);
  }
}
