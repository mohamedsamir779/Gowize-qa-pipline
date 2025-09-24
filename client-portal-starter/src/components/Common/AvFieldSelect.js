
import React, { useRef, useEffect } from "react";
import {
  AvField
} from "availity-reactstrap-validation";
import Select from "react-select";
import CustomSelect from "./CustomSelect";

function AvFieldSelecvt(props) {
  const ref1 = useRef();
  const [state, setState] = React.useState(null);
  const onFieldChange = (e) => {
    if (props.isMulti){
      setState(e);
    } else {
      setState(e.value);
      if (props.onChange) {
        props.onChange(e.value);
      }
    }
  };
  // useEffect(() => {
  //   if (props.value === undefined) {
  //     ref1.current.state.value = undefined;
  //   }
  // }, [props.value]);
  const { label, ...params } = props;
  let options = props.options || [];
  return (<React.Fragment>
    <label>{label}</label>
    <CustomSelect
      ref={ref1}
      placeholder={props.placeholder}
      options={options} 
      onChange={onFieldChange}
      isMulti={props.isMulti}
      maxMenuHeight={props.maxHeight}
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

export default AvFieldSelecvt;
