import { flow } from 'mobx-state-tree';

export default self =>
  flow(function* OneSignalClient() {
    // Gets OneSignal settings configured in database
    const oneSignalSettings = self.settings.oneSignal;
    if (!oneSignalSettings) return;

    // Exits if OneSignal is not supported for current browser.
    yield self.oneSignal.load();
    if (!self.oneSignal.isSupported) return;

    yield self.oneSignal.init(oneSignalSettings);
  });
