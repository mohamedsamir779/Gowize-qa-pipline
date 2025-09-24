import { getAssetImgSrc } from "helpers/assetImgSrc";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomSelect from "./CustomSelect";


function AssetsListSelect({ wallets, ...props }) {
  const { assets } = useSelector(state => state.assets);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    let as = wallets ? assets.filter((asset) => {
      if (wallets.find((x) => x?.assetId?.symbol === asset?.symbol)) {
        return asset;
      }
    }) : assets;
    as.map((asset, index) => {
      setOptions(options => {
        options[index] = {
          value: asset,
          label: asset.symbol,
          image: getAssetImgSrc(asset),
        };
        return options;
      });
    });
  }, [assets, wallets]);
  
  return (
    <CustomSelect
      {...props}
      options={options}
    >
    </CustomSelect>
  );
}

export default AssetsListSelect;