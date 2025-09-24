const express = require('express');
// const multer = require('multer');
// const multerGoogleStorage = require('multer-google-storage');
// const fs = require('fs');

const router = express.Router();
// const fs = require('fs');
const {
  validationPathMiddleware, authMiddleware,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('../documents.validations');

const ctr = require('./documents.controller');
const { uploadInMemory } = require('../../azure-multer/file-handler');

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

router.use(authMiddleware);

const multerMw = uploadInMemory.fields(
  [
    { name: 'ID', maxCount: 2 },
    { name: 'PASSPORT', maxCount: 2 },
    { name: 'ADDRESS', maxCount: 1 },
    { name: 'AGREEMENT', maxCount: 3 },
    { name: 'WORLD_CHECK', maxCount: 3 },
    { name: 'ADDITIONAL_DOCUMENTS', maxCount: 3 },
    { name: 'SOURCE_OF_FUNDS', maxCount: 3 },
    // corporate
    { name: 'MEMORANDUM', maxCount: 1 },
    { name: 'CORPORATE_ADDRESS', maxCount: 1 },
    { name: 'CERTIFICATE_OF_INCORPORATION', maxCount: 1 },
  ],
);

router.post('/:customerId', multerMw, validationPathMiddleware(vldtns.pathCustomer), ctr.addDocument);
router.get('/:customerId', validationPathMiddleware(vldtns.pathCustomer), ctr.getMyDocuments);
router.post('/:customerId/:status/:documentId', validationPathMiddleware(vldtns.documentActions), ctr.changeStatus);
router.delete('/:customerId/:documentId', validationPathMiddleware(vldtns.documentDelete), ctr.deleteDocument);

router.get('/:documentId/:index', ctr.getDocument);

module.exports = router;
module.exports.routerName = 'documents';
