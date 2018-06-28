/* eslint-disable import/prefer-default-export */
import { getRoot } from 'mobx-state-tree';

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
