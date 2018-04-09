import sha256 from 'crypto-js/sha256';
import base64 from 'crypto-js/enc-base64';

export const getRoute = ({ page }) => (typeof page === 'number' ? 'list' : 'single');

export const getHash = (site, selectedItem) => {
  const { type, id, page } = selectedItem;
  const data = JSON.stringify([site, type, id, page]);
  return base64.stringify(sha256(JSON.stringify(data))).slice(0, 19);
};

export const getAnonymousTitle = ({ site, selectedItem, format }) => {
  const { type } = selectedItem;
  const route = getRoute(selectedItem);
  const hash = getHash(site, selectedItem);
  return `anonymous - ${format} - ${route} - ${type} - ${hash}`;
};

export const getAnonymousUrl = ({ site, selectedItem, format }) =>
  `anonymous/${format}/${getHash(site, selectedItem)}`;

export const getTitle = ({ site, selectedItem, format }) => {
  const { type, id, page } = selectedItem;
  const withPage = page ? ` - page ${page}` : '';
  const route = getRoute(selectedItem);
  return `${site} - ${format} - ${route} - ${type} - ${id}${withPage}`;
};

export const getUrl = ({ selectedItem, format }) => {
  const { link } = selectedItem.entity;
  return format ? `${link}${link.endsWith('/') ? '' : '/'}${format}/` : link;
};

export const getGaTrackingIds = ({ dev, analyticsSettings = {}, format }) => {
  const gaTrackingIds =
    (analyticsSettings[format] && analyticsSettings[format].gaTrackingIds) || [];
  return dev ? ['UA-91312941-7'] : gaTrackingIds;
};
