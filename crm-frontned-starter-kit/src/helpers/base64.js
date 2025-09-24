export const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

export const removeBase64Metadata = base64 => base64.split(",")[1];

export const getBase64ContentType = base64 => base64.split(",")[0].split(":")[1].split(";")[0];
