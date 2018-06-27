import { flow, addMiddleware } from 'mobx-state-tree';

const customDimensionsMiddleware = analytics => (call, next) => {
  if (call.name === 'addEntity') {
    const [{ entity }] = call.args;
    analytics.addCustomDimensions(entity);
  }
  next(call);
};

export default self =>
  flow(function* AnalyticsServerFlow() {
    const { connection, analytics } = self;
    addMiddleware(connection, customDimensionsMiddleware(analytics));
    yield Promise.resolve();
  });
