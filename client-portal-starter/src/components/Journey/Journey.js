import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import {
  connect, useDispatch, useSelector
} from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchProfile, toggleCurrentModal } from "store/actions";
import Loader from "components/Common/Loader";
import { JClickHandler } from "./handlers";
import { HIDE_JOU_OPEN_ACCOUNT } from "common/data/jourenykeys";

function Journey(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const [stages, setStages] = useState({
    kycApproved: false,
    kycUpload: false,
    kycRejected: false,
    startTrading: props.platformDownloaded || false,
    openAccount: false,
    madeDeposit: false,
    individual: {
      submitProfile: false,
    },
    loaded: false,
  });
  useEffect(() => {
    let isMounted = true;
    if (isMounted)
      if (props.stages && props.stages.kycUpload !== undefined) {
        setStages({
          ...stages,
          loaded: true,
          kycApproved: props.stages.kycApproved,
          kycUpload: props.stages.kycUpload,
          kycRejected: props.stages.kycRejected,
          startTrading: props.stages.startTrading,
          openAccount: props.stages.openAccount,
          madeDeposit: props.stages.madeDeposit,
          individual: {
            ...props.stages.individual,
            submitProfile: props.stages.individual && props.stages.individual.submitProfile,
          },
        });
      }
    return () => { isMounted = false };
  }, [props.stages]);
  useEffect(() => {
    let isMounted = true;
    if (isMounted)
      if (props.clientData) {
        if (props.stages && stages.loaded) {
          if (!stages.individual.submitProfile) {
            dispatch(toggleCurrentModal("SubmitIndProfile"));
          } else if (!stages.kycUpload) {
            dispatch(toggleCurrentModal("UploadKycModal"));
          } else if (!stages.kycApproved && stages.kycUpload) {
            dispatch(toggleCurrentModal("KYCProgress"));
          } else if (
            stages.kycApproved &&
            !stages.openAccount &&
            !localStorage.getItem(HIDE_JOU_OPEN_ACCOUNT)
          ) {
            dispatch(toggleCurrentModal("JourneyCreateAccount"));
          } else if (stages.openAccount && !stages.madeDeposit) {
            dispatch(toggleCurrentModal("selectDepositMethodModal"));
          } else {
            dispatch(toggleCurrentModal("StartTrading"));
          }
        }
      } else {
        dispatch(toggleCurrentModal("StartTrading"));
      }
    return () => { isMounted = false };
  }, [stages, props.stages]);

  useEffect(()=>{
    setStages({
      ...stages,
      startTrading: props.platformDownloaded
    });
  }, [props.platformDownloaded]);

  useEffect(() => {
    if (!stages?.loaded) {
      dispatch(fetchProfile({ history }));
    }
  }, []);

  const { isCorporate } = useSelector(state => state.Profile.clientData);

  if (!stages?.loaded) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (
    stages.individual.submitProfile &&
    stages.kycApproved &&
    stages.openAccount &&
    stages.madeDeposit &&
    stages.startTrading
  ) {
    return <></>;
  }

  return (
    <>
      <div className="dashboard mb-5">
        {
          <React.Fragment>
            <h2 className="mb-2">{props.t("Start trading in 5 steps:")}</h2>
            <div className="steps mb-5">
              <div
                className={
                  stages.individual.submitProfile
                    ? "steps-card steps-complete text-center"
                    : "steps-card text-center cursor-pointer"
                }
              >
                <div
                  className="number"
                  onClick={JClickHandler(
                    "SubmitIndProfile",
                    stages,
                    dispatch,
                    toggleCurrentModal,
                    isCorporate
                  )}
                >
                  1
                </div>
                <div className="steps-card-title-container mb-3">
                  <span className="steps-card-title">
                    {props.t("Sign up")}
                    <span className="custom-border"></span>
                  </span>
                </div>
              </div>
              <div
                className={
                  stages.kycApproved
                    ? "steps-card steps-complete text-center"
                    : "steps-card text-center cursor-pointer"
                }
                onClick={JClickHandler(
                  "kycUpload",
                  stages,
                  dispatch,
                  toggleCurrentModal,
                  isCorporate
                )}
              >
                <div className="number">2</div>
                <div className="steps-card-title-container mb-3">
                  <span className="steps-card-title">
                    {props.t("Verify Documents")}
                    <span className="custom-border"></span>
                  </span>
                </div>
              </div>
              <div
                className={
                  stages.openAccount
                    ? "steps-card steps-complete text-center"
                    : "steps-card text-center cursor-pointer"
                }
                onClick={JClickHandler(
                  "openAccount",
                  stages,
                  dispatch,
                  toggleCurrentModal,
                  isCorporate
                )}
              >
                <div className="number">3</div>
                <div className="steps-card-title-container mb-3">
                  <span className="steps-card-title">
                    {props.t("Open Account")}
                    <span className="custom-border"></span>
                  </span>
                </div>
              </div>
              <div
                className={
                  stages.madeDeposit
                    ? "steps-card steps-complete text-center"
                    : "steps-card text-center cursor-pointer"
                }
                onClick={JClickHandler(
                  "selectDepositMethodModal",
                  stages,
                  dispatch,
                  toggleCurrentModal,
                  isCorporate
                )}
              >
                <div className="number">4</div>
                <div className="steps-card-title-container mb-3">
                  <span className="steps-card-title">
                    {props.t("Deposit Funds")}
                    <span className="custom-border"></span>
                  </span>
                </div>
              </div>
              <div
                className={
                  stages.startTrading
                    ? "steps-card steps-complete text-center"
                    : "steps-card text-center cursor-pointer"
                }
                onClick={JClickHandler(
                  "startTrading",
                  stages,
                  dispatch,
                  toggleCurrentModal,
                  isCorporate
                )}
              >
                <div className="number">5</div>
                <div className="steps-card-title-container mb-3">
                  <span className="steps-card-title">
                    {props.t("Start Trading")}
                    <span className="custom-border"></span>
                  </span>
                </div>
              </div>
            </div>
          </React.Fragment>
        }
      </div>
    </>
  );
}


const mapStateToProps = (state) => ({
  stages: (state.Profile.clientData && state.Profile.clientData.stages) || {},
  clientData: state.Profile.clientData || {},
});
export default connect(mapStateToProps, null)(withTranslation()(Journey));