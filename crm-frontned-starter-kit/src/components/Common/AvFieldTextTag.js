
import React, { useRef } from "react";
import {
  AvField
} from "availity-reactstrap-validation";
import Select from "react-select";

function AvFieldSelecvt(props) {
  const ref1 = useRef();
  const [state, setState] = React.useState(null);
  const onFieldChange = (e) => {
    setState(e);
  };
  const { label, ...params } = props;
  let options = props.options || [];
  if (props.placeholder) {
    options = [
      {
        label: props.placeholder,
        value: "",
      },
      ...options
    ];
  }
  let defArr = props.value || [];
  let defaultValue = options.filter(obj => defArr.indexOf(obj.value) > -1);
  
  return (<React.Fragment>
    <label>{label}</label>
    <Select
      ref={ref1}
      defaultValue={defaultValue}
      options={options} 
      onChange={onFieldChange}
      className="basic-multi-select"
      isMulti
      classNamePrefix="select"
    />
    <AvField
      {...params}
      type="select"
      value={state === null ? defaultValue : state}
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
