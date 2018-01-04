import { packages } from '../';

test('package reducers should be initializated to empty object.', () => {
  const state = packages(undefined, {});
  expect(state).toEqual({});
});
