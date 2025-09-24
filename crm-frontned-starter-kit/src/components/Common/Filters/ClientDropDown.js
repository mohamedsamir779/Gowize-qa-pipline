import React, { useEffect } from "react";
import { fetchClientsStart } from "store/client/actions";
import { useDispatch, connect } from "react-redux";
import ItemsDropDown from "./ItemsDropDown";
import { withTranslation } from "react-i18next";

function ClientDropDown({ ...props }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchClientsStart({ limit: 10000 }));

  }, []);

  let optionGroup = props.clients.map((obj) => {
    return ({
      label: `${obj.firstName} ${obj.lastName}`,
      value: obj._id
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
        lable={"Client"}
        defaultValue={props.defaultValue}
        elementChangeHandler={props.clientChangeHandler} />

    </React.Fragment>);
}

const mapStateToProps = (state) => ({
  clients: state.clientReducer.clients || [],
});

export default connect(mapStateToProps, null)(withTranslation()(ClientDropDown));