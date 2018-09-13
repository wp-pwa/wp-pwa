# » Frontity

[![Build Status](https://travis-ci.org/frontity/frontity.svg?branch=master)](https://travis-ci.org/frontity/frontity)

> We are in the process of preparing our framework to be used by other developers than us, but we haven't finished yet. If you want to start working with it, please send us an email to hello@frontity.com and we'll help you set up a local environment.

**» Frontity** is a framework for building WordPress themes made with **React**.

It is based in a **fully-decoupled** approach. This means it uses NodeJS (and not PHP) to create the final server-side-rendered html.

It uses the **WP REST API** to fetch content from WordPress and a small PHP plugin (our **Frontity WP Plugin**) to inject **Frontity** in WordPress.

Apart from **React**, state is managed with **[MobxStateTree](https://github.com/mobxjs/mobx-state-tree)** and CSS with **[StyledComponents](https://github.com/styled-components/styled-components)**.

**Frontity** is also extensible. Right now we have extensions like *Disqus comments, OneSignal notifications, Adsense, Doubleclick, SmartAds, Google Analytics, Google Tag Manager, Custom CSS or Custom HTML*. This means, your Frontity Theme won't have to reinvent the wheel each time including stuff than can be outsourced to extensions.

The Frontity's render engine also supports **AMP** html. This means you can reuse your React and CSS code to create your AMP pages.

## Setting up a local environment

First, clone this repo:

```
git clone https://github.com/frontity/frontity
```

Then clone the extensions you want to use in the `packages` folder:

```
cd frontity/packages
git clone https://github.com/frontity/wp-org-connection
git clone https://github.com/frontity/saturn-theme
```

Install the packages:

```
cd ..
npm install
```

And run the project!

```
npm run start:pwa
```

## Running the project


Run `npm run start:pwa` to start the project in development mode.

Run `npm run build:pwa -- -p && npm run serve:pwa -- -p` to start the project in production mode.

Server starts in `http://localhost:3000` by default.

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

## Queries

You can pass some queries to configure the server.

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

## Changelog

This project adheres to [Semantic Versioning](https://semver.org/) and [Angular Conventional Changelog](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).
Every release is documented on the [Github Releases](https://github.com/frontity/frontity/releases) page.

## License

This project is licensed under the terms of the [Apache 2.0](https://github.com/frontity/frontity/blob/master/LICENSE) license.

## Contribute

Please take a look at our [Contribution Guide](https://github.com/frontity/contribute).
