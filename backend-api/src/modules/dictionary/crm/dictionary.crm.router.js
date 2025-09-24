const express = require('express');

const router = express.Router();
const {
  validationMiddleware, validationPathMiddleware, authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('./dictionary.validations');

const DictionaryController = require('./dictionary.controller');

router.use(authMiddleware);

router.get('/', validationMiddleware(vldtns.listing), DictionaryController.getDictionary);
router.get('/:id', validationPathMiddleware(vldtns.getDictionary), DictionaryController.getRecordById);
router.post('/', authorizeMW('dictionaries', 'create'), validationMiddleware(vldtns.create), DictionaryController.createRecord);
router.patch('/addItem/:id', authorizeMW('dictionaries', 'update'), validationPathMiddleware(vldtns.getDictionary), validationMiddleware(vldtns.addItem), DictionaryController.addItemToDictionary);
router.delete('/:id', authorizeMW('dictionaries', 'delete'), validationPathMiddleware(vldtns.getDictionary), DictionaryController.deleteRecordById);
router.patch('/removeItem/:id', authorizeMW('dictionaries', 'update'), validationMiddleware(vldtns.removeItem), DictionaryController.removeItemFromDictionary);
router.patch('/actions', authorizeMW('dictionaries', 'update'), validationMiddleware(vldtns.update), DictionaryController.updateAction);
router.patch('/exchanges', authorizeMW('dictionaries', 'update'), validationMiddleware(vldtns.update), DictionaryController.updateExchange);
router.patch('/callStatus', authorizeMW('dictionaries', 'update'), validationMiddleware(vldtns.update), DictionaryController.updateCallStatus);
router.patch('/countries', authorizeMW('dictionaries', 'update'), validationMiddleware(vldtns.update), DictionaryController.updateCountry);
router.patch('/markups', authorizeMW('dictionaries', 'update'), validationMiddleware(vldtns.update), DictionaryController.updateMarkup);
router.patch('/products', authorizeMW('dictionaries', 'update'), validationMiddleware(vldtns.update), DictionaryController.updateProducts);

module.exports = router;
module.exports.routerName = 'dictionaries';
