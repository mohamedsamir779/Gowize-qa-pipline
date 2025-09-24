import React from "react";
import { useSelector } from "react-redux";

import CreatableSelect from "react-select/creatable";

const defaultComponent = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: label,
});

const CustomCreatableSelect = (props) => {

  const [inputValue, setInputValue] = React.useState("");
  const [value, setValue] = React.useState([]);

  React.useEffect(() => {
    if (props.value) {
      setValue(props.value);
    }
  }, [props.value]);


  const {
    isClearable = true,
    isMulti = true,
    placeholder = "Type something and press enter...",
    components = defaultComponent,
    label = "Custom Creatable Select",
    dispatchState,
  } = props;


  const handleKeyDown = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setValue((prev) => [...prev, createOption(inputValue)]);
        setInputValue("");
        if (dispatchState) {
          dispatchState([...value.map((item) => item.value), inputValue]);
        }
        event.preventDefault();
    }
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

  return (
    <CreatableSelect
      styles={customStyles}
      components={components}
      inputValue={inputValue}
      isClearable={isClearable}
      isMulti={isMulti}
      menuIsOpen={false}
      onChange={(newValue) => {
        setValue(newValue);
        if (dispatchState) {
          dispatchState([...newValue.map((item) => item.value)]);
        }
      }}
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      label={label}
      hint={placeholder}
      placeholder={placeholder}
      value={value}
    />
  );
};

export default CustomCreatableSelect;