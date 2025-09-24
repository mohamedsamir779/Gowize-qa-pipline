import CardWrapper from "components/Common/CardWrapper";
import CardHeader from "components/Forex/Common/CardHeader";
import { useTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";

function WireTransfer() {
  const { t } = useTranslation();
  return ( <>
    <CardHeader className="border-bottom-0" title={t("Wire Transfer")}></CardHeader>
    <Row>
      <Col lg={6}>
        <CardWrapper className="mt-3">
          <h6 className="border-bottom pb-3">{t("United Arab Emirates AED")}</h6>
          <ul>
            <li className="d-flex justify-content-between my-2">
              <div className="fw-bold">{t("Bank Name:")}</div>
              <div>{t("Commercial Bank of Dubai")}</div>
            </li>
            <li className="d-flex justify-content-between my-2">
              <div className="fw-bold">{t("Bank Name:")}</div>
              <div>{t("Commercial Bank of Dubai")}</div>
            </li> 
            <li className="d-flex justify-content-between my-2">
              <div className="fw-bold">{t("Bank Name:")}</div>
              <div>{t("Commercial Bank of Dubai")}</div>
            </li>   
            <li className="d-flex justify-content-between  my-2">
              <div className="fw-bold">{t("Bank Name:")}</div>
              <div>{t("Commercial Bank of Dubai")}</div>
            </li> 
            <li className="d-flex justify-content-between my-2">
              <div className="fw-bold">{t("Bank Name:")}</div>
              <div>{t("Commercial Bank of Dubai")}</div>
            </li>  
            <li className="d-flex justify-content-between my-2">
              <div className="fw-bold">{t("Bank Name:")}</div>
              <div>{t("Commercial Bank of Dubai")}</div>
            </li>
          </ul>
        </CardWrapper>
      </Col>
      
      <Col lg={6}>
        <CardWrapper className="mt-3">
          <h6 className="border-bottom pb-3">{t("United Arab Emirates AED")}</h6>
          <ul>
            <li className="d-flex justify-content-between my-2">
              <div className="fw-bold">{t("Bank Name:")}</div>
              <div>{t("Commercial Bank of Dubai")}</div>
            </li>
            <li className="d-flex justify-content-between my-2">
              <div className="fw-bold">{t("Bank Name:")}</div>
              <div>{t("Commercial Bank of Dubai")}</div>
            </li> 
            <li className="d-flex justify-content-between my-2">
              <div className="fw-bold">{t("Bank Name:")}</div>
              <div>{t("Commercial Bank of Dubai")}</div>
            </li>   
            <li className="d-flex justify-content-between  my-2">
              <div className="fw-bold">{t("Bank Name:")}</div>
              <div>{t("Commercial Bank of Dubai")}</div>
            </li> 
            <li className="d-flex justify-content-between my-2">
              <div className="fw-bold">{t("Bank Name:")}</div>
              <div>{t("Commercial Bank of Dubai")}</div>
            </li>  
            <li className="d-flex justify-content-between my-2">
              <div className="fw-bold">{t("Bank Name:")}</div>
              <div>{t("Commercial Bank of Dubai")}</div>
            </li>
          </ul>
        </CardWrapper>
      </Col>
    </Row>
  </> );
}

export default WireTransfer;