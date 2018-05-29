/* eslint-disable no-console */
import { types, flow } from 'mobx-state-tree';

const defaultSettings = {
  path: '/wp-content/plugins/onesignal-free-web-push-notifications/sdk_files/',
  wordpress: true,
  autoRegister: false,
  allowLocalhostAsSecureOrigin: true,
  httpPermissionRequest: { enable: true },
  notifyButton: { enable: false },
};

export default types
  .model('OneSignal')
  .props({
    areSupported: false,
    areEnabled: false,
    areRegistered: false,
  })
  // .views(self => ({}))
  .actions(self => ({
    load: flow(function* loadOneSignal() {
      // Load OneSignal SDK
      const oneSignalSDK = window.document.createElement('script');
      oneSignalSDK.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
      oneSignalSDK.async = 'async';
      window.document.head.appendChild(oneSignalSDK);

      // Returns if push notifications are supported.
      self.areSupported = yield new Promise(resolve => {
        window.OneSignal = window.OneSignal || [];
        window.OneSignal.push(() => {
          const supported = window.OneSignal.isPushNotificationsSupported();
          resolve(supported);
        });
      });

      console.log('ONE SIGNAL LOADED');
    }),
    init: flow(function* initOneSignal({ defaultNotificationUrl, ...customSettings }) {
      window.OneSignal.setDefaultNotificationUrl(defaultNotificationUrl);
      window.OneSignal.SERVICE_WORKER_UPDATER_PATH = 'OneSignalSDKUpdaterWorker.js.php';
      window.OneSignal.SERVICE_WORKER_PATH = 'OneSignalSDKWorker.js.php';
      window.OneSignal.SERVICE_WORKER_PARAM = { scope: '/' };

      yield window.OneSignal.init(Object.assign(defaultSettings, customSettings)).catch(e => {
        console.warn('Something was wrong while initializing OneSignal:\n', e);
      });

      self.areRegistered = !!(yield window.OneSignal.getUserId());
      self.areEnabled = yield window.OneSignal.isPushNotificationsEnabled();

      console.log('ONE SIGNAL INITIALIZED');
    }),
    toggleEnabled: flow(function* toggleNotifications() {
      // Changes enabled status
      self.areEnabled = !self.areEnabled;
      if (self.areEnabled) {
        // It was enabled, so...
        const permission = yield window.OneSignal.getNotificationPermission();
        if (permission === 'denied') {
          console.warn('Notifications denied in browser!');
          self.areEnabled = false;
          return;
        }

        if (!self.areRegistered) {
          window.OneSignal.registerForPushNotifications();
        } else {
          window.OneSignal.setSubscription(true);
        }
      } else {
        // It was disabled, so...
        yield window.OneSignal.setSubscription(false);
      }
    }),
  }));
