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
    } else if (typeof singleType !== 'undefined') {
      type = singleType;
    } else {
      type = 'latest';
    }
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

  if (typeof page === 'undefined') {
    if (typeof query.listType !== 'undefined') {
      page = 1;
    }
  } else {
    page = parse(page);
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
