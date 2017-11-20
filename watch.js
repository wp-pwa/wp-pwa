/* eslint-disable no-console */
const watch = require('watch');

watch.watchTree('.', (f, curr, prev) => {
    if (typeof f === "object" && prev === null && curr === null) {
      // Finished walking the tree
    } else if (prev === null) {
      console.log(`created: ${f}`);
    } else if (curr.nlink === 0) {
      console.log(`removed: ${f}`);
    } else {
      console.log(`changed: ${f}`);
    }
  })
