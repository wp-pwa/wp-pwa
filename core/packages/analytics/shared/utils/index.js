import { getRoot } from 'mobx-state-tree';
import sha256 from 'crypto-js/sha256';
import base64 from 'crypto-js/enc-base64';

export const getTrackerName = id => `tracker_${id.replace(/-/g, '_')}`;

export const afterAction = (name, callback) => (call, next) => {
  next(call);
  if (call.type === 'action' && call.name === name) callback(call);
};

export const generateEvent = self => event => {
  const { connection } = getRoot(self);
  const type = `type: ${connection.selectedItem.type}`;
  const context = `context: ${connection.selectedContext.options.bar}`;

  const category = `PWA - ${event.category}`;
  const action = `PWA - ${event.action}`;
  const label = !event.label
    ? `${type} ${context}`
    : `${event.label} ${type} ${context}`;
  return {
    category,
    action,
    label,
  };
};

export const getHash = ({ site, type, id, page }) => {
  const data = JSON.stringify([site, type, id, page]);
  return base64.stringify(sha256(JSON.stringify(data))).slice(0, 19);
};
