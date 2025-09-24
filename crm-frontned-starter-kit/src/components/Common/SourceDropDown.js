import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import Select from "react-select";
import CustomSelect from "./CustomSelect";

export default function SourceDropDown({ setSource }) {

  const options = [
    {
      value: "CRM",
      label: "CRM"
    },
    {
      value: "FACEBOOK",
      label: "Facebook"
    },
    {
      value: "INSTAGRAM",
      label: "Instagram"
    },
    {
      value: "GOOGLE",
      label: "Google"
    },
    {
      value: "WEBSITE",
      label: "Website"
    },
    {
      value: "OTHER",
      label: "Other"
    },
  ];

  const { t } = useTranslation();

  const handleChange = (e) => {
    setSource(e.value);
  };

  return (
    <React.Fragment>
      <div
        style={{
          minWidth: "200px",
        }}
      >
        <label htmlFor="choices-single-default" className="form-label font-size-14">{t("Source")}</label>
        <CustomSelect
          classNamePrefix="select2-selection"
          placeholder="Select Source"
          options={options}
          onChange={handleChange}
        />
      </div>
    </React.Fragment>
  );
}
