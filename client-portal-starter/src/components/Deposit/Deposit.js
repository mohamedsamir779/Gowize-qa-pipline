import { useState, useEffect } from "react";
import {
  Button, Col, Row 
} from "reactstrap";
import { useTranslation, withTranslation } from "react-i18next";
import {
  addDeposit,
  addForexDeposit,
  paymentGatewayDeposit,
} from "apis/deposit";
import { allowedMethods } from "./Methods/allowedMethods";
import WireTransfer from "./Methods/WireTransfer";
import Signature from "./Methods/VisaMaster/Signature/Signature";
import SelfieCamera from "./Methods/VisaMaster/SelfieCamera/SelfieCamera";
import CheckKYC from "./Methods/VisaMaster/CheckKYC.js";
import Others from "./Methods/Others";
import CardWrapper from "components/Common/CardWrapper";
import CustomModal from "components/Common/CustomModal";
import StageTwo from "./StageTwo";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWallets,
  getAccountsStart,
} from "store/actions";
import OlxForex from "./Methods/OlxForex";
import CompanyCrypto from "./Methods/Crypto";
import A3tmad from "./Methods/A3tmad";
import PerfectMoney from "./Methods/PerfectMoney";
import Epayme from "./Methods/EpaymeForm";
import { uploadPDF } from "../../helpers/uploadPdf.js";


function Deposit({ isOpen, toggleOpen, type }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // Selectors
  const { wallets } = useSelector((state) => state?.walletReducer);
  const { clientData } = useSelector(state => state.Profile);
  // States
  const [activeStep, setActiveStep] = useState(0);
  const [gateway, setGateway] = useState("");
  const [result, setResult] = useState("");
    const [targetCurrency, setTargetCurrency] = useState("USD");

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState();
  // used to check if amount is less than 15 then raise an error
  const [hoveredPaymentMethod, setHoveredPaymentMethod] = useState();
  const [paymentPayload, setPaymentPayload] = useState({});

  const [isFirstStepValid, setIsFirstStepValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [resAmount, setResAmount] = useState(null);
  const [finitic_PayUrl, setFiniticPayUrl] = useState(null);

  const [baseCurrency, setBaseCurrency] = useState("USD");

  const [epaymeState, setEpaymeState] = useState({
    loading: false,
    isSuccess: false,
    isError: false,
    message: ""
  });
  const [paymentStatus, setPaymentStatus] = useState({
    isSuccess: false,
    isError: false,
    loading: true,
    result: ""
  });
  const firstVisaDeposit = clientData.isFirstDeposit == undefined || clientData.isFirstDeposit;

  // Effects
  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      setGateway("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (type === "mt5Deposit") {
      dispatch(getAccountsStart(
        {
          type: "LIVE",
        },
      ));
    } else if (!wallets) {
      dispatch(fetchWallets());
    }
  }, [type]);

  // Handlers
  function toggleTab(tab) {
    if (activeStep !== tab) {
      setActiveStep(tab);
    }
  }
  
  function loadScript(scriptURL, callback) {
    const script = document.createElement("script");
    script.src = scriptURL;
    script.async = true;
    script.onload = () => {
      if (callback) {
        callback();
      }
    };
    document.body.appendChild(script);
  }

  useEffect(()=>{
    if (selectedPaymentMethod === "EPAYME" && result.result && result.isSuccess){
      setPaymentStatus({
        ...paymentStatus,
        loading: true
      });
      let Epay = null;
      const initiateEPaySDK = (url, callback) => {
        loadScript(url, () => {
          console.log("epay is ready");
          Epay = window.Epay;
    
          if (callback) {
            callback(Epay);
          }
        });
      };
      initiateEPaySDK(result.result.url, (ePayMe) => {
        if (ePayMe) {
          if (result.result.orderId != "") {
            setPaymentStatus({
              ...paymentStatus,
              loading: true
            });
            const options = {
              customerId: result.result.customerId,
              channelId: "WEB",
              merchantId: result.result.merchantId,
              orderID: result.result.orderID,
              orderDescription: result.result.orderDescription,
              orderAmount: result.result.orderAmount,
              mobilenumber: result.result.mobilenumber,
              email: result.result.email || "",
              merchantType: "ECOMMERCE",
              orderCurrency: "USD",
              successHandler: async function (response) {
                // debugger;
                console.log("success", response);      
                let success = false;
                switch (response.response.transt) {
                  case "completed":
                    success = true;
                    setPaymentStatus({
                      ...paymentStatus,
                      isSuccess: true,
                      loading: false
                    });
                    break;
                  case "failed":
                    setPaymentStatus({
                      ...paymentStatus,
                      isError: true,
                      loading: false
                    });
                }
                setPaymentStatus({
                  ...paymentStatus,
                  loading: false
                });              },
              failedHandler: async function (response) {
                setPaymentStatus({
                  ...paymentStatus,
                  isError: true,
                  loading: false
                });
              }
            };
            const ePay = new ePayMe(options);
            ePay.open();
          }
        }
      });
    } else if (result.result){
      if (result.status) {
        setPaymentStatus({
          ...paymentStatus,
          isSuccess: true
        });
      } else {
        setPaymentStatus({
          ...paymentStatus,
          isError: true
        });
      }
    }
    return () => {
      setPaymentStatus({
        isError: false,
        isSuccess: false,
        loading: false
      });
    };
  }, [result]);

  const stageOnePaymentDetails = () => {
    switch (gateway) {
      case "WIRE_TRANSFER":
        return <WireTransfer t={t} setIsFirstStepValid={setIsFirstStepValid} />;
      case "FINITIC_PAY":
      case "PAYMAXIS":
      case "OLX_FOREX":
        return (
          <OlxForex t={t} setIsFirstStepValid={setIsFirstStepValid} />
        );
      case "EPAYME":
        return (
          <Epayme type={type} t={t} setIsFirstStepValid={setIsFirstStepValid}
            setBaseCurrency={setBaseCurrency} />
        );
      case "PERFECT_MONEY":
        return (
          <PerfectMoney t={t} setIsFirstStepValid={setIsFirstStepValid} />
        );
      case "NETELLER":
      case "MASTERCARD":
      case "SKRILL":
        return <Others t={t} setIsFirstStepValid={setIsFirstStepValid} setPaymentPayload={setPaymentPayload} />;
      case "CRYPTO":
        return (
          <CompanyCrypto
            t={t}
            setIsFirstStepValid={setIsFirstStepValid}
            setPaymentPayload={setPaymentPayload}
          />
        );
        case "VISA_MASTER":
        return (
          <CheckKYC
            t={t}
            setIsFirstStepValid={setIsFirstStepValid}
            setPaymentPayload={setPaymentPayload}/>
        );
      case "حواله بنكيه":
        return (
          <A3tmad t={t} setIsFirstStepValid={setIsFirstStepValid} />
        );
      default:
        return (
          <div className="text-center">
            <h5 className="mb-3">{t("Please Select Payment Method")}</h5>
          </div>
        );
    }
  };

function generateRandomNumber() {
    const timestamp = Math.floor(Date.now() / 1000).toString(16);
    const random = "xxxxxxxxxxxxxxxx".replace(/x/g, () =>
      Math.floor(Math.random() * 16).toString(16)
    );
    return (timestamp + random).toLowerCase();
  }
  const submitHandler = (data) => {
        if (selectedPaymentMethod == "VISA_MASTER") {
      if (type != "mt5Deposit") {
        data.gateway = "VISA_MASTER";
        
      }
      delete data.gateway;
      delete data.paymentPayload;
      data.description = data.note;
      delete data.note;      
      data.email = clientData.email;
      data.amount = `${data.amount}.00`;
      data.number = generateRandomNumber();   
    }
    if (selectedPaymentMethod == "VISA_MASTER" && firstVisaDeposit) {
      uploadPDF();
    }
    if (type === "fiatDeposit") {
      if (["OLX_FOREX", "PAYMAXIS", "VISA_MASTER"].includes(selectedPaymentMethod)) {
        data.currency = targetCurrency;
        paymentGatewayDeposit(data, selectedPaymentMethod)
          .then((res) => {
            setResult(res);
            toggleTab(2);
              if ((res.result.url || res.result.redirect_url) ) {
              window.location.href = res.result.url || res.result.redirect_url;
            }
          })
          .catch((err) => {
            setResult(err);
            toggleTab(2);
          });
      } else if (selectedPaymentMethod === "FINITIC_PAY") {
        paymentGatewayDeposit(data, selectedPaymentMethod)
          .then((res) => {
            console.log("testing mt4", res);
            setResult(res);
            toggleTab(2);
            setFiniticPayUrl(res?.result?.url);
          })
          .catch((err) => {
            setResult(err);
            toggleTab(2);
          });
      } else if (selectedPaymentMethod === "EPAYME") {
        paymentGatewayDeposit(data, selectedPaymentMethod)
          .then((res) => {
            setResult(res);
            toggleTab(2);
            // window.location.href = res.result.url;
            setFiniticPayUrl(res?.result?.url);
          
          })
          .catch((err) => {
            setResult(err);
            toggleTab(2);
          });
      } else {
        addDeposit(data)
          .then((res) => {
            setLoading(false);
            setResult(res);
            toggleTab(2);
          })
          .catch((err) => {
            setLoading(false);
            setResult(err);
            toggleTab(2);
          });
      }
    } else if (type === "mt5Deposit") {
      if (["FINITIC_PAY", "EPAYME", "PAYMAXIS", "VISA_MASTER"].includes(selectedPaymentMethod)) {
        paymentGatewayDeposit(data, selectedPaymentMethod)
          .then((res) => {
            setResult(res);
            toggleTab(2);
            setFiniticPayUrl(res?.result?.url);
            if ((res.result.url || res.result.redirect_url) && ["PAYMAXIS", "VISA_MASTER"].includes(selectedPaymentMethod)) {
             window.location.href = res.result.url || res.result.redirect_url;
            }
          })
          .catch((err) => {
            setResult(err);
            toggleTab(2);
          });
        return;
      } else {
        addForexDeposit(data, selectedAccount)
          .then((res) => {
            setResult(res);
            toggleTab(2);
          })
          .catch((err) => {
            setResult(err);
            toggleTab(2);
          });
      }
    }
    else {
      console.log("Type: ", { type });
    }
  };

  const steps = [
    {
      header: t("Select Method"),
      content: (
        <>
          <div>
            <div className="mb-0">
              <h6 className="mb-3">{t("Select Payment Method")}</h6>
              <Row className="justify-content-center payment-methods">
                {allowedMethods
                  .filter((method) => method.isSandbox ? clientData.email?.includes("mailinator.com") : true)
                  .filter((method) => method.allowed.includes(type))
                  .map((method) => {
                    if (!method.showForCountries || (method.showForCountries && method.showForCountries.includes(clientData.country)))
                      return <Col key={method.gateway} xs={4} lg={2} className="my-2">
                        <button
                          type="button"
                          onClick={() => {
                            setGateway(method.gateway);
                            setSelectedPaymentMethod(method.gateway);
                          }}
                          onMouseEnter={() => { setHoveredPaymentMethod(method.gateway) }}
                          onMouseLeave={() => { setHoveredPaymentMethod() }}
                          className={`btn btn-${selectedPaymentMethod === method.gateway ? "success" : hoveredPaymentMethod === method.gateway ? "default" : "light"} waves-effect waves-light w-sm py-4 d-flex align-items-center justify-content-center`}
                          style={{
                            maxWidth: "80px",
                            maxHeight: "80px",
                            height: "100%",
                          }}
                        >
                          <img
                            src={method.image}
                            width="100%"
                            height="100%"
                            style={{
                              objectFit: "contain",
                            }}
                            alt={method.name}
                          ></img>
                        </button>
                      </Col>;
                    })}
              </Row>
            </div>
            {gateway && stageOnePaymentDetails()}
            <div className="text-center mt-4">
              <Button
                type="submit"
                className="btn btn-success waves-effect waves-light w-lg btn-sm"
                disabled={gateway === "" || !isFirstStepValid}
                onClick={() => toggleTab(1)}
              >
                {t("Continue")}
              </Button>
            </div>
          </div>
        </>
      ),
    },
        ...(selectedPaymentMethod === "VISA_MASTER" && firstVisaDeposit
      ? [
        {
          header: "Signature",
          content: (
            <Signature toggleTab={toggleTab} activeStep={activeStep} />
          ),        
        },
      ]
      : []),
    ...(selectedPaymentMethod === "VISA_MASTER" && firstVisaDeposit
      ? [
        {
          header: "Selfie",
          content: (
            <SelfieCamera toggleTab={toggleTab} activeStep={activeStep} />
          ),
        },
      ]
      : []),
    {
      header: "Enter Amount",
      content: (
        <StageTwo
          t={t}
          setLoading={setLoading}
          loading={loading}
          toggleTab={toggleTab}
          type={type}
          gateway={gateway}
          setTargetCurrency={setTargetCurrency}
          selectedPaymentMethod={selectedPaymentMethod}
          handleSubmit={submitHandler}
          paymentPayload={paymentPayload}
          receipt={
            allowedMethods.find((method) => method.gateway === gateway)?.receipt
          }
        />
      ),
    },
    {
      header: "Deposit status",
      content: (
        <>
          {gateway === "FINITIC_PAY" && finitic_PayUrl ? (
            <div>
              {t("Please complete payment")}
              <div className="mt-4">
                <iframe
                  src={finitic_PayUrl}
                  title="Finitic Pay"
                  style={{
                    width: "100%",
                    height: "70vh",
                  }}
                />
              </div>
            </div>
          ) : (
            <div>
              {result.status ? (
                <>
                  <div className="text-center  mb-4">
                    <h1 className="fs-1 mb-5">
                      {t("Yay!")} <i className="bx bx-wink-smile"></i>
                    </h1>
                    <p>{t("Pending Deposit Thank You")}</p>
                    <p>
                      <span className="positive">
                        {type === "mt5Deposit"
                          ? result.result.currency === "CENT"
                            ? parseFloat(result?.result?.amount) * 100
                            : result?.result?.amount
                          : result?.result?.amount?.$numberDecimal}{" "}
                        {type === "fiatDeposit"
                          ? result?.result?.currency
                          : result?.result?.currency}
                      </span>
                    </p>
                    <span className="text-muted">
                      {t("Your transaction ID is")}
                      {result?.result?._id}
                    </span>
                  </div>
                  <CardWrapper className="mb-4">
                    <div className="d-flex align-items-center justify-content-around px-4">
                      <div>
                        <div className="text-muted">{t("Status")}</div>
                        <div className="positive">
                          {t(result?.result?.status)}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted">{t("GATEWAY")}</div>
                        <div>{result.result?.gateway}</div>
                      </div>
                    </div>
                  </CardWrapper>
                </>
              ) : (
                <>
                  <div className="text-center  mb-4">
                    <h1 className="fs-1 mb-5">
                      {t("Oops!")} <i className="bx sad"></i>
                    </h1>
                    <p>{t("Your Deposit Request Not Successfully Created")}</p>
                  </div>
                  <CardWrapper className="mb-4">
                    <div className="d-flex align-items-center justify-content-between px-5">
                      <div>
                        <div className="positive">{result.message}</div>
                      </div>
                    </div>
                  </CardWrapper>
                </>
              )}

              <div className="text-center">
                <Button
                  className="btn btn-danger m-2 btn-sm w-lg"
                  onClick={toggleOpen}
                >
                  {t("Continue")}
                </Button>
              </div>
            </div>
          )}
        </>
      ),
    },
  ];
  return (
    <>
      <CustomModal
        steps={steps}
        isOpen={isOpen}
        toggleOpen={toggleOpen}
        activeStep={activeStep}
        toggleTab={toggleTab}
      ></CustomModal>
    </>
  );
}
export default withTranslation()(Deposit);
