import React, { useEffect } from "react";
import { fetchDictionaryStart } from "store/dictionary/actions";
import { useDispatch, connect } from "react-redux";
import Select from "react-select";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { withTranslation } from "react-i18next";
import {
  Col,
  Row
} from "reactstrap";
import moment from "moment";
function FromToDate({ ...props }) {

  let
    {
      filterDate = {
        fromDate: "",
        toDate: ""
      }
    }
      = props;

  return (
    <React.Fragment>

      <Row>
        <Col className="col-6 mb-3">
          <AvField
            type="datetime-local"
            name="filterDate.fromDate"
            value={filterDate?.fromDate ? String(moment(filterDate.fromDate).format("YYYY-MM-DDTHH:mm")) : ""}
            label={props.t("From")}
            onChange={(e) => {
              const dt = e.target["value"] ;//+ ":00Z";
              props.dateChangeHandler({
                ...filterDate,
                fromDate: dt
              });
            }}
          >
          </AvField>
        </Col>
        <Col className="col-6 mb-3">
          <AvField
            type="datetime-local"
            name="filterDate.toDate"

            value={filterDate?.toDate ? String(moment(filterDate.toDate).format("YYYY-MM-DDTHH:mm")) : ""}
            label={props.t("To")}
            onChange={(e) => {
              const dt = e.target["value"];// + ":00Z";
              props.dateChangeHandler({
                ...filterDate,
                toDate: dt
              });
            }}

          >
          </AvField>
        </Col>
      </Row>

    </React.Fragment>);
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, null)(withTranslation()(FromToDate));