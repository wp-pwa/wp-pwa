import { unprotect } from 'mobx-state-tree';
import OneSignal from '..';

let self;
beforeEach(() => {
  self = OneSignal.create(
    {},
    { notifications: { onLoad: () => Promise.resolve() } },
  );
  unprotect(self);

  Object.defineProperty(self, 'root', {
    writable: true,
    value: {
      settings: {
        theme: {
          oneSignal: {
            defaultNotificationUrl: 'https://demo.frontity.com',
            wordpress: true,
            appId: '00000000-1234-1234-1234-0000000077',
            autoRegister: true,
            welcomeNotification: {
              title: 'Subscription complete',
              message: 'You are subscribed!',
            },
            path: 'https://demo.frontity.com/onesignal/sdk_files/',
          },
        },
      },
    },
  });

  Object.defineProperty(self, 'load', {
    writable: true,
    value: jest.fn(self.load),
  });

  Object.defineProperty(self, 'init', {
    writable: true,
    value: jest.fn(self.init),
  });
});

describe('OneSignal', () => {
  test('load adds oneSignalSDK script and checks notifications support', async () => {
    const oneSignalSDK = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
    const oneSignalSDKSelector = `script[src="${oneSignalSDK}"]`;
    const isPushNotificationsSupported = jest.fn().mockReturnValue(true);
    window.OneSignal = { isPushNotificationsSupported };

    const loaded = await self.load();
    expect(window.document.querySelector(oneSignalSDKSelector)).not.toBeNull();

    await loaded;
    expect(self.areSupported).toBe(true);
  });

  test('init oneSignal', async () => {
    const init = jest.fn().mockResolvedValue();
    const setDefaultNotificationUrl = jest.fn();
    const isPushNotificationsEnabled = jest.fn().mockResolvedValue(true);
    const on = jest.fn();

    window.OneSignal = {
      init,
      setDefaultNotificationUrl,
      isPushNotificationsEnabled,
      on,
    };

    await self.init();

    expect(setDefaultNotificationUrl).toHaveBeenCalled();
    expect(setDefaultNotificationUrl.mock.calls[0]).toMatchSnapshot();
    expect(init).toHaveBeenCalled();
    expect(init.mock.calls[0]).toMatchSnapshot();
    expect(isPushNotificationsEnabled).toHaveBeenCalled();
    expect(on.mock.calls).toMatchSnapshot();
  });

  test('toggleEnabled enables notifications', async () => {
    const getNotificationPermission = jest.fn().mockResolvedValue('allow');
    const registerForPushNotifications = jest.fn();
    const setSubscription = jest.fn().mockResolvedValue();

    window.OneSignal = {
      getNotificationPermission,
      registerForPushNotifications,
      setSubscription,
    };

    await self.toggleEnabled();
    expect(registerForPushNotifications).toHaveBeenCalled();
    expect(setSubscription).toHaveBeenCalledWith(true);
    expect(self.areEnabled).toBe(true);
  });

  test('toggleEnabled does not enable notifications', async () => {
    const getNotificationPermission = jest.fn().mockResolvedValue('denied');
    const registerForPushNotifications = jest.fn();
    const setSubscription = jest.fn().mockResolvedValue();

    window.OneSignal = {
      getNotificationPermission,
      registerForPushNotifications,
      setSubscription,
    };

    await self.toggleEnabled();
    expect(registerForPushNotifications).not.toHaveBeenCalled();
    expect(setSubscription).not.toHaveBeenCalled();
    expect(self.areEnabled).toBe(false);
  });

  test('toggleEnabled disable notifications', async () => {
    const setSubscription = jest.fn().mockResolvedValue();

    window.OneSignal = { setSubscription };
    self.areEnabled = true;

    await self.toggleEnabled();
    expect(setSubscription).toHaveBeenCalledWith(false);
    expect(self.areEnabled).toBe(false);
  });

  test('afterCsr does not execute load if no settings are defined', async () => {
    Object.defineProperty(self, 'settings', {
      writable: true,
      value: undefined,
    });

    await self.afterCsr();

    expect(self.load).not.toHaveBeenCalled();
  });

  test('afterCsr execute load but not init if notifications are not supported', async () => {
    Object.defineProperties(self, {
      areSupported: {
        writable: true,
        value: false,
      },
      load: {
        writable: true,
        value: jest.fn(() => Promise.resolve()),
      },
      init: {
        writable: true,
        value: jest.fn(() => Promise.resolve()),
      },
    });

    await self.afterCsr();

    expect(self.load).toHaveBeenCalled();
    expect(self.init).not.toHaveBeenCalled();
  });

  test('afterCsr execute load and init', async () => {
    Object.defineProperties(self, {
      areSupported: {
        writable: true,
        value: true,
      },
      load: {
        writable: true,
        value: jest.fn(() => Promise.resolve()),
      },
      init: {
        writable: true,
        value: jest.fn(() => Promise.resolve()),
      },
    });

    await self.afterCsr();

    expect(self.load).toHaveBeenCalled();
    expect(self.init).toHaveBeenCalled();
  });
});
