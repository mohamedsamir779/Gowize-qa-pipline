import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
//i18n
import { withTranslation } from "react-i18next";
import { toggleCurrentModal } from "store/actions";
import { JClickHandler } from "./handlers";

const IBJourney = (props) => {
  const dispatch = useDispatch();
  const [stages, setStages] = useState({
    kycApproved: false,
    kycUpload: false,
    kycRejected: false,
    startTrading: false,
    ib: {
      submitProfile: false,
      ibQuestionnaire: false,
      partnershipAgreement: false
    },
    loaded: false,
  });
  useEffect(()=>{
    if (props.stages){
      setStages({
        ...stages,
        loaded: true,
        kycUpload: props.stages.kycUpload,
        kycApproved: props.stages.kycApproved,
        kycRejected: props.stages.kycRejected,
        startTrading: props.stages.startTrading,
        ib: {
          ...props.stages.ib,
          submitProfile: props.stages.ib && props?.stages?.individual?.submitProfile || false,
          ibQuestionnaire: props.stages.ib && props.stages.ib.ibQuestionnaire,
          partnershipAgreement: props.stages.ib && props.stages.ib.partnershipAgreement,
        },
      });
    }
  }, [props.stages]);
  
  useEffect(() => {
    if (props.clientData) {
      if (props.stages && stages.loaded) {
        if (!stages?.ib?.submitProfile) {
          JClickHandler("IbJourney", props.stages, dispatch, toggleCurrentModal)();
        }
        else if (!stages.ib.ibQuestionnaire) {
          JClickHandler("IbJourney", props.stages, dispatch, toggleCurrentModal)();
        }
        else if (!stages.kycUpload) {
          JClickHandler("IbJourney", props.stages, dispatch, toggleCurrentModal)();

        }
      }
    }
  }, [stages, props.stages]);

  if (stages?.ib?.submitProfile && stages.ib.ibQuestionnaire && stages.kycApproved && stages.ib.partnershipAgreement) {
    return <></>;
  }

  return (
    <div className='mb-5'>
      {props.clientData && !props.clientData.isLead  && <React.Fragment>
        <h1 className='mb-2'>{props.t("How it works")}</h1>
        <p className='text-muted'>{props.t("Get starded with 4 easy steps")}</p>
        <div className='steps mb-5'>
          <div className={stages?.ib?.submitProfile ? "steps-card steps-complete text-center" : "steps-card text-center"}
            onClick={JClickHandler("IbJourney", props.stages, dispatch, toggleCurrentModal)}>
            <div className='number'>1</div>
            <div className='steps-card-title-container mb-3'>
              <span className='steps-card-title'>
                {props.t("Sign up")}
                <span className='custom-border'></span>
              </span>
            </div>
          </div>
          <div className={stages.ib.ibQuestionnaire ? "steps-card steps-complete text-center" : "steps-card text-center"}
            onClick={JClickHandler("IbJourney", props.stages, dispatch, toggleCurrentModal)}>
            <div className='number'>2</div>
            <div className='steps-card-title-container mb-3'>
              <span className='steps-card-title'>
                {props.t("IB Questionnaire")}
                <span className='custom-border'></span>
              </span>
            </div>
          </div>
          <div className={stages.kycApproved ? "steps-card steps-complete text-center" : "steps-card text-center"}
            onClick={JClickHandler("IbJourney", props.stages, dispatch, toggleCurrentModal)}>
            <div className='number'>3</div>
            <div className='steps-card-title-container mb-3'>
              <span className='steps-card-title'>
                {props.t("Verify")}
                <span className='custom-border'></span>
              </span>
            </div>
          </div>
          <div className={stages.ib.partnershipAgreement ? "steps-card steps-complete text-center" : "steps-card text-center"}
            onClick={JClickHandler("IbJourney", props.stages, dispatch, toggleCurrentModal)}>
            <div className='number'>4</div>
            <div className='steps-card-title-container mb-3'>
              <span className='steps-card-title'>
                {props.t("Partnership agreement")}
                <span className='custom-border'></span>
              </span>
            </div>
          </div>
        </div>
      </React.Fragment>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  stages: (state.Profile.clientData && state.Profile.clientData.stages) || {},
  clientData: state.Profile.clientData || {},
});
export default connect(mapStateToProps, null)(withTranslation()(IBJourney));