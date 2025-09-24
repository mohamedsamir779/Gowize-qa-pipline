import React, { useEffect, useState } from "react";
import CustomSelect from "./CustomSelect";

require("dotenv").config();
const baseUrl = process.env.REACT_APP_API_CP_DOMAIN;

function WalletsListSelect({ ...props }) { 
  const wallets = props?.wllates;
  const [options, setOptions] = useState([]); 
  useEffect(() => { 
    wallets.map((wallet, index) => {
      setOptions(options => {
        options[index] = {
          value: wallet,
          label: wallet.asset,
          image: getImgSrc(wallet),
        };
        return options;
      });
    });
  }, [wallets]);

  const getImgSrc = (wallet) => {
    //get image url
    if (wallet.image) {
      return `${baseUrl}/assets/${wallet.asset}.png`;
    } else
      return `images/logo/${wallet.asset}.svg`;
  }; 
  return (
    <CustomSelect
      options={options}
      {...props}
    >
    </CustomSelect>
  );
}

export default WalletsListSelect;