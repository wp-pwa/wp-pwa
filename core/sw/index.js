/* eslint-disable no-undef, no-restricted-globals */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

const serviceWorkerOptionAssets = serviceWorkerOption.assets || [];

const additionalFiles = preCacheFiles || [];

const entry = `${dynamicUrl}?siteId=${siteId}&type=${type}&id=${id}&dev=false&staticUrl=${encodeURIComponent(
  staticUrl,
)}&dynamicUrl=${encodeURIComponent(
  dynamicUrl,
)}&env=prod&perPage=${perPage}&device=mobile&initialUrl=${encodeURIComponent(initialUrl)}`;
const manifest = `${dynamicUrl}dynamic/wordcamp-theme/${siteId}/manifest.json`;

workbox.precaching.precacheAndRoute([
  ...serviceWorkerOptionAssets
    .filter(asset => !/^\/bootstrap\.js$/.test(asset))
    .map(asset => `${staticUrl}static${asset}`),
  ...additionalFiles,
]);

const frontityStrategy = workbox.strategies.networkFirst({
  cacheName: 'frontity',
  networkTimeoutSeconds: 30,
  plugins: [
    new workbox.expiration.Plugin({
      maxEntries: 60,
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
    }),
  ],
});

const wordpressStrategy = workbox.strategies.networkFirst({
  cacheName: 'wordpress',
  networkTimeoutSeconds: 30,
  plugins: [
    new workbox.expiration.Plugin({
      maxEntries: 60,
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
    }),
    new workbox.cacheableResponse.Plugin({
      statuses: [200],
    }),
  ],
});

const manifestStrategy = workbox.strategies.networkFirst({
  cacheName: 'manifest',
  networkTimeoutSeconds: 30,
  plugins: [
    new workbox.expiration.Plugin({
      maxEntries: 60,
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
    }),
    new workbox.cacheableResponse.Plugin({
      statuses: [200],
    }),
  ],
});

self.addEventListener('install', event => {
  frontityStrategy.makeRequest({ event, request: entry });
  wordpressStrategy.makeRequest({ event, request: initialUrl });
  manifestStrategy.makeRequest({ event, request: manifest });
});

workbox.routing.registerRoute(
  ({ url }) => new RegExp(`siteId=${siteId}`).test(url.href),
  frontityStrategy,
);

workbox.routing.registerRoute(
  ({ url }) => new RegExp(`${siteId}/manifest.json$`).test(url.href),
  manifestStrategy,
);

workbox.routing.registerRoute(
  ({ event }) => event.request.mode === 'navigate',
  args =>
  wordpressStrategy.handle(args).then(response => (!response ? caches.match('/') : response)),
);

workbox.routing.registerRoute(
  ({ url }) => /\.(?:png|gif|jpg|jpeg|svg)/.test(url.href),
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  /rest_route=/,
  workbox.strategies.networkFirst({
    cacheName: 'wp-api',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
);
