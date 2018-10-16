/* eslint-disable no-unused-vars */
const func = (divId, slot, width, height, json) => {
  const {
    targeting,
    categoryExclusions,
    cookieOptions,
    tagForChildDirectedTreatment: tagForChild,
  } =
    json || {};

  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
  window.googletag.cmd.push(() => {
    // Define ad
    const ad = window.googletag
      .defineSlot(slot, [width, height], divId)
      .addService(window.googletag.pubads());

    // Extra options
    if (targeting !== undefined) {
      Object.entries(targeting).forEach(([key, value]) =>
        ad.setTargeting(key, value),
      );
    }
    if (categoryExclusions !== undefined) {
      categoryExclusions.forEach(exclusion =>
        ad.setCategoryExclusion(exclusion),
      );
    }
    if (cookieOptions !== undefined) {
      ad.setCookieOptions(cookieOptions);
    }
    if (tagForChild !== undefined) {
      ad.setTagForChildDirectedTreatment(tagForChild);
    }

    // Display ad
    window.googletag.enableServices();
    window.googletag.display(divId);
  });
};
