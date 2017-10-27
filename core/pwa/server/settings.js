import request from 'superagent';
import { normalize, schema } from 'normalizr';

const settingSchema = new schema.Entity(
  'settings',
  {},
  { idAttribute: setting => setting.woronaInfo.namespace }
);
const settingsSchema = [settingSchema];

// Fetch settings from the backend.
export const getSettings = async ({ siteId, environment }) => {
  const cdn = environment === 'prod' ? 'cdn' : 'precdn';
  try {
    const { body } = await request(
      `https://${cdn}.worona.io/api/v1/settings/site/${siteId}/app/prod/live`,
    );
    const { entities: { settings } } = normalize(body, settingsSchema);
    return settings;
  } catch (error) {
    return null;
  }
};

// Extract activated packages array from settings.
export const getActivatedPackages = async ({ settings }) =>
  Object.values(settings)
    .filter(pkg => pkg.woronaInfo.namespace !== 'generalSite')
    .reduce((obj, pkg) => ({ ...obj, [pkg.woronaInfo.namespace]: pkg.woronaInfo.name }), {});
