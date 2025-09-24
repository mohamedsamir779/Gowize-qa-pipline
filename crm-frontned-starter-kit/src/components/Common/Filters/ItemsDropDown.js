import React from "react";
import Select from "react-select";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

function ItemsDropDown(props) {
  let selectedElement = Object.keys(props.options) && props.options.find((obj) => (
    obj.value == props.defaultValue
  ));
  return (
    <React.Fragment>
      <div className="mb-3">
        <label htmlFor="choices-single-default" className="form-label font-size-14">{props.t(props.lable || "Lable")}</label>
        {
          !props.defaultValue &&
          <Select
            onChange={(e) => {
              props.elementChangeHandler(e);
            }}
            defaultValue={""}
            options={props.options}
            classNamePrefix="select2-selection"
            placeholder={props.t("All")}
          />
        }
        {
          props.defaultValue &&
          <Select
            onChange={(e) => {
              props.elementChangeHandler(e);
            }}
            defaultValue={selectedElement}
            options={props.options}
            classNamePrefix="select2-selection"
          />
        }
      </div>
    </React.Fragment>);
}


export default (withTranslation()(ItemsDropDown));