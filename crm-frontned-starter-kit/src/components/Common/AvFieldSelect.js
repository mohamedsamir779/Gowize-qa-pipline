
import React, { useRef } from "react";
import {
  AvField
} from "availity-reactstrap-validation";
import Select from "react-select";
import { useSelector } from "react-redux";

function AvFieldSelect(props) {
  const ref1 = useRef();
  const [state, setState] = React.useState(null);
  const onFieldChange = (e) => {
    if (props.ismulti){
      setState(e.map(obj => obj.value));
      if (props.onChange) {
        props.onChange(e.map(obj => obj.value));
      }
    } else {
      setState(e.value);
      if (props.onChange) {
        props.onChange(e.value);
      }
    }
  };
  const { label, isDisabled, ...params } = props;
  let options = props.options || [];
  const { layoutMode } = useSelector(state => state.Layout);

  // React.useEffect(()=>{
  //   setState(params.value);
  // }, [props]);
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
    {label ? <label>{label}</label> : null}
    <Select
      ref={ref1}
      placeholder={props.placeholder}
      defaultValue={
        props.ismulti ? // takes array of values and returns array of objects
          props.value?.map(arrayElement => options.find(obj1 => obj1.value === arrayElement)) :
          options.find(obj => obj.value === props.value) || props.placeholder
      }
      options={options}
      onChange={onFieldChange}
      isMulti={props.ismulti}
      styles={customStyles}
      isDisabled={isDisabled}
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

export default AvFieldSelect;
