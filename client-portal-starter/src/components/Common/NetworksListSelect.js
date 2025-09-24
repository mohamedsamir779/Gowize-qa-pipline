import React, { useEffect, useState } from "react";
import CustomSelect from "./CustomSelect";

function WalletsListSelect({ networks, ...props }) {

  const [options, setOptions] = useState([]);
  useEffect(() => {
    networks.map((network, index) => {
      setOptions(options => {
        options[index] = {
          value: network,
          label: network.chainId.name,
        };
        return options;
      });
    });
  }, [networks]);

  return (
    <CustomSelect
      options={options}
      {...props}
    >
    </CustomSelect>
  );
}

export default WalletsListSelect;