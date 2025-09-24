const express = require('express');
const read = require('fs-readdir-recursive');
const { keys } = require('src/common/data');

const router = express.Router();

const foundFiles = read(`${__dirname}/modules`);
const routes = foundFiles.filter((obj) => obj.indexOf('cp.router.js') > -1);

routes.forEach((element) => {
  const filePath = element.replace(/\\/g, '/');
  const route = require(`./modules/${filePath}`);
  const fileSplit = filePath.split('/');
  const name = route.routerName || fileSplit[fileSplit.length - 1].split('.')[0];

  if (fileSplit.indexOf('fx') > -1) {
    if (keys.enableFX) {
      router.use(`/${name}`, route);
    }
  } if (fileSplit.indexOf('crypto') > -1) {
    if (keys.enableCrypto) {
      router.use(`/${name}`, route);
    }
  } else {
    router.use(`/${name}`, route);
  }
});

module.exports = router;
