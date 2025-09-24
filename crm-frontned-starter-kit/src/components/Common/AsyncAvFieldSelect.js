
import React, { useRef } from "react";
import {
  AvField
} from "availity-reactstrap-validation";
import AsyncSelect from "react-select/async";
import { useSelector } from "react-redux";

function AsyncAvFieldSelect(props) {
  const ref1 = useRef();
  const [state, setState] = React.useState(null);
  const onFieldChange = (e) => {
    setState(e?.value || e);
    if (props.onChange) {
      props.onChange(e);
    }
  };


  const { 
    label,
    placeholder = "Search",
    loadOptions,
    isRequired = false,
    isSearchable = true,
    backspaceRemovesValue = true,
    defaultOptions = [],
    classNamePrefix = "select2-selection",
    value = null,
    isMulti = false,
    ...params
  } = props;

  let options = defaultOptions;
  if (props.placeholder) {
    options = [
      ...defaultOptions
    ];
  }
  
  // // if (props.value && options && options.length > 0) {
  // //   let option = options.find((obj) => obj.value === props.value);
  // //   ref1.current.select.select.setValue(option); 
  // // }

  // useEffect(() => {
  //   let option = options.find((obj) => obj.value === props.defaultValue);
  //   console.log("test", props.defaultValue, option, options);
  //   if (options && options.length > 0 && ref1.current.select.state.value !== option) {
  //     console.log(ref1.current);
  //     ref1.current.select.select.setValue(option); 
  //   }
  // }, [props.defaultValue, options]);
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
  return (<React.Fragment>
    { label ? <label>{label}</label> : null }
    
    <AsyncSelect
      ref={ref1}
      isClearable
      placeholder={placeholder}
      classNamePrefix={classNamePrefix}
      isRequired={isRequired}
      isSearchable={isSearchable}
      backspaceRemovesValue={backspaceRemovesValue}
      // name={params.name}
      loadOptions={loadOptions}
      defaultOptions={options}
      defaultValue={value}
      // defaultValue={value}
      isMulti={isMulti}
      onChange={onFieldChange}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          marginBottom: -10,
        }),
        ...customStyles
      }}
    />
    <AvField
      {...params}
      type="select"
      value={state === null ? props.value : state}
      style={{
        opacity: 0,
        height: 0,
        margin: -10,
        "pointerEvents": "none",
      }}
    >
      {options.map((obj, index) => {
        return (<option key={index} value={obj.value}>{obj.label}</option>);
      })}
    </AvField>
  </React.Fragment>);
}

export default AsyncAvFieldSelect;
