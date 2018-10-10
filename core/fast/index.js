console.log('fast!', (new Date).getTime() - window.frontityDate);

const { packages } = window['wp-pwa'].initialState.build;

Object.values(packages).forEach(pkg => {
  import(`../../packages/${pkg}/src/fast/client.js`);
});
