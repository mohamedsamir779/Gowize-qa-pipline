import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { 
  Button, Col, Row 
} from "reactstrap";
import { withTranslation } from "react-i18next";
import CustomModal from "components/Common/CustomModal";
import { toggleCurrentModal } from "store/actions";
import { 
  enableFX,
  enableCryptoWallets,
} from "config";

function SelectDepositMethod({ isOpen, toggleOpen, ...props }) {
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
      header: props.t("Select Method"),
      content: (
        <>
          <div>
            {/* text */}
            <Row>
              <h3>
                {props.t("Deposit")}
              </h3>
              <small>
                {props.t("Select a way to deposit")}
              </small>
            </Row>

            {/* deposit fiat */}
            <Row>
              <Row>
                <Button
                  outline 
                  type="button"
                  color="success"
                  className="waves-effect waves-light w-lg m-2 btn-lg"
                  onClick={() => {
                    dispatch(toggleCurrentModal("fiatDeposit"));
                  }}
                >
                  <Row>
                    <Col md="2" sm="2">
                      <i className="icofont-dollar icofont-4x" />
                    </Col>

                    <Col md="9" sm="9">
                      <div className="d-flex flex-column text-start">
                        {props.t("Deposit Wallet")} 
                        <small>{props.t("I want to deposit money to my wallet")}</small>
                      </div>
                    </Col>

                    <Col md="1" sm="1" className="align-self-center">
                      <i className="mdi mdi-arrow-right" />
                    </Col>
                  </Row>
                </Button>
              </Row>
            </Row>

            {
              enableCryptoWallets && (<>
                <Row>
                  <Button
                    outline 
                    type="button"
                    color="success"
                    className="waves-effect waves-light w-lg m-2 btn-lg"
                    onClick={() => {
                      dispatch(toggleCurrentModal("cryptoDeposit"));
                    }}
                  >
                    <Row>
                      <Col md="2" sm="2">
                        <i className="icofont-bitcoin icofont-4x" />
                      </Col>

                      <Col md="9" sm="9">
                        <div className="d-flex flex-column text-start">
                          {props.t("Deposit Crypto")} 
                          <small>{props.t("I already have crypto and want to transfer them to another crypto currency")}</small>
                        </div>
                      </Col>

                      <Col md="1" sm="1" className="align-self-center">
                        <i className="mdi mdi-arrow-right" />
                      </Col>
                    </Row>
                  </Button>
                </Row>
              </>)
            }

            {enableFX && <Row>
              <Row>
                <Button
                  outline 
                  type="button"
                  color="success"
                  className="waves-effect waves-light w-lg m-2 btn-lg"
                  onClick={() => {
                    dispatch(toggleCurrentModal("mt5Deposit"));
                  }}
                >
                  <Row>
                    <Col md="2" sm="2">
                      <i className="icofont-dollar icofont-4x" />
                    </Col>

                    <Col md="9" sm="9">
                      <div className="d-flex flex-column text-start">
                        {props.t("Deposit CTRADER")} 
                        <small>{props.t("I want to deposit into CTRADER Account")}</small>
                      </div>
                    </Col>

                    <Col md="1" sm="1" className="align-self-center">
                      <i className="mdi mdi-arrow-right" />
                    </Col>
                  </Row>
                </Button>
              </Row>
            </Row>}
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
export default withTranslation()(SelectDepositMethod); 
