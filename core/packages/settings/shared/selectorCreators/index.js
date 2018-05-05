export const getSettings = namespace => state => state.settings.collection[namespace];
export const getSetting = (namespace, setting) => state =>
  state.settings.collection[namespace][setting];
