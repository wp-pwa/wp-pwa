import { types } from 'mobx-state-tree';
import Sticky from './sticky';

export default types
  .model('Ads')
  .props({
    sticky: types.optional(Sticky, {}),
  });
