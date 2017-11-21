# WP-PWA


## Development

Run `npm run start:pwa` to start the project in development mode.

Run `npm run build:pwa -- -p && npm start:pwa -- -p` to start the project in production mode.

Server starts in `http://localhost:3000` by default.

## Queries

You should pass some queries to configure the server.

### Site ID

Use `http://localhost:3000?siteId=XXX` to specify the site.

### SSR server

Use `http://localhost:3000?ssr=http://domain.com` to specify the SSR server.

### Static server

Use `http://localhost:3000?static=http://domain-static.com` to specify the Static server.

### Both SSR and Static

Use `http://localhost:3000?server=http://domain.com` to specify both the SSR and the Static servers.

If you don't pass any server, a dynamic path (`'/'`) will be used.

### Production/Preproduction

Use `http://localhost:3000?env=prod` to specify a `prod` (production) environment. If you don't pass it, then `pre` is used.

## Npm Scripts

### Development/Production
Default `NODE_ENV` is `development`.

This sets `NODE_ENV` to `production`:

`npm start:pwa -- --prod` or `npm start:pwa -- -p`

### Http/Https
Default Express server is `http://localhost:3000`.

This starts Express server on `https://localhost:3000`:

`npm start:pwa -- --https` or `npm start:pwa -- -s`

### Node Debug

This starts node in debug mode:

`npm start:pwa -- --debug` or `npm start:pwa -- -d`

### HMR in WordPress

This setting is for HMR only. You should use the `static` query to set the public path dynamically.

This sets Webpack's HMR path (`__webpack_hmr`) to `http://localhost:3000` or `https://localhost:3000` (depending on your http/https configuration):

`npm start:pwa -- --wp` or `npm start:pwa -- -w`

### HMR in custom url

This setting is for HMR only. You should use the `static` query to set the public path dynamically.

This sets Webpack's HMR path (`__webpack_hmr`) to a custom path:

`npm start:pwa -- --hmr https://ngrok.io/xxx`

### Analyze bundles

If you want to analyze the bundles, you can pass:

`npm start:pwa -- --analyze` or `npm start:pwa -- -a`

The output `html` files will be located in the `.build/pwa/(client|server)/analyze` folders.
