const multer = require('multer');
const getStream = require('into-stream');
const path = require('path');
const crypto = require('crypto');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1 } = require('uuid');
const blobStorage = require('@azure/storage-blob');
const keys = require('src/common/data/keys');
const { logger } = require('src/common/lib');

const storage = multer.memoryStorage();
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

const blobServiceClient = BlobServiceClient.fromConnectionString(
  keys.azureBlob.connectionString,
);
const containerClient = blobServiceClient.getContainerClient(
  keys.azureBlob.containerName,
);

const publicContainerClient = blobServiceClient.getContainerClient(
  keys.azureBlob.publicContainerName,
);

const createHash = (length = 8) => crypto.randomBytes(length).toString('hex');
// eslint-disable-next-line consistent-return
const getFileHash = (stream, isFileHashRequired, algorithm = 'md5') => new Promise((resolve, reject) => {
  if (isFileHashRequired) {
    const shasum = crypto.createHash(algorithm);
    try {
      stream.on('data', (data) => {
        shasum.update(data);
      });
      // making digest
      stream.on('end', () => {
        const hash = shasum.digest('hex');
        return resolve(hash);
      });
    } catch (error) {
      return reject(new Error('Error occurred while convert file into hash'));
    }
  } else {
    return resolve('');
  }
});

// TODO handle directly with stream
const uploadFile = async (
  buffer,
  mimetype,
  originalname,
  folderName,
  isFileHashRequired = true,
  useUuid = true,
  isPublic = false,
  safeFileName = null,
) => {
  const { name, ext } = path.parse(originalname);
  const safeName = name.replace(/[^a-z0-9-_]/gi, '_');
  const fileName = `${safeName}_${new Date().getTime()}${ext}`;
  const blobName = folderName
    ? `${folderName}/${safeFileName || (useUuid ? `${uuidv1()}_${fileName}` : fileName)}`
    : `${uuidv1()}`;
  let blockBlobClient;
  if (isPublic) {
    blockBlobClient = publicContainerClient.getBlockBlobClient(blobName);
  } else {
    blockBlobClient = containerClient.getBlockBlobClient(blobName);
  }
  const stream = getStream(buffer);
  // eslint-disable-next-line no-useless-catch
  try {
    const [uploadBlobResponse, docHash] = await Promise.all([
      blockBlobClient.uploadStream(
        stream,
        uploadOptions.bufferSize,
        uploadOptions.maxBuffers,
        { blobHTTPHeaders: { blobContentType: mimetype } },
      ),
      getFileHash(stream, isFileHashRequired).catch((reason) => logger.error(`${reason}, ${blobName}`)),
    ]);
    const result = {
      url: decodeURIComponent(blockBlobClient.url),
      fileName: blobName,
      docHash,
    };
    console.log('result', result);
    logger.info(
      `Blob was uploaded successfully. url: ${result.url} requestId: ${uploadBlobResponse.requestId}`,
    );

    return result;
  } catch (error) {
    throw error;
  }
};

const readFile = async (blobName) => {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const downloadBlockBlobResponse = await blockBlobClient.download(0);

    return {
      readableStream: downloadBlockBlobResponse.readableStreamBody,
      contentType: downloadBlockBlobResponse.originalResponse.contentType,
    };
  } catch (e) {
    logger.error(
      `Error occured while reading blob, possibility blob might be not found ${blobName}: ${e.message}`,
    );
  }

  return { readableStream: null, contentType: null };
};

const deleteFile = async (blobName) => {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.delete();
  return true;
};

const getFile = async (filename) => {
  const blockBlobClient = containerClient.getBlockBlobClient(filename);
  return blockBlobClient.download(0);
};

const generateSAS = async (blobName) => {
  const nameArr = blobName.split(`${keys.azureBlob.containerName}/`);
  const cerds = new blobStorage.StorageSharedKeyCredential(
    keys.azureBlob.blobName,
    keys.azureBlob.key,
  );

  const blobSAS = blobStorage.generateBlobSASQueryParameters({
    containerName: keys.azureBlob.containerName,
    blobName: nameArr[1],
    permissions: blobStorage.BlobSASPermissions.parse('racwd'),
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + 86400),
  },
  cerds).toString();

  // const sasUrl= blobServiceClient.url+'docs/'+blobName+"?"+blobSAS;
  const sasUrl = `${blobName}?${blobSAS}`;
  return sasUrl;
};

module.exports = {
  // TODO add file max filter
  // TODO allow only specific files
  uploadInMemory: multer({ storage }),
  uploadFile,
  readFile,
  deleteFile,
  getFile,
  generateSAS,
};
