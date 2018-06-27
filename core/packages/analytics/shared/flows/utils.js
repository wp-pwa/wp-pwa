export const asyncActionEnds = (name, callback) => {
  const runningActions = new Set();
  return (call, next) => {
    next(call);

    if (call.type === 'action' && call.name === name)
      runningActions.add(call.id);
    else if (
      ['flow_return', 'flow_throw'].includes(call.type) &&
      runningActions.has(call.parentId)
    ) {
      runningActions.delete(call.parentId);
      callback(call);
    }
  };
};

export const syncActionEnds = (name, callback) => (call, next) => {
  next(call);
  if (call.type === 'action' && call.name === name) callback(call);
};
