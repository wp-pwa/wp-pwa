import { parseQuery } from '../utils';

describe('parseQuery function:', () => {
  const query = {
    siteId: 'FRONTA2CLMLh6f2Wa',
    initialUrl: 'https://frontity.com/',
    perPage: '10',
  };

  test('Returns siteId', () => {
    expect(parseQuery(query).siteId).toBe('FRONTA2CLMLh6f2Wa---');
  });
  test('Returns initialUrl', () => {
    expect(parseQuery(query).initialUrl).toBe('https://frontity.com/---');
  });
  test('Returns perPage', () => {
    expect(parseQuery(query).perPage).toBe('10---');
  });
  // test('Returns env', {});
  // test('Returns device', () => {});

  // test('Query has listType and listId', () => {});
});
