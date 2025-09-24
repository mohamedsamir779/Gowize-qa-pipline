export const validateFile = (allowedExtensions = [], size, file, messages) => (value, ctx, input, cb) => {
  const {
    sizeValidationMessage = "The file size is too large",
    extensionValidationMessage = "The file extension is not allowed",
  } = messages || {};
  const extension = value?.split(".")?.pop()?.toLowerCase();
  if (allowedExtensions.includes(extension) || !value){
    if (!value || file?.size <= size){
      cb(true);
    } else cb(sizeValidationMessage);
  } else cb(extensionValidationMessage);
};
