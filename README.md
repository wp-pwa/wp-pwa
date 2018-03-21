# WP-PWA


## Development

Run `npm run start:pwa` to start the project in development mode.

Run `npm run build:pwa -- -p && npm run serve:pwa -- -p` to start the project in production mode.

Server starts in `http://localhost:3000` by default.

## Queries

You should pass some queries to configure the server.

### Site ID

Use `http://localhost:3000?siteId=XXX` to specify the site.

### SSR server

Use `http://localhost:3000?ssrUrl=http://domain.com` to specify the SSR server.

### Static server

Use `http://localhost:3000?staticUrl=http://domain-static.com` to specify the Static server.

### Both SSR and Static

Use `http://localhost:3000?server=http://domain.com` to specify both the SSR and the Static servers.

If you don't pass any server, a dynamic path (`'/'`) will be used.

### Production/Preproduction

Use `http://localhost:3000?env=prod` to specify a `prod` (production) environment. If you don't pass it, then `pre` is used.

## Npm Scripts

### Mode: pwa/amp

This sets `MODE` to `pwa`:

`npm run start:pwa`

And this sets `MODE` to `amp`:

`npm run start:amp`

You can also pass `--pwa` or `--amp` to `npm run start`:

`npm run start -- --pwa` or `npm run start -- --amp`

You can also set `MODE=amp` or `MODE=pwa` in the environment variables.

### Env: development/production
Default `NODE_ENV` is `development`.

This sets `NODE_ENV` to `production`:

`npm run start:pwa -- --prod` or `npm run start:pwa -- -p`

### Server: http/https
Default Express server is `http://localhost:3000`.

This starts Express server on `https://localhost:3000`:

`npm run start:pwa -- --https` or `npm run start:pwa -- -s`

### Debug

This starts node in debug mode:

`npm run start:pwa -- --debug` or `npm run start:pwa -- -d`

### Port

Default Express port is `3000`.

This starts the server in a different port:

`npm run start:pwa -- --port XXXX`

### HMR (WordPress)

This setting is for HMR only. You should use the `static` query to set the public path dynamically.

This sets Webpack's HMR path (`__webpack_hmr`) to `http://localhost:3000` or `https://localhost:3000` (depending on your http/https configuration):

`npm run start:pwa -- --wp` or `npm run start:pwa -- -w`

### HMR (custom url)

This setting is for HMR only. You should use the `static` query to set the public path dynamically.

This sets Webpack's HMR path (`__webpack_hmr`) to a custom path:

`npm run start:pwa -- --hmr https://ngrok.io/xxx`

### Analyze bundles

If you want to analyze the bundles, you can pass:

`npm run start:pwa -- --analyze` or `npm run start:pwa -- -a`

The output `html` files will be located in the `.build/pwa/(client|server)/analyze` folders.

## Changelog

#### 1.4.1

- Fix React dead code elimination warning

#### 1.4.0

- Add Comscore to AMP
- Add initialUri compatibility (for wp-pwa-plugin >= 1.3.0)
- Fixes on GTM
- Configure Babel to support Chrome >= 40
- Add iFrames and CustomCSS extensions

#### 1.3.5

- Check if ga is a function

#### 1.3.4

- Add custom_dimensions in analytics

#### 1.3.2

- Remove line

#### 1.3.1

- Fix on virtualEvents

#### 1.3.1

- Fix on virtualPageView

#### 1.3.0

- Analytics package refactoring
- Start sending analytic events
- Use our analytics for development

#### 1.2.1

- Fix comScore events

#### 1.2.0

- Add analytic events

#### 1.1.2

- Remove system
- Fix title in virtualPageView
- Update analytics db schema
- Add jest to eslint globals

#### 1.1.1
- Text deploy

#### 1.1.0
- Start versioning
