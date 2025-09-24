import React from "react";
import { useSelector } from "react-redux";
import Select, { components } from "react-select";

const { SingleValue, Option } = components;

function CustomSelect({ options, className, ...props }) {
  const { layoutMode } = useSelector(state => state.Layout);

  const IconSingleValue = (props) => (
    <SingleValue {...props}>
      {props.data.image && <img src={props.data.image} style={{
        height: "30px",
        width: "30px",
        borderRadius: "50%",
        marginRight: "10px"
      }} />}
      {props.data.label}
    </SingleValue>
  );

  const IconOption = (props) => (
    <Option {...props}>
      {props.data.image && <img src={props.data.image} style={{
        height: "30px",
        width: "30px",
        borderRadius: "50%",
        marginRight: "10px",
      }} />}
      {props.data.label}
    </Option>
  );

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
          backgroundColor: "#242632",
          border: 0,
          boxShadow: "0 0.125rem 0.25rem #0B182F",
          color: "#adb5bd",
          height: "100%",
        };
      }
      return {
        ...provided,
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

  return (<>
    <Select
      {...props}
      className={`basic-single ${className}`}
      styles={customStyles}
      components={{
        SingleValue: IconSingleValue,
        Option: IconOption,
      }}
      options={options}
    />
  </>);
}

export default CustomSelect;