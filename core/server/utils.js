/* eslint-disable import/prefer-default-export */

export const parseQuery = query => {
  const { siteId, perPage, initialUrl, type, id, page } = query;

  const env = query.env === 'prod' ? 'prod' : 'pre';
  const device = query.device || 'mobile';

  const listType = !query.listType && !query.singleType ? 'latest' : query.listType;
  const listId = parse(query.listId) || (listType && 'post');
  const singleId = parse(query.singleId);
  const page = parse(query.page) || 1;

  return {
    siteId,
    perPage,
    initialUrl,
    env,
    device,
  };
};
