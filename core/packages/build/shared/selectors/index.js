// import { createSelector } from 'reselect';

export const getExtensions = state => state.build.extensions;
export const getTheme = state => state.build.theme;
export const getSsr = state => state.build.ssr;
export const getInitialUrl = state => state.build.initialUrl;

// export const getPackages = createSelector(getExtensions, getTheme, (extensions, theme) => [
//   ...Object.values(extensions),
//   theme,
// ]);

export const getPackages = state => Object.values(state.build.packages);
