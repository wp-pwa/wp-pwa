/* eslint-disable no-unused-vars */

// callParams are:
// siteId,
// pageId,
// formatId,
// target,
// width,
// height,
// tagId,

const func = (callType, callParams) => {
  const sas = window && window.sas ? window.sas : (window.sas = {});
  sas.cmd = sas.cmd || [];
  sas.cmd.push(() => {
    const containerExists =
      window.document.getElementById(callParams.tagId) !== null;
    if (containerExists) {
      sas.call(callType, { async: true, ...callParams });
    }
  });
};
