# [0.9.0](https://github.com/frontity/frontity/compare/v0.8.2...v0.9.0) (2018-12-07)


### Bug Fixes

* **analytics:** change a lot of code ([efb254c](https://github.com/frontity/frontity/commit/efb254c))
* **analytics:** WIP send /amp/ in location and do some refactor ([ee90f85](https://github.com/frontity/frontity/commit/ee90f85))


### Features

* **analytics:** send custom title and location in pageviews ([10151bd](https://github.com/frontity/frontity/commit/10151bd))
* **cache-control:** get custom cache options from settings ([d5a015f](https://github.com/frontity/frontity/commit/d5a015f))

## [0.8.2](https://github.com/frontity/frontity/compare/v0.8.1...v0.8.2) (2018-11-29)


### Bug Fixes

* **ads:** prevent scroll on ad destruction in safari ([01e7bd4](https://github.com/frontity/frontity/commit/01e7bd4))

## [0.8.1](https://github.com/frontity/frontity/compare/v0.8.0...v0.8.1) (2018-11-26)


### Bug Fixes

* **graphql:** change token name (AUTH_TOKEN is used internally by now) ([f288c04](https://github.com/frontity/frontity/commit/f288c04))

# [0.8.0](https://github.com/frontity/frontity/compare/v0.7.4...v0.8.0) (2018-11-26)


### Bug Fixes

* **analytics:** fix theme and package names for analytics ([fd59293](https://github.com/frontity/frontity/commit/fd59293))
* **settings:** switch to production database ([7335f0d](https://github.com/frontity/frontity/commit/7335f0d))


### Features

* **settings:** get settings from Graphcool ([9f73df9](https://github.com/frontity/frontity/commit/9f73df9))

## [0.7.4](https://github.com/frontity/frontity/compare/v0.7.3...v0.7.4) (2018-11-15)


### Bug Fixes

* **pwa-template:** fixes initial blink caused by a rerender ([351a822](https://github.com/frontity/frontity/commit/351a822))

## [0.7.3](https://github.com/frontity/frontity/compare/v0.7.2...v0.7.3) (2018-10-26)


### Bug Fixes

* **react:** update react and react-dom ([a04147b](https://github.com/frontity/frontity/commit/a04147b))
* **semantic-release:** fix repository url in pacakge.json ([b7f05ec](https://github.com/frontity/frontity/commit/b7f05ec))
* **semantic-release:** rollback [@semantic-release](https://github.com/semantic-release)/github ([90cd8db](https://github.com/frontity/frontity/commit/90cd8db))
* **semantic-release:** rollback semantic-release version ([159245a](https://github.com/frontity/frontity/commit/159245a))
* **semantic-release:** rollback sr and sr/gh ([03f8fca](https://github.com/frontity/frontity/commit/03f8fca))
* **semantic-release:** update semantic-release ([18b162b](https://github.com/frontity/frontity/commit/18b162b))
* **semantic-release:** update to latest version for security reasons ([a0cbc87](https://github.com/frontity/frontity/commit/a0cbc87))
* **semantic-release:** update travis-deploy-once ([41ba46c](https://github.com/frontity/frontity/commit/41ba46c))

## [0.7.2](https://github.com/frontity/frontity/compare/v0.7.1...v0.7.2) (2018-10-24)


### Bug Fixes

* **ad:** add throttle to LazyUnload ([2839af4](https://github.com/frontity/frontity/commit/2839af4))
* **ad:** fix hydration warning ([1b3aff1](https://github.com/frontity/frontity/commit/1b3aff1))
* **ad:** fix webpack loaders ([e1e7c58](https://github.com/frontity/frontity/commit/e1e7c58))
* **error-boundary:** create ErrorBoundary and use it in App ([1602023](https://github.com/frontity/frontity/commit/1602023))
* **error-boundary:** do not use state ([231ce76](https://github.com/frontity/frontity/commit/231ce76))
* **esmodules:** fixes imports in server side [WIP] ([ba09f4b](https://github.com/frontity/frontity/commit/ba09f4b))
* **imports:** temporarily prevent export warning from happening [WIP] ([623e788](https://github.com/frontity/frontity/commit/623e788))
* **lazyload:** updates [@frontity](https://github.com/frontity)/lazyload to next version ([0d6e43f](https://github.com/frontity/frontity/commit/0d6e43f))
* **lazyload:** updates lazyload ([13786f9](https://github.com/frontity/frontity/commit/13786f9))
* **lodash:** removes lodash-es and installs lodash ([f84336e](https://github.com/frontity/frontity/commit/f84336e))
* **npm:** update [@frontity](https://github.com/frontity)/lazyload package ([71222d7](https://github.com/frontity/frontity/commit/71222d7))
* **npm:** update [@frontity](https://github.com/frontity)/lazyload version ([2d5e3ea](https://github.com/frontity/frontity/commit/2d5e3ea))
* **package.json:** update react-universal-component ([1b1c0bb](https://github.com/frontity/frontity/commit/1b1c0bb))
* **script:** add script tag in runtime ([0d62902](https://github.com/frontity/frontity/commit/0d62902))
* **webpack:** adds cacheDirectory and compact options to babel-loader ([cd8b921](https://github.com/frontity/frontity/commit/cd8b921))
* **webpack:** fix raw imports ([1910d0b](https://github.com/frontity/frontity/commit/1910d0b))
* **webpack:** fix webpack merge [WIP] ([990fdbf](https://github.com/frontity/frontity/commit/990fdbf))
* **webpack:** fixes tree shaking with lodash ([3a874a7](https://github.com/frontity/frontity/commit/3a874a7))
* **webpack:** fixes warnings when transpiling node_modules ([5491229](https://github.com/frontity/frontity/commit/5491229))
* **webpack:** migrates to lodash-es and fixes tree shaking ([dbbbcb6](https://github.com/frontity/frontity/commit/dbbbcb6))
* **webpack:** update react-hot-loader ([4960595](https://github.com/frontity/frontity/commit/4960595))

## [0.7.1](https://github.com/frontity/frontity/compare/v0.7.0...v0.7.1) (2018-10-02)


### Bug Fixes

* **iframes:** fix stlyes for custom iframe ([e4a1aae](https://github.com/frontity/frontity/commit/e4a1aae))
* **mst:** update mobx-state-tree and change mobx version to 4.5 ([ee69663](https://github.com/frontity/frontity/commit/ee69663))

# [0.7.0](https://github.com/frontity/frontity/compare/v0.6.7...v0.7.0) (2018-09-26)


### Bug Fixes

* **amp:** replace styled-components tag to be AMP compliant ([46d0ef0](https://github.com/frontity/frontity/commit/46d0ef0))
* **amp:** use amp-custom only in AMP ([6dad508](https://github.com/frontity/frontity/commit/6dad508))
* **env:** use requestAnimationFrame when reading from innerText ([11e08e5](https://github.com/frontity/frontity/commit/11e08e5))
* **styled-components:** fixes error of several instances with an update ([8393862](https://github.com/frontity/frontity/commit/8393862))


### Features

* **mst:** update mobx-state-tree [WIP] ([932cc99](https://github.com/frontity/frontity/commit/932cc99))

## [0.6.7](https://github.com/frontity/frontity/compare/v0.6.6...v0.6.7) (2018-08-28)


### Bug Fixes

* **google-analytics:** remove try-catch when getting trackingOptions ([db09b26](https://github.com/frontity/frontity/commit/db09b26))

## [0.6.6](https://github.com/frontity/frontity/compare/v0.6.5...v0.6.6) (2018-08-17)


### Bug Fixes

* **ads:** removes unnecessary column prop in SmartAd ([78214d8] (https://github.com/frontity/frontity/commit/78214d8))

## [0.6.5](https://github.com/frontity/frontity/compare/v0.6.4...v0.6.5) (2018-08-16)


### Bug Fixes

* **ads:** removes sunmedia ads in AMP ([96dbb2c](https://github.com/frontity/frontity/commit/96dbb2c))

## [0.6.4](https://github.com/frontity/frontity/compare/v0.6.3...v0.6.4) (2018-07-20)


### Bug Fixes

* **pwa template:** don't rely on window load to launch our scripts ([0abc030](https://github.com/frontity/frontity/commit/0abc030))

## [0.6.3](https://github.com/frontity/frontity/compare/v0.6.2...v0.6.3) (2018-07-18)


### Bug Fixes

* **one-signal:** fix bug enabling notifications ([38a8a92](https://github.com/frontity/frontity/commit/38a8a92))

## [0.6.2](https://github.com/frontity/frontity/compare/v0.6.1...v0.6.2) (2018-07-18)


### Bug Fixes

* **one-signal:** refactor afterSsr ([49e3abb](https://github.com/frontity/frontity/commit/49e3abb))
* **one-signal:** remove flow and add beforeSsr (WIP) ([93f7fb8](https://github.com/frontity/frontity/commit/93f7fb8))

## [0.6.1](https://github.com/frontity/frontity/compare/v0.6.0...v0.6.1) (2018-07-17)


### Bug Fixes

* **icons:** changes sticky close icon ([85b2b27](https://github.com/frontity/frontity/commit/85b2b27))
* **react-icon:** remove package ([7e1137c](https://github.com/frontity/frontity/commit/7e1137c))

# [0.6.0](https://github.com/frontity/frontity/compare/v0.5.19...v1.0.0) (2018-07-17)


### Bug Fixes

* **ads:** fixes sunmedia ad styles ([2c1bd31](https://github.com/frontity/frontity/commit/2c1bd31))
* **amp:** add client.js ([a259a72](https://github.com/frontity/frontity/commit/a259a72))
* **amp:** fix amp components ([247e5c6](https://github.com/frontity/frontity/commit/247e5c6))
* **analytics:** fix error when no analytics settings in amp ([0ac585d](https://github.com/frontity/frontity/commit/0ac585d))
* **analytics:** fixes error when no analytics settings are available ([7c70b6a](https://github.com/frontity/frontity/commit/7c70b6a))
* **analytics:** get the first title from entity again ([c2b0cfa](https://github.com/frontity/frontity/commit/c2b0cfa))
* **analytics:** get title from head.title for the first page view ([3cefc58](https://github.com/frontity/frontity/commit/3cefc58))
* **analytics:** replace flows with afterCsr and remove helpers ([05618ab](https://github.com/frontity/frontity/commit/05618ab))
* **build:** build now assigns the initialUrl to the right prop ([e028273](https://github.com/frontity/frontity/commit/e028273))
* **client:** allow initialSelectedItem's id to be a string or a number ([87ab97e](https://github.com/frontity/frontity/commit/87ab97e))
* **google-analytics:** get custom dimensions in amp format ([810b977](https://github.com/frontity/frontity/commit/810b977))
* **google-analytics:** remove trackerNames from props ([854896c](https://github.com/frontity/frontity/commit/854896c))
* **google-tag-manager:** fix containerIds view ([ba849f2](https://github.com/frontity/frontity/commit/ba849f2))
* **iframe:** changes styles in custom iframes ([7091d2f](https://github.com/frontity/frontity/commit/7091d2f))
* **smart-ad:** remove console.logs ([1867013](https://github.com/frontity/frontity/commit/1867013))
* **stores:** fix stores and tests ([0a03a75](https://github.com/frontity/frontity/commit/0a03a75))


### Features

* **flows:** removes support for flows ([5a1d668](https://github.com/frontity/frontity/commit/5a1d668))
* **google-analytics:** add actions to set amp vars and triggers ([dcd4450](https://github.com/frontity/frontity/commit/dcd4450))
* **stores:** adds support for beforeSSR and afterCSR hooks ([2e888bf](https://github.com/frontity/frontity/commit/2e888bf))


### Performance Improvements

* **recompose:** update recompose to v0.27 to avoid React 16.3 warnings ([bd4d37a](https://github.com/frontity/frontity/commit/bd4d37a))


### BREAKING CHANGES

* **flows:** removes support for flows

https://github.com/wp-pwa/saturn-theme/issues/329

## [0.5.19](https://github.com/frontity/frontity/compare/v0.5.18...v0.5.19) (2018-07-03)


### Bug Fixes

* **ads:** fixes sunmedia ads using slot and fills ([c606bee](https://github.com/frontity/frontity/commit/c606bee))

## [0.5.18](https://github.com/frontity/frontity/compare/v0.5.17...v0.5.18) (2018-07-02)


### Bug Fixes

* **amp:** fixes client entry points for AMP ([31dce16](https://github.com/frontity/frontity/commit/31dce16))
* **amp:** fixes entry points for AMP ([7dfa709](https://github.com/frontity/frontity/commit/7dfa709))
