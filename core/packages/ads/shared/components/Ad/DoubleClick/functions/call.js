/* eslint-disable no-unused-vars */
const slots = '__gtag_slots';
const func = (divId, slot, sizes, json) => {
  const {
    targeting,
    categoryExclusions,
    cookieOptions,
    tagForChildDirectedTreatment: tagForChild,
  } = json || {};

  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
  window.googletag.cmd.push(() => {
    window[slots] = window[slots] || {};
    if (window[slots][slot]) {
      window.googletag.destroySlots([window[slots][slot]]);
      delete window[slots][slot];
    }
  });
  window.googletag.cmd.push(() => {
    // Define ad
    const ad = window.googletag
      .defineSlot(slot, sizes, divId)
      .addService(window.googletag.pubads());

    window[slots][slot] = ad;

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
