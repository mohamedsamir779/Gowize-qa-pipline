const mongoose = require('mongoose');
const { customerService, systemEmailService } = require('src/modules/services');
const { CONSTANTS, keys } = require('src/common/data');
const { Cruds, SendEvent, dbConnectionUpCb } = require('src/common/handlers');
const DocumentModel = require('./documents.model');

const { DCOUMENTS_STATUS } = CONSTANTS;

const getFileName = (file) => file;
const {
  EVENT_TYPES, LOG_TYPES, LOG_LEVELS, EMAIL_ACTIONS, PUSH_NOTIFICATION_GROUPS,
} = require('../../common/data/constants');

class DocumentService extends Cruds {
  async addNewdocument(params = {}) {
    const {
      customerId, type, subType, shareholderId, files, customer, ipAddress
    } = params;
    console.log("Adding document=== client ip address: ", ipAddress);
    const customerDocs = await this.find({ customerId });
    let existing = null;
    const logs = {
      customerId,
      userId: params.createdBy,
      triggeredBy: params.createdBy ? 1 : 0,
      userLog: false,
      level: LOG_LEVELS.INFO,
      details: {},
      content: {
        type, subType, shareholderId, files,
      },
    };
    if (keys.kycDocuments.indexOf(type) !== -1) {
      existing = customerDocs.find(
        (obj) => obj.type === type
          && obj.subType === subType
          && obj?.shareholderId === shareholderId,
      );
      if (existing) {
        if (existing.status === DCOUMENTS_STATUS.APPROVED) {
          throw new Error(`Document - ${type} already approved`);
        }
        SendEvent(
          EVENT_TYPES.EVENT_LOG,
          LOG_TYPES.OVERWRITE_DOCS,
          logs,
        );
        await this.updateById(existing._id, {
          file1: getFileName(files[0]),
          file2: getFileName(files[1]),
          status: 'PENDING',
          rejectionReason: '',
        });
        SendEvent(
          EVENT_TYPES.PUSH_NOTIFICATION,
          {
            pushNotificationType: PUSH_NOTIFICATION_GROUPS.KYC.KYC__UPLOADED,
            pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'KYC'),
            to: [customer?.agent],
          },
          {
            client: {
              firstName: customer?.firstName,
              lastName: customer?.lastName,
              email: customer?.email,
              recordId: customer?.recordId,
              _id: customer?._id?.toString(),
            },
            kyc: {
              type,
              status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
            },
          },
        );
      } else {
        SendEvent(
          EVENT_TYPES.EVENT_LOG,
          LOG_TYPES.UPLOAD_DOCS,
          logs,
        );
        await this.create({
          customerId,
          type,
          ipAddress,
          subType,
          shareholderId,
          file1: getFileName(files[0]),
          file2: getFileName(files[1]),
        });
        await this.isKycAdded(customerId, true);
        SendEvent(
          EVENT_TYPES.PUSH_NOTIFICATION,
          {
            pushNotificationType: PUSH_NOTIFICATION_GROUPS.KYC.KYC__UPLOADED,
            pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'KYC'),
            to: [customer?.agent],
          },
          {
            client: {
              firstName: customer?.firstName,
              lastName: customer?.lastName,
              email: customer?.email,
              recordId: customer?.recordId,
              _id: customer?._id?.toString(),
            },
            kyc: {
              type,
              status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
            },
          },
        );
      }
    } else {
      existing = customerDocs.filter((obj) => obj.type !== 'ID' && obj.type !== 'ADDRESS');
      if (existing.length + files.length > 8) {
        throw new Error('Maximum limit exceeded to upload documents');
      }
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.UPLOAD_DOCS,
        logs,
      );
      await this.createBulk(files.map((obj) => ({
        customerId,
        type,
        ipAddress,
        file1: getFileName(obj),
      })));
    }
    return true;
  }

  async changeDocumentStatus(status, documentId, rejectionReason = undefined, updatedBy) {
    const document = await this.findById(documentId, {}, true, [{
      path: 'customerId',
      select: 'firstName lastName email recordId agent',
    }]);
    if (!document || ['APPROVED', 'REJECTED'].indexOf(document.status) !== -1) {
      throw new Error('Error occred, while doing action on Document');
    }
    const result = await this.updateById(documentId, { status, rejectionReason });
    if (keys.kycDocuments.indexOf(document.type) !== -1 && ['APPROVED', 'REJECTED'].indexOf(status) !== -1) {
      await this.isKycApproved(document.customerId?._id, true);
    }
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.CHANGE_DOC_STATUS,
      {
        customerId: document.customerId?._id,
        userId: updatedBy,
        triggeredBy: 1,
        userLog: false,
        level: LOG_LEVELS.INFO,
        details: { type: document.type, status, rejectionReason },
        content: {},
      },
    );
    SendEvent(
      EVENT_TYPES.PUSH_NOTIFICATION,
      {
        pushNotificationType: status === 'APPROVED' ? PUSH_NOTIFICATION_GROUPS.KYC.KYC__APPROVED : PUSH_NOTIFICATION_GROUPS.KYC.KYC__REJECTED,
        pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'KYC'),
        to: [document.customerId._id],
      },
      {
        client: {
          firstName: document.customerId.firstName,
          lastName: document.customerId.lastName,
          email: document.customerId.email,
          recordId: document.customerId.recordId,
          _id: document.customerId._id.toString(),
        },
        kyc: {
          type: document.type,
          status,
          rejectionReason,
        },
      },
    );
    return result;
  }

  async isKycAdded(customerId, updateStatus = false) {
    const customerDocs = await this.find({
      customerId,
      type: { $in: keys.kycDocuments },
    });
    const baseDocs = ['ID', 'ADDRESS'];
    const requiredAuthorizedPersonDocs = baseDocs;
    const requiredShareholderDocs = baseDocs;
    const requiredIndividualDocs = baseDocs;
    const requiredAdditionalCorporateDocs = ['MEMORANDUM', 'CORPORATE_ADDRESS', 'CERTIFICATE_OF_INCORPORATION'];

    const customer = await customerService.findById(customerId);
    const shareholders = customer?.corporateInfo?.shareholders || [];
    const shareholderIds = shareholders.map((shareholder) => shareholder._id.toString());

    const shareholderIdDocsMap = {};
    let authorizedPersonKycUploaded = false;
    let allShareholdersKycUploaded = false;
    let allAdditionalCorporateDocsUploaded = false;
    let individualDocsUploaded = false;

    customerDocs.forEach((doc) => {
      if (doc.subType === 'AUTHORIZED_PERSON' && requiredAuthorizedPersonDocs.includes(doc.type)) {
        if (doc.type === 'ID') {
          shareholderIdDocsMap.authorizedPersonId = true;
        } else if (doc.type === 'ADDRESS') {
          shareholderIdDocsMap.authorizedPersonAddress = true;
        }
      } else if (doc.subType === 'SHAREHOLDER' && requiredShareholderDocs.includes(doc.type)) {
        if (shareholderIds.includes(doc.shareholderId)) {
          if (!shareholderIdDocsMap[doc.shareholderId]) {
            shareholderIdDocsMap[doc.shareholderId] = {
              idUploaded: false,
              addressUploaded: false,
            };
          }
          if (doc.type === 'ID') {
            shareholderIdDocsMap[doc.shareholderId].idUploaded = true;
          } else if (doc.type === 'ADDRESS') {
            shareholderIdDocsMap[doc.shareholderId].addressUploaded = true;
          }
        }
      } else if (requiredAdditionalCorporateDocs.includes(doc.type)) {
        shareholderIdDocsMap[doc.type] = true;
      } else if (!doc.subType && requiredIndividualDocs.includes(doc.type)) {
        individualDocsUploaded = true;
      }
    });

    authorizedPersonKycUploaded = (
      shareholderIdDocsMap.authorizedPersonId && shareholderIdDocsMap.authorizedPersonAddress
    );
    allShareholdersKycUploaded = shareholderIds.every((shareholderId) => {
      const shareholderDocs = shareholderIdDocsMap[shareholderId];
      return (shareholderDocs && shareholderDocs.idUploaded && shareholderDocs.addressUploaded);
    });

    allAdditionalCorporateDocsUploaded = requiredAdditionalCorporateDocs.every((doc) => (
      shareholderIdDocsMap[doc] === true
    ));

    const allCorporateDocsUploaded = (
      authorizedPersonKycUploaded
      && allShareholdersKycUploaded
      && allAdditionalCorporateDocsUploaded
    );
    const allExist = (allCorporateDocsUploaded || individualDocsUploaded);

    if (updateStatus && allExist) {
      await customerService.updateById(customerId, { 'stages.kycUpload': true });
    }
    return allExist;
  }

  async isKycApproved(customerId, updateStatus = false) {
    const customerDocs = await this.find({
      type: { $in: keys.kycDocuments },
      customerId,
    });
    let allApproved = true;
    let anyRejected = false;
    let requiredDocs = ['ID', 'ADDRESS'];
    const customer = await customerService.findById(customerId);
    if (customer.isCorporate) requiredDocs = keys.kycDocuments;
    requiredDocs.every((key) => {
      const matched = customerDocs.find((obj) => obj.type === key && obj.status === 'APPROVED');
      if (!matched) {
        allApproved = false;
        return false;
      }
      return true;
    });
    requiredDocs.some((key) => {
      const matched = customerDocs.find((obj) => obj.type === key && obj.status === 'REJECTED');
      if (matched) {
        anyRejected = true;
        return true;
      }
      return false;
    });
    if (updateStatus && allApproved) {
      await customerService.updateById(customerId, { 'stages.kycApproved': true });
      await customerService.updateById(customerId, { 'stages.kycRejected': false });
    }
    if (updateStatus && anyRejected) {
      await customerService.updateById(customerId, { 'stages.kycRejected': true });
      await customerService.updateById(customerId, { 'stages.kycApproved': false });
    }
    return allApproved;
  }

  async updateKyc(customerId, applicantId, status) {
    switch (status) {
      case 'PENDING':
        return customerService.updateById(customerId, {
          'stages.kycRejected': false,
          'stages.kycApproved': false,
          'stages.kycUpload': true,
          'stages.kycExpired': false,
          'stages.sumsubId': applicantId,
        });
      case 'APPROVED':
        return customerService.updateById(customerId, {
          'stages.kycRejected': false,
          'stages.kycApproved': true,
          'stages.kycUpload': true,
          'stages.kycExpired': false,
          'stages.sumsubId': applicantId,
        });
      case 'REJECTED':
        return customerService.updateById(customerId, {
          'stages.kycRejected': true,
          'stages.kycApproved': false,
          'stages.kycUpload': true,
          'stages.kycExpired': false,
          'stages.sumsubId': applicantId,
        });
      case 'EXPIRED':
        return customerService.updateById(customerId, {
          'stages.kycRejected': false,
          'stages.kycApproved': false,
          'stages.kycUpload': false,
          'stages.kycExpired': true,
          'stages.sumsubId': applicantId,
        });
      default:
        return console.log('Unknown status', customerId, status);
    }
  }
}

async function docsWatcher() {
  const collection = mongoose.connection.db.collection('documents');
  const changeStream = collection.watch({ fullDocument: 'updateLookup' });
  changeStream.on('change', async (next) => {
    const {
      fullDocument, documentKey, operationType, updateDescription,
    } = next;
    console.log(fullDocument);
    const customer = await customerService.findById(fullDocument.customerId);
    if (operationType === 'insert') {
      let action = '';
      switch (fullDocument.type) {
        case 'ID': // register live handled in register controller
          action = EMAIL_ACTIONS.KYC_ID_UPLOAD;
          break;
        case 'ADDRESS':
          action = EMAIL_ACTIONS.KYC_ADDRESS_UPLOAD;
          break;
        default:
          return;
      }
      systemEmailService.sendSystemEmail(action, {
        to: customer.email,
        ...customer,
        ...fullDocument,
        lang: customer?.language,
      });
    } else if (operationType === 'update') {
      let action = '';
      switch (fullDocument.type) {
        case 'ID':
          // eslint-disable-next-line no-nested-ternary
          action = fullDocument.status === 'PENDING'
            ? EMAIL_ACTIONS.KYC_ID_UPLOAD
            : fullDocument.status === 'APPROVED'
              ? EMAIL_ACTIONS.KYC_ID_APPROVED
              : EMAIL_ACTIONS.KYC_ID_REJECTED;
          break;
        case 'ADDRESS':
          // eslint-disable-next-line no-nested-ternary
          action = fullDocument.status === 'PENDING'
            ? EMAIL_ACTIONS.KYC_ADDRESS_UPLOAD
            : fullDocument.status === 'APPROVED'
              ? EMAIL_ACTIONS.KYC_ADDRESS_APPROVED
              : EMAIL_ACTIONS.KYC_ADDRESS_REJECTED;
          break;
        default:
          return;
      }
      systemEmailService.sendSystemEmail(action, {
        to: customer?.email,
        ...customer,
        ...fullDocument,
        lang: customer?.language,
      });
    }
  });
}

dbConnectionUpCb(docsWatcher);

module.exports = new DocumentService(DocumentModel.Model, DocumentModel.Schema);
