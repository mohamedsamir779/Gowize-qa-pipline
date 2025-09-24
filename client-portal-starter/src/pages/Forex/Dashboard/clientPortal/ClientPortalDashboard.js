import React, { useState } from "react";
import Journey from "components/Journey/Journey";
import Slider from "../Silder";
import {
  Col, Row,
} from "reactstrap";
import { withTranslation, useTranslation } from "react-i18next"; 
import Accounts from "../Accounts";
import CardWrapper from "components/Common/CardWrapper";
import DepositTabs from "components/Forex/Deposit/DepositTabs";
import { useSelector, useDispatch } from "react-redux";
import Icofont from "react-icofont";
import { toggleCurrentModal } from "store/actions";
import Profiles from "components/Journey/Profiles/";
import { HIDE_JOU_IND_PROFILE } from "common/data/jourenykeys";
import { JClickHandler } from "components/Journey/handlers";
import Widget from "pages/Forex/Widget";
import DefaultSlider from "components/Slider/DefaultSlider";
import { showDefaultSlider } from "config";

const ClientPortalDashboard = () => {
  const [showSlider] = useState(true);
  const [type, setType] = useState("live");
  const [showSubmitIndProfileModal, setShowSubmitIndProfileModal] = useState(false);
  const { t } = useTranslation();
  const profileDetails = useSelector(state => state.Profile.clientData);
  const dispatch = useDispatch();
  const buttons =  [
    {
      title: t(`Create new ${type} Account`),
      onClick: () => {
        if ((profileDetails.stages.individual?.submitProfile) || type === "demo"){
          dispatch(toggleCurrentModal("CreateAccModal", type));
        } else {
          JClickHandler("madeDeposit", profileDetails.stages, dispatch, toggleCurrentModal)();
        }
      },
      iconName: "icofont-plus-circle me-1",
      disabled: !profileDetails?.stages?.kycApproved,
    }
  ];
  return (
    <>
      <Profiles t={(str) => { return str }} 
        show={showSubmitIndProfileModal}
        toggle={() => { setShowSubmitIndProfileModal(!showSubmitIndProfileModal); localStorage.setItem(HIDE_JOU_IND_PROFILE, true) }} />
      <div className="pt-3">
        {console.log(showDefaultSlider, "default", process.env.DEFAULT_BANNER)}
        {showSlider && 
          <DefaultSlider />
        }
      </div>
      {
        !profileDetails?.fx?.isDemo && <>
          <div className="pt-3" >
            <Journey></Journey>
          </div>
        </>
      }
      <div className="pt-3" >
        <Accounts buttons={buttons} type={type} setType={setType} />
      </div>
      <div className="pt-3" style={{
        marginBottom: "10%"
      }}>
        <Row>
          <Col lg={6} xs={12} className="my-2">
            <CardWrapper className="shadow glass-card" 
            >
              <div className="d-flex justify-content-between heading pb-2">
                <h5 className="color-primary">{t("Your Manager")}</h5>
                <div>
                  <svg width="3" height="15" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="2" cy="2" r="2" fill="#74788D"/>
                    <circle cx="2" cy="9" r="2" fill="#74788D"/>
                    <circle cx="2" cy="16" r="2" fill="#74788D"/>
                  </svg>
                </div>
              </div>
              <div className="d-flex flex-column justify-content-center align-items-center text-center manager-card" 
                style={{
                  height: "100%"
                }}
              >
                {profileDetails && profileDetails.manager ? 
                  <>
                    <Icofont icon="user" size="3" className="text-secondary" />
                    <div style={{ width:"85%" }}>
                      <h5>{profileDetails.manager.name}</h5>
                      <ul>
                        <li>
                          <span className="fw-bold">{t("Email")}: </span>
                          {profileDetails.manager.email}
                        </li>
                        {profileDetails.manager.phone && (
                          <li>
                            <span className="fw-bold">{t("Phone")}: </span> 
                            {profileDetails.manager.phone}
                          </li>
                        )}
                      </ul>
                    </div>
                  </> : 
                  <> 
                    {/* Center this div */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center", 
                    }}>
                      <h5 className="color-primary">{t("You do not have a Manager")}</h5>
                    </div>
                  </>
                }
                
              </div>
            </CardWrapper>
          </Col>
          <Col lg={6} xs={12} className="my-2">
            <CardWrapper  className="shadow glass-card" >
              <div className="d-flex justify-content-between heading pb-2">
                <h5 className="color-primary">{t("Add Funds")}</h5>
                <div>
                  <svg width="3" height="15" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="2" cy="2" r="2" fill="#74788D"/>
                    <circle cx="2" cy="9" r="2" fill="#74788D"/>
                    <circle cx="2" cy="16" r="2" fill="#74788D"/>
                  </svg>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-muted text-center">{t("Choose a payment to add funds into your account.")}</div>
                <DepositTabs></DepositTabs>
              </div>
            </CardWrapper>
          </Col>
          <Row style={{
            marginTop: "2%"
          }}>
            <Widget />
          </Row>
        </Row>
      </div>
    </>
  );
};

export default withTranslation()(ClientPortalDashboard);