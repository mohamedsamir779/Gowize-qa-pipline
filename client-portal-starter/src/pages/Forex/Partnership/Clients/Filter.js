import { useEffect, useState } from "react";
import CardWrapper from "components/Common/CardWrapper";
import { useTranslation, withTranslation } from "react-i18next";
import {
  Row, Col, Label, Input 
} from "reactstrap";
import CustomSelect from "components/Common/CustomSelect";


function LiveClientActivity() {
  const { t } = useTranslation();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [filter, setFilter] = useState();

  useEffect(() => {

  }, [fromDate, toDate, filter]);

  return ( 
    <>
      <CardWrapper className="accounts-tab">
        {/* <div className="border rounded-3 mt-4">
        </div> */}
        <Row>
          {/* fromDate */}
          <Col>
            <div>
              <Label>{t("From Date")}</Label>
              <Input
                className="form-control"
                type="date"
                id="toDate"
                onChange={(e) => {setFromDate(e.target.value)}}
              />
            </div>
          </Col>

          {/* toDate */}
          <Col>
            <div>
              <Label>{t("To Date")}</Label>
              <Input
                className="form-control"
                type="date"
                id="toDate"
                onChange={(e) => {setToDate(e.target.value)}}
              />
            </div>
          </Col>

          {/* filter */}
          <Col>
            <Label>{t("Filter")}</Label>
            <div>
              <CustomSelect
                isClearable={true}
                isSearchable={true}
                // options={currencyOptions}
                onChange={(e) => {
                  setFilter(e?.value);
                }}
              />
            </div>
          </Col>

          {/* search */}
          <Col>
            <div className="d-flex flex-row mt-4">
              <input 
                type="text" 
                className="form-control"
                placeholder="Search..." 
              />
              <button className="btn btn-primary" type="button">
                <i className="bx bx-search-alt align-middle" />
              </button>
            </div>
          </Col>
        </Row>
      </CardWrapper>
    </> 
  );
}

export default withTranslation()(LiveClientActivity);