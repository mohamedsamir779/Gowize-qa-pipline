import { AvField } from "availity-reactstrap-validation";
import { Accordion } from "react-bootstrap";
import { Col, Row } from "reactstrap";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useSelector } from "react-redux";
import { COUNTRIES } from "common/data/dropdowns";
import AvFieldSelect from "components/Common/AvFieldSelect";

const GeneralInfo = ({ sameAddress, setSameAddress }) => {
  const { t } = useTranslation();
  const clientData = useSelector((state) => state.Profile.clientData);

  return (
    <Accordion.Item eventKey="0">
      <Accordion.Header>{t("General Information")}</Accordion.Header>
      <Accordion.Body>
        <div className="d-flex flex-column gap-3">
          <Row>
            <Col md="12">
              <AvField
                name="corporateInfo.nature"
                label={t("Nature of Business")}
                placeholder={t("Enter Nature of Business")}
                type="text"
                errorMessage={t("Nature of Business is required")}
                validate={{ required: { value: true } }}
                value={clientData.corporateInfo.nature}
              />
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <AvField
                name="dob"
                label={t("Date of Incorporation")}
                placeholder={t("Enter Date of Incorporation")}
                type="date"
                min={moment().subtract("110", "years").format("YYYY-MM-DD")}
                max={moment().subtract("18", "years").format("YYYY-MM-DD")}
                errorMessage={t("DOI is required")}
                validate={{
                  required: { value: true },
                  dateRange: {
                    format: "YYYY-MM-DD",
                    start: { value: moment().subtract("110", "years").format("YYYY-MM-DD") },
                    end: { value: moment().subtract("18", "years").format("YYYY-MM-DD") }
                  }
                }}
                value={clientData.dob}
              />
            </Col>
            <Col md="4">
              <AvField
                name="corporateInfo.turnOver"
                label={t("Annual Turnover")}
                placeholder={t("Enter Annual Turnover")}
                type="number"
                errorMessage={t("Annual Turnover is required")}
                validate={{ required: { value: true } }}
                value={clientData.corporateInfo?.turnOver}
              />
            </Col>
            <Col md="4">
              <AvField
                name="corporateInfo.balanceSheet"
                label={t("Balance Sheet Total Balance")}
                placeholder={t("Enter Balance Sheet")}
                type="number"
                errorMessage={t("Balance Sheet is required")}
                validate={{ required: { value: true } }}
                value={clientData?.corporateInfo?.balanceSheet}
              />
            </Col>
          </Row>
          <h5>{t("Registered Address")}</h5>
          <Row>
            <Col md="12">
              <AvField
                name="address"
                label={t("Address")}
                placeholder={t("Enter Address")}
                type="text"
                errorMessage={t("Address is required")}
                validate={{ required: { value: true } }}
                value={clientData.address}
              />
            </Col>
          </Row>
          <Row>
            <Col md="5">
              <AvFieldSelect
                errorMessage={t("Country is required")}
                placeholder={t("Select Country")}
                validate={{ required: { value: true } }}
                name="country"
                label={t("Country")}
                type="text"
                value={clientData.country}
                options={COUNTRIES.map((item) => {
                  return ({
                    label: `${item.countryEn}`,
                    value: item.countryEn
                  });
                })}
              />
            </Col>

            <Col md="5">
              <AvField
                name="city"
                label={t("City")}
                placeholder={t("Enter City")}
                type="text"
                errorMessage={t("City is required")}
                validate={{ required: { value: true } }}
                value={clientData.city}
              />
            </Col>
            <Col md="2">
              <AvField
                name="zipCode"
                label={t("Postal Code")}
                placeholder={t("Postal Code")}
                type="text"
                value={clientData.zipCode}
                validate={{ required: { value: true } }}
              />
            </Col>
          </Row>
          <h5>{t("HQ Address")}</h5>
          <AvField type="checkbox" name="corporateInfo.sameAddress" label={t("Same as Registered Address")} onChange={(e) => {
            if (e.target.checked) {
              setSameAddress(true);
            } else {
              setSameAddress(false);
            }
          }} />
          {!sameAddress && <>
            <Row>
              <Col md="12">
                <AvField
                  name="corporateInfo.hqAddress.address"
                  label={t("Address")}
                  placeholder={t("Enter Address")}
                  type="text"
                  errorMessage={t("Address is required")}
                  validate={{ required: { value: true } }}
                  value={clientData.corporateInfo?.hqAddress?.address}
                />
              </Col>
            </Row>
            <Row>
              <Col md="5">
                <AvFieldSelect
                  errorMessage={t("Country is required")}
                  placeholder={t("Select Country")}
                  validate={{ required: { value: true } }}
                  name="corporateInfo.hqAddress.country"
                  label={t("Country")}
                  type="text"
                  value={clientData.corporateInfo?.hqAddress?.country}
                  options={COUNTRIES.map((item) => {
                    return ({
                      label: `${item.countryEn}`,
                      value: item.countryEn
                    });
                  })}
                />
              </Col>

              <Col md="5">
                <AvField
                  name="corporateInfo.hqAddress.city"
                  label={t("City")}
                  placeholder={t("Enter City")}
                  type="text"
                  errorMessage={t("City is required")}
                  validate={{ required: { value: true } }}
                  value={clientData.corporateInfo?.hqAddress?.city}
                />
              </Col>
              <Col md="2">
                <AvField
                  name="corporateInfo.hqAddress.zipCode"
                  label={t("Postal Code")}
                  placeholder={t("Postal Code")}
                  type="text"
                  value={clientData.corporateInfo?.hqAddress?.zipCode}
                  validate={{ required: { value: true } }}
                />
              </Col>
            </Row>
          </>}
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default GeneralInfo;