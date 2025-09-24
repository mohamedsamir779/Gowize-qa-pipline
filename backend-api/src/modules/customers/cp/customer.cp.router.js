const express = require('express');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();

const { valMW, authMW, vlResetPassMw } = require('src/shared/middlewares/cp-mw');

const { update, submitIndProfile, uploadProfileAvatar, settingsUpdate } = require('./customer.validations');
const CustomerController = require('./customer.controller');

router.patch('/reset-password', vlResetPassMw, CustomerController.resetPassword);
router.patch('/forgot-password', CustomerController.forgotPassword);
router.get('/check-email', CustomerController.checkEmail);

router.use(authMW);

router.patch('/profile', valMW(update), CustomerController.updateProfile);
router.patch('/settings', valMW(settingsUpdate), CustomerController.updateSettings);
router.get('/stages', CustomerController.getStages);
router.post('/start-trading', CustomerController.startTrading);
router.post('/profile-submit', valMW(submitIndProfile), CustomerController.submitProfile);

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

const { uploadInMemory } = require('../../azure-multer/file-handler');

// const upload = multer({
//   dest: 'uploads/',
//   storage,
//   // storage: multerGoogleStorage.storageEngine(),
// });

router.post('/profile-avatar', uploadInMemory.single('images'), CustomerController.updateProfileAvatar);
router.get('/config/defaults', CustomerController.getDefaultConfig);
router.get('/convert', CustomerController.convertDemoToLive);
router.patch('/change-password', CustomerController.changePassword);
module.exports = router;
module.exports.routerName = 'customer';
