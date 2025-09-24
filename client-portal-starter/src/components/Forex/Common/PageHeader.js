import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MetaTags } from "react-meta-tags";
import {
  Button, Col, FormGroup, Input, Label, Row
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  switchSubPortal,
  toggleCurrentModal
} from "store/actions";
import { CUSTOMER_SUB_PORTALS } from "common/constants";
import SubmitIndvidualProfile from "components/Journey/Profiles/IndvidualProfile";
import { HIDE_JOU_IND_PROFILE } from "common/data/jourenykeys";
import { useState } from "react";
import { JClickHandler } from "components/Journey/handlers";

function PageHeader(props) {
  const shouldDisplayWithoutTitle = props.shouldDisplayWithoutTitle ? props.shouldDisplayWithoutTitle : false;
  const { t } = useTranslation();
  const { portal } = useSelector(state => state.forex.ForexLayout);
  const { subPortal } = useSelector(state => state.Layout);
  const { clientData } = useSelector(state => state.Profile);
  const [showSubmitIndProfileModal, setShowSubmitIndProfileModal] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { title } = props;
  const onSwitchIbToClient = (value) => {
    if (value === CUSTOMER_SUB_PORTALS.IB) {
      localStorage.setItem("subPortal", CUSTOMER_SUB_PORTALS.IB);
      dispatch(switchSubPortal(CUSTOMER_SUB_PORTALS.IB));
    } else {
      localStorage.setItem("subPortal", CUSTOMER_SUB_PORTALS.LIVE);
      dispatch(switchSubPortal(CUSTOMER_SUB_PORTALS.LIVE));
    }
  };
  return (
    <>
      <MetaTags>
        {t(title)}
      </MetaTags>
      <Row>
        <Col xs={12}>
          <div className="mb-3 d-flex">
            {portal && clientData?.fx?.isIb && clientData?.fx?.isClient && <>
              <FormGroup check className="my-auto me-3">
                <Input
                  name="radio2"
                  type="radio"
                  id="client"
                  checked={subPortal === CUSTOMER_SUB_PORTALS.LIVE}
                  onChange={() => {
                    onSwitchIbToClient(CUSTOMER_SUB_PORTALS.LIVE);
                    history.push("/dashboard");
                  }}
                />
                <Label check for="client">
                  {t("Client Portal")}
                </Label>
              </FormGroup>
              <FormGroup check className="my-auto">
                <Input
                  name="radio2"
                  type="radio"
                  id="ib"
                  checked={subPortal === CUSTOMER_SUB_PORTALS.IB}
                  onChange={() => {
                    onSwitchIbToClient(CUSTOMER_SUB_PORTALS.IB);
                    history.push("/dashboard");
                  }}
                />
                <Label check for="ib">
                  {t("IB Portal")}
                </Label>
              </FormGroup>
            </>}
          </div>
        </Col>
      </Row>
      <Row className="d-flex justify-content-between">
        <Col>
          <h1 className="mb-3">{shouldDisplayWithoutTitle ? t(title) : ""}</h1>
        </Col>
        <Col>
          <div className="d-flex justify-content-end">
            <Button className="color-bg-btn color-white mx-3 btn btn-light shadow border border-0 " onClick={() => history.push("/platforms")}
            >
              {t("Download Platform")}
            </Button>
            {subPortal === CUSTOMER_SUB_PORTALS.LIVE &&
              <>
                {/* <Button className="mx-3 btn btn-light shadow border border-0 color-bg-btn color-white" onClick={() => history.push("web-trader")}
                >
                  {t("Web Trader")}
                </Button> */}
                <Button className="mx-3 btn btn-light shadow-lg border border-0" style={{
                  backgroundColor: "#39b54a",
                  color: "white",
                }} onClick={() => {
                  JClickHandler("selectDepositMethodModal", clientData?.stages, dispatch, toggleCurrentModal)();
                }}
                >
                  {t("Deposit")}
                </Button>
                <SubmitIndvidualProfile
                  t={(str) => { return str }}
                  show={showSubmitIndProfileModal}
                  toggle={() => {
                    setShowSubmitIndProfileModal(!showSubmitIndProfileModal);
                    localStorage.setItem(HIDE_JOU_IND_PROFILE, true);
                  }} />
              </>
            }
          </div>
        </Col>
      </Row>
    </>);
}

export default PageHeader;