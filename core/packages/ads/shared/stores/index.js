import { types, getParent } from 'mobx-state-tree';
import Sticky from './sticky';

export default types
  .model('Ads')
  .props({
    sticky: types.optional(Sticky, {}),
  })
  .views(self => ({
    get root() {
      return getParent(self);
    },
    get doesStickyExist() {
      const config = self.root.settings.ads;
      return (
        !!config &&
        !!config.formats &&
        config.formats.filter(({ options }) => options && options.sticky && options.sticky.display)
          .length > 0
      );
    },
    getFormats(type) {
      const adsConfig = self.root.settings.ads;

      if (!adsConfig || !adsConfig.formats) return {};

      const formatsList = adsConfig.formats;

      const typeFormats = formatsList.find(formats => {
        if (formats.type === type) return true;
        if (typeof formats.type === 'object' && formats.type.includes(type)) return true;

        return false;
      });

      return typeFormats || formatsList.find(options => options.type === 'default');
    },
    getOptions(type) {
      const formats = self.getFormats(type);
      return formats.options;
    },
    getContentFormats(type) {
      const formats = self.getFormats(type);
      return formats.content;
    },
    getStickyFormat(type) {
      const formats = self.getFormats(type);
      return formats.sticky;
    },
  }));
