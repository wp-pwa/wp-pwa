/* eslint-disable no-unused-vars, no-underscore-dangle */

const func = networkId => {
  const sas = window && window.sas ? window.sas : (window.sas = {});
  sas.cmd = sas.cmd || [];
  sas.cmd.push(() => {
    if (!window.__sasSetup) {
      window.__sasSetup = true;
      sas.setup({
        networkid: networkId,
        domain: '//www8.smartadserver.com',
        async: true,
      });
    }
  });
};
