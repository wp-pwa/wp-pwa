import { types } from 'mobx-state-tree';
import Build from '../build';

const defaultProps = {
  siteId: 'xxx',
  channel: 'pwa',
  device: 'mobile',
  rendering: 'ssr',
  packages: {},
  perPage: 10,
  dynamicUrl: 'https://www.example.com',
  staticUrl: 'https://www.example.com',
};
const Stores = types.model().props({ build: Build });

describe('Core › Build', () => {
  test('general snapshot', () => {
    const { build } = Stores.create({ build: { ...defaultProps } });
    expect(build).toMatchSnapshot();
  });
  test('channel pwa', () => {
    const { build } = Stores.create({
      build: { ...defaultProps, channel: 'pwa' },
    });
    expect(build.isPwa).toBe(true);
    expect(build.isAmp).toBe(false);
    expect(build.isChannel('pwa')).toBe(true);
    expect(build.isChannel('amp')).toBe(false);
  });
  test('channel amp', () => {
    const { build } = Stores.create({
      build: { ...defaultProps, channel: 'amp' },
    });
    expect(build.isPwa).toBe(false);
    expect(build.isAmp).toBe(true);
    expect(build.isChannel('pwa')).toBe(false);
    expect(build.isChannel('amp')).toBe(true);
  });
  test('device mobile', () => {
    const { build } = Stores.create({
      build: { ...defaultProps, device: 'mobile' },
    });
    expect(build.isMobile).toBe(true);
    expect(build.isTablet).toBe(false);
    expect(build.isDesktop).toBe(false);
    expect(build.isDevice('mobile')).toBe(true);
  });
  test('device tablet', () => {
    const { build } = Stores.create({
      build: { ...defaultProps, device: 'tablet' },
    });
    expect(build.isMobile).toBe(false);
    expect(build.isTablet).toBe(true);
    expect(build.isDesktop).toBe(false);
    expect(build.isDevice('tablet')).toBe(true);
  });
  test('device desktop', () => {
    const { build } = Stores.create({
      build: { ...defaultProps, device: 'desktop' },
    });
    expect(build.isMobile).toBe(false);
    expect(build.isTablet).toBe(false);
    expect(build.isDesktop).toBe(true);
    expect(build.isDevice('desktop')).toBe(true);
  });
  test('machine server', () => {
    const { build } = Stores.create(
      { build: defaultProps },
      { machine: 'server' },
    );
    expect(build.isClient).toBe(false);
    expect(build.isServer).toBe(true);
    expect(build.isMachine('server')).toBe(true);
  });
  test('machine client', () => {
    const { build } = Stores.create(
      { build: defaultProps },
      { machine: 'client' },
    );
    expect(build.isClient).toBe(true);
    expect(build.isServer).toBe(false);
    expect(build.isMachine('client')).toBe(true);
  });
  test('rendering ssr', () => {
    const { build } = Stores.create({
      build: { ...defaultProps, rendering: 'ssr' },
    });
    expect(build.isSsr).toBe(true);
    expect(build.isCsr).toBe(false);
    expect(build.isRendering('ssr')).toBe(true);
  });
  test('rendering csr', () => {
    const { build } = Stores.create({
      build: { ...defaultProps, rendering: 'csr' },
    });
    expect(build.isSsr).toBe(false);
    expect(build.isCsr).toBe(true);
    expect(build.isRendering('csr')).toBe(true);
  });
  test('switch rendering', () => {
    const { build } = Stores.create({
      build: { ...defaultProps, rendering: 'ssr' },
    });
    expect(build.isSsr).toBe(true);
    expect(build.isCsr).toBe(false);
    build.switchToCsr();
    expect(build.isSsr).toBe(false);
    expect(build.isCsr).toBe(true);
  });
  test('no initialUrl', () => {
    const { build } = Stores.create({ build: defaultProps });
    expect(build.initialUrl).toBeUndefined();
  });
  test('urlFromQuery is a complete url', () => {
    const { build } = Stores.create({
      build: { ...defaultProps, urlFromQuery: 'https://example.com/some-post' },
    });
    expect(build.initialUrl).toBe('https://example.com/some-post');
  });
  test('urlFromQuery is not a complete url', () => {
    const { build } = types
      .model()
      .props({
        build: Build,
        settings: types.frozen({
          generalSite: { url: 'https://www.example.com' },
        }),
      })
      .create({
        build: { ...defaultProps, urlFromQuery: '/some-post' },
      });
    expect(build.initialUrl).toBe('https://www.example.com/some-post');
  });
  test('urlFromQuery is not a complete url (slash)', () => {
    const { build } = types
      .model()
      .props({
        build: Build,
        settings: types.frozen({
          generalSite: { url: 'https://www.example.com/' },
        }),
      })
      .create({
        build: { ...defaultProps, urlFromQuery: '/some-post' },
      });
    expect(build.initialUrl).toBe('https://www.example.com/some-post');
  });
});
