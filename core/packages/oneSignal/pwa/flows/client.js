import { flow } from 'mobx-state-tree';

export default self =>
  flow(function* OneSignalClient() {
    // Exits if there's no settings or serviceWorker is not supported.
    if (!self.settings.theme.oneSignal || !('serviceWorker' in window.navigator)) return;

    yield self.notifications.load();
    if (self.notifications.areSupported) yield self.notifications.init();

    // Update SW if there's a new version
    if (
      window.localStorage.getItem('frontity.oneSignalSwVersion') !==
      self.notifications.oneSignalSwVersion
    ) {
      try {
        yield self.notifications.install();
        window.localStorage.setItem(
          'frontity.oneSignalSwVersion',
          self.notifications.oneSignalSwVersion,
        );
      } catch (error) {
        console.warn('SW install failed!'); // eslint-disable-line
      }
    }
  });
