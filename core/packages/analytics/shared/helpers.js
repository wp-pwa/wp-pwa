import sha256 from 'crypto-js/sha256';
import base64 from 'crypto-js/enc-base64';

export const getRoute = ({ page }) => typeof page === 'number' ? 'list' : 'single';

export const getHash = (site, selected) => {
  const { type, id, page } = selected;
  const data = JSON.stringify([site, type, id, page]);
  return base64.stringify(sha256(JSON.stringify(data))).slice(0, 19);
};

export const getAnonymousTitle = ({ site, selected, format }) => {
  const { type } = selected;
  const route = getRoute(selected);
  const hash = getHash(site, selected);
  return `anonymous - ${format} - ${route} - ${type} - ${hash}`;
};

export const getAnonymousUrl = ({ site, selected, format }) =>
  `anonymous/${format}/${getHash(site, selected)}`;

export const getTitle = ({ site, selected, format }) => {
  const { type, id, page } = selected;
  const withPage = page ? ` - page ${page}` : ''
  const route = getRoute(selected);
  return `${site} - ${format} - ${route} - ${type} - ${id}${withPage}`;
};

export const getUrl = ({ selected, format }) => {
  const { _link: link } = selected.single;
  return format ? `${link}${link.endsWith('/') ? '' : '/'}${format}/` : link;
};
