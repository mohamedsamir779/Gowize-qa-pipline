import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { 
  Button, Row, Col 
} from "reactstrap";
import { withTranslation } from "react-i18next";
import { toggleCurrentModal } from "store/actions";
import CustomModal from "components/Common/CustomModal";
import { 
  enableFX,
  enableCryptoWallets,
} from "config";

function SelectWithdrawalMethod({ isOpen, toggleOpen, ...props }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);  
    }
  }, [isOpen]); 
  const dispatch = useDispatch();
  function toggleTab(tab) {
    if (activeStep !== tab) {
      setActiveStep(tab);
    }
  }

  const steps = [
    {
      header: "Select Method",
      content: (
        <>
          <div>
            {/* text */}
            <Row>
              <h3>
                {props.t("Withdraw")}
              </h3>
              <small>
                {props.t("Select a way to withdraw")}
              </small>
            </Row>

            {/* deposit fiat */}
            <div className="mx-2">
              <Row>
                <Button
                  outline 
                  type="button"
                  color="danger"
                  className="waves-effect waves-light w-lg m-2 btn-lg"
                  onClick={() => {
                    dispatch(toggleCurrentModal("fiatWithdraw"));
                  }}
                >
                  <Row>
                    <Col md="2" sm="2">
                      <i className="icofont-dollar icofont-4x" />
                    </Col>

                    <Col md="9" sm="9">
                      <div className="d-flex flex-column text-start">
                        {props.t("Withdraw Wallet")} 
                        <small>{props.t("I want to withdraw from my wallets")}</small>
                      </div>
                    </Col>

                    <Col md="1" sm="1" className="align-self-center">
                      <i className="mdi mdi-arrow-right" />
                    </Col>
                  </Row>
                </Button>
              </Row>
            </div>
            {
              enableCryptoWallets && <>
                <Row>
                  <Button
                    outline 
                    type="button"
                    color="danger"
                    className="waves-effect waves-light w-lg m-2 btn-lg"
                    onClick={() => {
                      dispatch(toggleCurrentModal("cryptoWithdraw"));
                    }}
                  >
                    <Row>
                      <Col md="2" sm="2">
                        <i className="icofont-bitcoin icofont-4x" />
                      </Col>

                      <Col md="9" sm="9">
                        <div className="d-flex flex-column text-start">
                          {props.t("Withdraw Crypto")} 
                          <small>{props.t("I already have crypto and want to transfer them")}</small>
                        </div>
                      </Col>

                      <Col md="1" sm="1" className="align-self-center">
                        <i className="mdi mdi-arrow-right" />
                      </Col>
                    </Row>
                  </Button>
                </Row>
              </>
            }

            {enableFX &&  <div className="mx-2">
              <Row>
                <Button
                  outline 
                  type="button"
                  color="danger"
                  className="waves-effect waves-light w-lg m-2 btn-lg"
                  onClick={() => {
                    dispatch(toggleCurrentModal("mt5Withdraw"));
                  }}
                >
                  <Row>
                    <Col md="2" sm="2">
                      <i className="icofont-dollar icofont-4x" />
                    </Col>

                    <Col md="9" sm="9">
                      <div className="d-flex flex-column text-start">
                        {props.t("Withdraw CTRADER")} 
                        <small>{props.t("I want to withdraw from my CTRADER wallet")}</small>
                      </div>
                    </Col>

                    <Col md="1" sm="1" className="align-self-center">
                      <i className="mdi mdi-arrow-right" />
                    </Col>
                  </Row>
                </Button>
              </Row>
            </div>}
          </div>
        </>
      ),
    }
  ];

  return (
    <>
      <CustomModal
        steps={steps}
        size="md"
        isOpen={isOpen}
        toggleOpen={toggleOpen}
        activeStep={activeStep}
        toggleTab={toggleTab}
      ></CustomModal> 
    </>

  );
}
export default withTranslation()(SelectWithdrawalMethod); 
