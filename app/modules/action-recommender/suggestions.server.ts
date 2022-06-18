import { Action, matchByIntent } from '~/server/actions.server';
import { db } from '~/server/db.server';

async function fetchLastTwoIntents(trackingId: string) {
  const sessionEvents = await db.event.findMany({ where: { trackingId } });
  const sortedEvents = sessionEvents.sort((a, b) => a.createdAt.valueOf() - b.createdAt.valueOf());
  const lastTwoEvents = sortedEvents.slice(-2); // get last two events
  return lastTwoEvents.map((event) => event.intent);
}

function getBestThree(predictionsMap: Record<string, number>): Action[] {
  const predictions = Object.entries(predictionsMap);
  if (!predictions.length) return [];
  const sortedPredictions = predictions.sort((a, b) => b[1] - a[1]);
  const bestThree = sortedPredictions.slice(0, 3);
  const actions: Action[] = [];
  bestThree.forEach(([intent, count]) => {
    const action = matchByIntent(intent);
    if (action) actions.push(action);
  });
  return actions;
}

function addToPredictionMap(predictionMap: Record<string, number>, intent: string) {
  if (predictionMap[intent]) {
    predictionMap[intent] += 1;
  } else {
    predictionMap[intent] = 1;
  }
}

function recommendFirstActions(intentsMap: Record<string, string[]>): Action[] {
  const predictionsMap: Record<string, number> = {};
  Object.keys(intentsMap).forEach((trackingId) => {
    const intents = intentsMap[trackingId];
    const firstIntent = intents[0];
    addToPredictionMap(predictionsMap, firstIntent);
  });
  return getBestThree(predictionsMap);
}

function recommendSecondActions(intentsMap: Record<string, string[]>, prevIntent: string): Action[] {
  const predictionsMap: Record<string, number> = {};
  Object.keys(intentsMap).forEach((trackingId) => {
    const intents = intentsMap[trackingId];
    for (let i = 0; i < intents.length - 1; i++) {
      const intent = intents[i];
      if (intent === prevIntent) {
        const nextIntent = intents[i + 1];
        addToPredictionMap(predictionsMap, nextIntent);
      }
    }
  });
  return getBestThree(predictionsMap);
}

function recommendNextActions(
  intentsMap: Record<string, string[]>,
  prevIntent: string,
  prevPrevIntent: string,
): Action[] {
  const predictionsMap: Record<string, number> = {};
  Object.keys(intentsMap).forEach((trackingId) => {
    const intents = intentsMap[trackingId];
    for (let i = 0; i < intents.length - 2; i++) {
      const intent = intents[i];
      if (intent === prevPrevIntent && intent[i + 1] === prevIntent) {
        const nextIntent = intents[i + 2];
        addToPredictionMap(predictionsMap, nextIntent);
      }
    }
  });
  return getBestThree(predictionsMap);
}

export async function recommendActions(trackingId: string): Promise<Action[]> {
  const prevIntents = await fetchLastTwoIntents(trackingId);
  const events = await db.event.findMany();
  const sortedEvents = events.sort((a, b) => a.createdAt.valueOf() - b.createdAt.valueOf());
  const eventMap: Record<string, string[]> = {};
  sortedEvents.forEach((event) => {
    if (!eventMap[event.trackingId]) {
      eventMap[event.trackingId] = [];
    }
    eventMap[event.trackingId].push(event.intent);
  });
  if (!prevIntents.length) {
    return recommendFirstActions(eventMap);
  }
  if (prevIntents.length === 1) {
    return recommendSecondActions(eventMap, prevIntents[0]);
  }
  const actions = recommendNextActions(eventMap, prevIntents[1], prevIntents[0]);
  if (!actions.length) {
    return recommendSecondActions(eventMap, prevIntents[0]);
  }
  return actions;
}
