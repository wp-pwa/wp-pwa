import { getRoot } from 'mobx-state-tree';
import sha256 from 'crypto-js/sha256';
import base64 from 'crypto-js/enc-base64';

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

export const getRoute = ({ page }) =>
  typeof page === 'number' ? 'list' : 'single';

export const getHash = (site, selectedItem) => {
  const { type, id, page } = selectedItem;
  const data = JSON.stringify([site, type, id, page]);
  return base64.stringify(sha256(JSON.stringify(data))).slice(0, 19);
};
