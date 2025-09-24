import {
  AvCheckbox, AvCheckboxGroup, AvField
} from "availity-reactstrap-validation";
import { Accordion } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import parse from "html-react-parser";
import {
  CLIENT_AGREEMENT, IB_AGREEMENT, COUNTRY_REGULATIONS, E_SIGNATURE
} from "declarations";

const purpose = [
  "Improving source of Income",
  "Utilizing investment opportunities",
  "Asset perservation",
  "Planning for the future",
  "Asset development",
];


const Declerations = () => {
  const { t } = useTranslation();
  const { clientData } = useSelector((state) => state.Profile);
  return (
    <Accordion.Item eventKey="3">
      <Accordion.Header>{t("Declerations")}</Accordion.Header>
      <Accordion.Body>
        <h5>{t("Investment Purpose")}</h5>
        <Row className="my-3">
          <AvCheckboxGroup name="corporateInfo.purpose" required >
            {purpose.map((item, index) => (
              <AvCheckbox label={item} value={item} key={index} />
            ))}
          </AvCheckboxGroup>
        </Row>
        <Row>
          <h6 className="">
            {t("By Clicking Submit, you hereby confirm and agree to the following:")}
          </h6>
          <Col md={12}>
            <hr className="mt-0 mb-3" />
            <AvField
              name="agreement"
              label={clientData.isClient ? parse(CLIENT_AGREEMENT) : parse(IB_AGREEMENT)}
              type="checkbox"
              errorMessage={t("Please check the agreement")}
              validate={{ required: { value: true } }}
            />
            <AvField
              name="regulations"
              label={t(COUNTRY_REGULATIONS)}
              type="checkbox"
              errorMessage={t("Please check the agreement")}
              validate={{ required: { value: true } }}
            />
            <AvField
              name="signature"
              label={t(E_SIGNATURE)}
              type="checkbox"
              errorMessage={t("Please check the agreement")}
              validate={{ required: { value: true } }}
            />
          </Col>
        </Row>

      </Accordion.Body>
    </Accordion.Item>

  );
};

export default Declerations;