/* eslint-disable no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

const serviceWorkerOptionAssets = serviceWorkerOption.assets || [];

const additionalFiles = preCacheFiles || [];

const entry = `${dynamicUrl}?siteId=${siteId}&type=${type}&id=${id}&dev=false&staticUrl=${encodeURIComponent(
  staticUrl,
)}&dynamicUrl=${encodeURIComponent(
  dynamicUrl,
)}&env=prod&perPage=${perPage}&device=mobile&initialUrl=${encodeURIComponent(initialUrl)}`;

workbox.precaching.precacheAndRoute([
  ...serviceWorkerOptionAssets
    .filter(asset => !/^\/bootstrap\.js$/.test(asset))
    .map(asset => `${staticUrl}static${asset}`),
  ...additionalFiles,
  { url: initialUrl, revision: __webpack_hash__ },
  { url: entry, revision: __webpack_hash__ },
]);

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
