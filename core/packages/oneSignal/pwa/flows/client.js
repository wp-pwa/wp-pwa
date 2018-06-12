import { flow } from 'mobx-state-tree';

export default self =>
  flow(function* OneSignalClient() {
    // Exits if there's no settings or serviceWorker is not supported.
    if (!self.settings.theme.oneSignal || !('serviceWorker' in window.navigator)) return;

    try {
      yield self.notifications.load();
      yield self.notifications.install();
    } catch (error) {
      console.warn('SW install failed!', error); // eslint-disable-line
    }
  });
