require("dotenv").config();
const baseUrl = process.env.REACT_APP_API_CP_DOMAIN;

export const getAssetImgSrc = (asset) => {
  if (asset && asset.image) {
    return `${baseUrl}/assets/${asset.image}`;
  } else {
    try {
      require(`../../public/images/logo/${asset.symbol}.svg`);
      return `images/logo/${asset.symbol}.svg`;
    } catch (error) {
      return "images/logo/exchanging.png";
    }
  }
};