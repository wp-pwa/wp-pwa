import { parseQuery } from '../utils';

describe('parseQuery function', () => {
  test('Returns siteId', () => {
    const query = {
      siteId: 'FRONTA2CLMLh6f2Wa',
    };

    expect(parseQuery(query).siteId).toBe('FRONTA2CLMLh6f2Wa');
  });

  test('Returns initialUrl', () => {
    const query = {
      initialUrl: 'https://frontity.com/',
    };

    expect(parseQuery(query).initialUrl).toBe('https://frontity.com/');
  });

  test('Returns perPage', () => {
    const query = {
      perPage: '10',
    };

    expect(parseQuery(query).perPage).toBe('10');
  });

  test('Returns the right env', () => {
    const query = {};

    expect(parseQuery(query).env).toBe('pre');

    query.env = 'pre';

    expect(parseQuery(query).env).toBe('pre');

    query.env = 'prod';

    expect(parseQuery(query).env).toBe('prod');
  });

  test('Returns the right device', () => {
    const query = {};

    expect(parseQuery(query).device).toBe('mobile');

    query.device = 'mobile';

    expect(parseQuery(query).device).toBe('mobile');

    query.device = 'tablet';

    expect(parseQuery(query).device).toBe('tablet');
  });

  test('Query has no type/listType/singleType, nor id/listId/singleId nor page', () => {
    const query = {};
    const result = parseQuery(query);

    expect(result.type).toBe('latest');
    expect(result.id).toBe('post');
    expect(result.page).toBe(1);
  });

  test('Query has singleType and singleId', () => {
    const query = {
      singleType: 'post',
      singleId: '60',
    };
    const result = parseQuery(query);

    expect(result.type).toBe('post');
    expect(result.id).toBe(60);
    expect(result.page).toBeUndefined();
  });

  test('Query has listType and listId', () => {
    const query = {
      listType: 'category',
      listId: '3',
    };
    const result = parseQuery(query);

    expect(result.type).toBe('category');
    expect(result.id).toBe(3);
    expect(result.page).toBe(1);
  });

  test('Query has listType, listId, and page', () => {
    const query = {
      listType: 'category',
      listId: '3',
      page: '2',
    };
    const result = parseQuery(query);

    expect(result.type).toBe('category');
    expect(result.id).toBe(3);
    expect(result.page).toBe(2);
  });

  test('Query has type and id', () => {
    const query = {
      type: 'post',
      id: 60,
    };
    const result = parseQuery(query);

    expect(result.type).toBe('post');
    expect(result.id).toBe(60);
    expect(result.page).toBeUndefined();
  });

  test('Query has type, id and page', () => {
    const query = {
      type: 'latest',
      id: 'post',
      page: '2',
    };
    const result = parseQuery(query);

    expect(result.type).toBe('latest');
    expect(result.id).toBe('post');
    expect(result.page).toBe(2);
  });
});
