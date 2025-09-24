const express = require('express');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const path = 'uploads/';
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
  filename(req, file, cb) {
    cb(null, `asset_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer(
  {
    dest: 'uploads/',
    storage,
  },
);
const multerMw = upload.single('image');
const router = express.Router();
const {
  validationMiddleware, validationPathMiddleware, authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('./asset.validations');

const AssetController = require('./asset.controller');

router.use(authMiddleware);

// for adding record
router.post('/', authorizeMW('symbols', 'create'), validationMiddleware(vldtns.createAsset), multerMw, AssetController.createAsset);

// for paginate records
router.get('/', authorizeMW('symbols', 'get'), validationMiddleware(vldtns.listing, true), AssetController.getPaginate);

// for get records
router.patch('/:id', authorizeMW('symbols', 'update'), validationPathMiddleware(vldtns.getAsset), validationMiddleware(vldtns.update), multerMw, AssetController.updateAsset);

// for get record by id
router.get('/:id', authorizeMW('symbols', 'get'), validationPathMiddleware(vldtns.getAsset), AssetController.getRecordById);

// for delete record by id
router.delete('/:id', authorizeMW('symbols', 'delete'), validationPathMiddleware(vldtns.getAsset), AssetController.deleteRecordById);

module.exports = router;
module.exports.routerName = 'assets';
