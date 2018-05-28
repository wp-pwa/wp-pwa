/* eslint-disable no-console */
import { types, flow } from 'mobx-state-tree';

const OneSignal = types
  .model('OneSignal')
  .props({
    isSupported: true,
    isEnabled: false,
    isRegistered: true,
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
      self.isSupported = yield new Promise(resolve => {
        window.OneSignal = window.OneSignal || [];
        window.OneSignal.push(() => {
          const supported = window.OneSignal.isPushNotificationsSupported();
          resolve({ supported });
        });
      });
    }),
    init: flow(function* initOneSignal({ defaultNotificationUrl, ...customSettings }) {
      window.OneSignal.SERVICE_WORKER_UPDATER_PATH = 'OneSignalSDKUpdaterWorker.js.php';
      window.OneSignal.SERVICE_WORKER_PATH = 'OneSignalSDKWorker.js.php';
      window.OneSignal.SERVICE_WORKER_PARAM = { scope: '/' };

      window.OneSignal.setDefaultNotificationUrl(defaultNotificationUrl); // from settings

      const defaultSettings = {
        path: '/wp-content/plugins/onesignal-free-web-push-notifications/sdk_files/',
        wordpress: true,
        autoRegister: false,
        allowLocalhostAsSecureOrigin: true,
        httpPermissionRequest: { enable: true },
        notifyButton: { enable: false },
      };

      yield window.OneSignal.init(Object.assign(defaultSettings, customSettings));

      self.isRegistered = !!(yield window.OneSignal.getRegistrationId());
      self.isEnabled = self.isRegistered && (yield window.OneSignal.isPushNotificationsEnabled());

      // Tracks changes in OneSignal subscription
      window.OneSignal.on('subscriptionChange', isSubscribed => {
        self.isSubscribed = isSubscribed; // WUT
      });
    }),
    requestNotifications() {
      if (!self.isRegistered) {
        window.OneSignal.push(['setSubscription', false]);
        window.OneSignal.push(['setSubscription', true]);
        window.OneSignal.push(['registerForPushNotifications']);
      } else {
        window.OneSignal.push(['setSubscription', false]);
        window.OneSignal.push(['setSubscription', true]);
      }
    },
    enableNotifications() {},
    disableNotifications() {
      if (!self.registered) window.OneSignal.push(['setSubscription', false]);
    },
  }));

export default OneSignal;
