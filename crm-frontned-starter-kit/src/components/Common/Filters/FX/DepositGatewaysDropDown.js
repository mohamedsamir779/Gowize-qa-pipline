import React, { useEffect } from "react";
import { useDispatch, connect } from "react-redux";
import ItemsDropDown from "./../ItemsDropDown";
import { withTranslation } from "react-i18next";

function DepositGatewaysDropDown({ ...props }) {

  let optionGroup = Object.keys(props.gateways).map((key) => {
    return ({
      label: props.gateways[key].split("_").join(" ").toLowerCase(),
      value: key
    });
  });

  optionGroup.unshift({
    label: "All",
    value: ""
  });


  return (
    <React.Fragment>
      <ItemsDropDown
        options={optionGroup}
        lable={"Gateway"}
        defaultValue={props.defaultValue}
        elementChangeHandler={props.elementChangeHandler} />
    </React.Fragment>);
}

const mapStateToProps = (state) => ({
  gateways: state.forexGatewayReducer.forexDepositsGateways || [],
});

export default connect(mapStateToProps, null)(withTranslation()(DepositGatewaysDropDown));