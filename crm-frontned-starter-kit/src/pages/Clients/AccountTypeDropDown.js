import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import Select from "react-select";
import config from "config";
import CustomSelect from "components/Common/CustomSelect";

export default function AccountTypeDropDown({ setAccountType }) {

  const [options, setOptions] = React.useState([
    {
      value: "CRYPTO",
      label: "CRYPTO"
    },
    { 
      value: "FOREX",
      label: "FX"
    }
  ]);

  const { t } = useTranslation();

  const isCrypToEnabled = config.enableCrypto;
  const isFxEnabled = config.enableFX;

  useEffect(() => {
    if (!isCrypToEnabled) {
      setOptions(options.filter((option) => option.value !== "CRYPTO"));
    }
    if (!isFxEnabled) {
      setOptions(options.filter((option) => option.value !== "FOREX"));
    }
  }, []);

  const handleChange = (e) => {
    setAccountType(e.value);
  };
  
  return (
    <React.Fragment>
      <div
        style={{
          minWidth: "200px",
        }}
      >
        <label htmlFor="choices-single-default" className="form-label font-size-14">{t("Account Type")}</label>
        <CustomSelect
          classNamePrefix="select2-selection"
          placeholder="Select an Account Type"
          options={options}
          onChange={handleChange}
          
        />
      </div>
    </React.Fragment>
  );
}
