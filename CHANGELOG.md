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
