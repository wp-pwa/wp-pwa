/* eslint-disable no-console */
import { types, flow, getParent } from 'mobx-state-tree';

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
    oneSignalSwVersion: '2',
  })
  .views(self => ({
    get settings() {
      return getParent(self).settings.theme.oneSignal;
    },
  }))
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
    }),
    init: flow(function* initOneSignal() {
      window.OneSignal.setDefaultNotificationUrl(self.settings.defaultNotificationUrl);
      window.OneSignal.SERVICE_WORKER_UPDATER_PATH = 'OneSignalSDKUpdaterWorker.js.php';
      window.OneSignal.SERVICE_WORKER_PATH = 'OneSignalSDKWorker.js.php';
      window.OneSignal.SERVICE_WORKER_PARAM = { scope: '/' };

      try {
        yield window.OneSignal.init(Object.assign(defaultSettings, self.settings));
      } catch (error) {
        console.warn('Something was wrong while initializing OneSignal:\n', error);
      }

      self.areEnabled = yield window.OneSignal.isPushNotificationsEnabled();

      window.OneSignal.on('notificationPermissionChange', permissionChange => {
        if (permissionChange.to === 'denied') self.disable();
      });
      window.OneSignal.on('customPromptClick', ({ result }) => {
        if (result === 'denied') self.disable();
      });
    }),
    install: flow(function* install() {
      yield window.navigator.serviceWorker.register(
        `${defaultSettings.path}${window.OneSignal.SERVICE_WORKER_UPDATER_PATH}?appId=${
          self.settings.appId
        }`,
        { scope: '/' },
      );
      yield new Promise(resolve => setTimeout(resolve, 1000));
      yield window.navigator.serviceWorker.register(
        `${defaultSettings.path}${window.OneSignal.SERVICE_WORKER_PATH}?appId=${
          self.settings.appId
        }`,
        { scope: '/' },
      );
    }),
    toggleEnabled: flow(function* toggleNotifications() {
      self.areEnabled = !self.areEnabled;

      if (self.areEnabled) {
        const permission = yield window.OneSignal.getNotificationPermission();
        if (permission === 'denied') {
          console.warn('Notifications denied in browser!');
          self.areEnabled = false;
          return;
        }
        window.OneSignal.registerForPushNotifications();
        yield window.OneSignal.setSubscription(true);
      } else {
        yield window.OneSignal.setSubscription(false);
      }
    }),
    disable() {
      self.areEnabled = false;
    },
  }));
