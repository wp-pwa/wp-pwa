/* eslint-disable import/prefer-default-export */

const parse = value =>
  Number.isFinite(parseInt(value, 10)) ? parseInt(value, 10) : value;

export const parseQuery = query => {
  const { siteId, perPage, initialUrl } = query;
  const env = query.env === 'prod' ? 'prod' : 'pre';
  const device = query.device || 'mobile';

  let { type, id, page } = query;

  if (typeof type === 'undefined') {
    const { listType, singleType } = query;

    if (typeof listType !== 'undefined') {
      type = listType;
      page = parse(query.page) || 1;
    } else if (typeof singleType !== 'undefined') {
      type = singleType;
    } else {
      type = 'latest';
      page = parse(query.page) || 1;
    }
  } else {
    page = parse(query.page);
  }

  if (typeof id === 'undefined') {
    const { listId, singleId } = query;

    if (typeof listId !== 'undefined') {
      id = parse(listId);
    } else if (typeof singleId !== 'undefined') {
      id = parse(singleId);
    } else {
      id = 'post';
    }
  } else {
    id = parse(id);
  }

  return {
    siteId,
    perPage,
    initialUrl,
    env,
    device,
    type,
    id,
    page,
  };
};

const mergeOptions = (base, custom) => {
  const options = Object.assign({ ...base }, custom || {});
  return Object.entries(options)
    .map(([k, v]) => (v !== '' ? `${k}=${v}` : k))
    .join(', ');
};

export const getCacheOptions = settings => {
  // Get cache-control options from settings
  const { queryParams } = settings.connection;
  const custom = queryParams && queryParams['cache-control'];

  if (custom) {
    const base = {
      public: '',
      'max-age': 0,
      's-maxage': 120,
      'stale-while-revalidate': 31536000,
      'stale-if-error': 31536000,
    };
    return mergeOptions(base, custom);
  }
  return null;
};
