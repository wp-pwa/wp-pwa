/* eslint-disable no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

if (serviceWorkerOption.assets) {
  workbox.precaching.precacheAndRoute(
    serviceWorkerOption.assets.map(asset => `${staticUrl}/static${asset}`) || [],
  );
}

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
