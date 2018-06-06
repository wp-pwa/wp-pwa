import { flow } from 'mobx-state-tree';

export default self =>
  flow(function* OneSignalClient() {
    // Gets OneSignal settings configured in database
    if (!self.settings.theme.oneSignal) return;

    // Exits if OneSignal is not supported for current browser.
    yield self.notifications.load();
    if (!self.notifications.areSupported) return;

    yield self.notifications.init();

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
