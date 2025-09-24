/* eslint-disable indent */
import { startCase } from "lodash";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import { fetchDictionaryStart } from "store/dictionary/actions";
import { updateCallStatus } from "store/leads/actions";
import { updateClientCallStatus } from "store/client/actions";
import ToolTipData from "./ToolTipData";

const CallStatusDropdown = ({ client, label }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { callStatus: csOptions, updateCallStatusLoading } = useSelector(
    (state) => ({
      callStatus: state.dictionaryReducer.callStatus || [],
      updateCallStatusLoading: state.leadReducer.updateCallStatusLoading,
    })
  );

  const updateClientCallStatusLoading = useSelector(
    (state) => state.clientReducer.updateCallStatusLoading
  );
  const { enableCallStatusColors, callStatusColors } = useSelector(
    (state) => state.Profile.settings
  );

  const optionMulti =
    Object.keys(csOptions)?.map((stage) => ({
      value: stage,
      label: startCase(stage),
    })) || [];

  const [callStatus, setCallStatus] = useState(client.callStatus || null); // [null, () => { }

  useEffect(() => {
    if (!csOptions) {
      dispatch(fetchDictionaryStart());
    }
  }, [csOptions]);

  const handleChange = (e) => {
    setCallStatus(e.value);
    dispatch(
      client.isLead
        ? updateCallStatus(client._id, e.value)
        : updateClientCallStatus(client._id, e.value)
    );
  };

  const { layoutMode } = useSelector(state => state.Layout);
  const customStyles = {
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#495057",
      padding: 0,
      paddingRight: "5px",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none"
    }),
    control: (provided) => {
      if (layoutMode === "dark") {
        return {
          ...provided,
          backgroundColor: "#19283B",
          border: 0,
          boxShadow: "0 0.125rem 0.25rem #0B182F",
          color: "#adb5bd",
          height: "100%",
        };
      }
      return {
        ...provided,
        height: "100%",
      };
    },
    menu: (provided) => ({
      ...provided,
      backgroundColor: layoutMode === "dark" ? "#242632" : "white",
      color: layoutMode === "dark" ? "#adb5bd" : "#495057",
      zIndex: 3,
    }),
    option: (provided, state) => ({
      ...provided,
      display: state.isDisabled ? "none" : "flex",
      flexDirection: "row",
      alignItems: "center",
      color: layoutMode === "dark" ? "#adb5bd" : "#495057",
    }),
    singleValue: (provided) => {
      return {
        ...provided,
        flexDirection: "row",
        alignItems: "center",
        color: layoutMode === "dark" ? "#adb5bd" : "#495057",
      };
    },
  };

  const dot = (color = "transparent") => (
    enableCallStatusColors && {
      alignItems: "center",
      display: "flex",
      ":before": {
        backgroundColor: color,
        borderRadius: 10,
        content: "' '",
        display: "block",
        marginRight: 8,
        height: 10,
        width: 10,
      },
    });
    
  return (
    <>
      <div
        id={`CallStatusToolTip_${client._id}`}
        className="call-status-dropdown"
      >
        {label && <label>{t(label)}</label>}
        <Select
          options={optionMulti}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
              width: "200px",
            }),
            singleValue: (styles, { data }) => ({
              ...styles,
              maxWidth: "192px",
              ...dot(callStatusColors?.[data?.value]),
            }),
            option: (styles, { data, isSelected, isDisabled }) => ({
              ...styles,
              color: isDisabled
                ? "#ccc"
                : isSelected
                ? "#fff"
                : enableCallStatusColors && callStatusColors[data.value],
            }),
            control: (styles) => ({
              ...styles,
              flexWrap: "nowrap",
              minWidth: "120px",
            }),
            ...customStyles
          }}
          value={
            callStatus
              ? {
                  label: startCase(callStatus),
                  value: callStatus,
                }
              : null
          }
          onChange={handleChange}
          isLoading={updateCallStatusLoading || updateClientCallStatusLoading}
          placeholder={t("Select Call Status")}
          isDisabled={
            !client || updateCallStatusLoading || updateClientCallStatusLoading
          }
        />
      </div>
      {callStatus && (
        <ToolTipData
          target={`CallStatusToolTip_${client._id}`}
          placement="top"
          data={t(startCase(callStatus))}
        />
      )}
    </>
  );
};

export default CallStatusDropdown;
