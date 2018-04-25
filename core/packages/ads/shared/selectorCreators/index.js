import * as selectors from '../selectors';

export const getFormats = type => state => {
  const adsConfig = selectors.ads.getConfig(state);

  if (!adsConfig || !adsConfig.formats) return {};

  const formatsList = adsConfig.formats;

  const typeFormats = formatsList.find(formats => {
    if (formats.type === type) return true;
    if (typeof formats.type === 'object' && formats.type.includes(type)) return true;

    return false;
  });

  return typeFormats || formatsList.find(options => options.type === 'default');
};

export const getOptions = type => state => {
  const formats = getFormats(type)(state);

  return formats.options;
};

export const getContentFormats = type => state => {
  const formats = getFormats(type)(state);

  return formats.content;
};

export const getStickyFormat = type => state => {
  const formats = getFormats(type)(state);

  return formats.sticky;
};
