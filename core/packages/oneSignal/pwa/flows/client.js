import { flow } from 'mobx-state-tree';

export default self =>
  flow(function* OneSignalClient() {
    // Gets OneSignal settings configured in database
    const oneSignalSettings = self.settings.theme.oneSignal;
    if (!oneSignalSettings) return;

    // Exits if OneSignal is not supported for current browser.
    yield self.notifications.load();
    if (!self.notifications.areSupported) return;

    yield self.notifications.init(oneSignalSettings);
  });
