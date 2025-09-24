const express = require('express');
const multer = require('multer');
// const multerGoogleStorage = require('multer-google-storage');
const fs = require('fs');

const router = express.Router();
const {
  authMW, valMW,
} = require('src/shared/middlewares/cp-mw');
const vldtns = require('../documents.validations');
const { uploadInMemory } = require('../../azure-multer/file-handler');

const ctr = require('./documents.controller');

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     const path = 'uploads/';
//     if (!fs.existsSync(path)) {
//       fs.mkdirSync(path, { recursive: true });
//     }
//     cb(null, path);
//   },
//   filename(req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`); // Appending extension
//   },
// });

// const upload = multer({
//   dest: 'uploads/',
//   storage,
//   // storage: multerGoogleStorage.storageEngine(),
// });

router.post('/', authMW, uploadInMemory.array('images', 3), valMW(vldtns.uploadDoc), ctr.addDocument);
router.get('/', authMW, ctr.getMyDocuments);

module.exports = router;
module.exports.routerName = 'documents';
