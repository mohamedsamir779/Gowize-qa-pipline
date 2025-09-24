import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import { useTranslation, withTranslation } from "react-i18next";
import { addForexDeposit } from "../../../apis/deposit";
import calculateFee from "../../../helpers/calculateTranFee";

import CustomModal from "../../Common/CustomModal";
import CardWrapper from "../../Common/CardWrapper"; 
import Loader from "components/Common/Loader";
import AvFieldSelect from "components/Common/AvFieldSelect";
import { AvField, AvForm } from "availity-reactstrap-validation";
import { fetchCompanyBankAccounts } from "apis/bankAccounts";

function Mt5Deposit({ isOpen, toggleOpen, ...props }) { 
  // const wallets = useSelector((state) => state.crypto.wallets?.wallets);
  const tranFeeGroupDetails = useSelector((state) => state.Profile?.clientData?.transactionFeeId);
  const { accounts } = useSelector(state=> state.forex.accounts);
  const [loading, setLoading] = useState(false);
    
  const [activeStep, setActiveStep] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState("USD");
  const [amount, setAmount] = useState("");
  const [gateway, setGateway] = useState(""); 
  const [transactionFee, setTransactionFee] = useState("");
  const [result, setResult] = useState("");
  const [selectGatwayError, setSelectGatwayError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState();
  // used to check if amount is less than 15 then raise an error
  const [amountValidation, setAmountValidation] = useState(false);
  const [selectWalletError, setSelectWalletError] = useState(false);
  const [hoveredPaymentMethod, setHoveredPaymentMethod] = useState();
  const [bankAccount, setBankAccount] = useState({});
  const [banks, setBanks] = useState(null);

  const [receipt, setReceipt] = useState({});

  const validateFile = (value, ctx, input, cb)=> {
    const extensions = ["png", "jpg", "jpeg"];
    const extension = value.split(".")[1];
    if (extensions.includes(extension) || !value){
      if (!value || receipt?.size <= 2097152){
        cb(true);
      } else cb("2mb maximum size");
    } else cb("Only images can be uploaded");    
  };

  const { t } = useTranslation();
  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      // setSelectedWallet(defaultFiatWallet?.value);
      setGateway("");
      setAmount("");  
    }
  }, [isOpen]);

  const dispatch = useDispatch();
  function toggleTab(tab) {
    if (activeStep !== tab) {
      setActiveStep(tab);
    }
  }
  useEffect(() => {
    setTransactionFee(tranFeeGroupDetails ? calculateFee(tranFeeGroupDetails, amount) : 0);
  }, [tranFeeGroupDetails, amount]);

  useEffect(async () => {
    if (selectedPaymentMethod === "WIRE_TRANSFER") {
      setBanks(await fetchCompanyBankAccounts());
    }
  }, [selectedPaymentMethod]);

  const handleSubmit = (e, v) => {
    console.log(" Details 1 ");
    if (selectedPaymentMethod === "WIRE_TRANSFER") {
      const formData = new FormData();
      formData.append("gateway", gateway);
      formData.append("amount", parseInt(amount));
      formData.append("note", "note");
      formData.append("tradingAccountId", v.toAccount);
      formData.append("receipt", receipt);
      addForexDeposit(formData).then((e) => {
        // console.log(e);
        setResult(e);
        toggleTab(2);
      }).catch((e) => {
        // console.log(e);
        setResult(e);
        toggleTab(2);
      });
    }
    // event.preventDefault();
    // setLoading(true);
    addForexDeposit({
      gateway: gateway,
      amount: parseInt(amount),
      note: "note",
      tradingAccountId:v.toAccount
    })
      .then((e) => {
        // console.log(e);
        setResult(e);
        toggleTab(2);
      })
      .catch((e) => {
        // console.log(e);
        setResult(e);
        toggleTab(2);
      });
    // toggleOpen()
  };

  const validateStep1 = (e, v) => {
    if (selectedWallet === "") {
      setSelectWalletError(true);
      setTimeout(() => {
        setSelectWalletError(false);
      }, 2000);
    } 
    if (gateway === "") {
      setSelectGatwayError(true);
      setTimeout(() => {
        setSelectGatwayError(false);
      }, 2000);
    }
    if (gateway != "") {
      toggleTab(1);
    }
  };
  const validateStep2 = (e, v) => {
    if (amount == "") {
      setAmountError(true);
      setTimeout(() => {
        setAmountError(false);
      }, 2000);
    } else {
      handleSubmit(e, v);
    }
  };

  const amountValidationHanlder = (e) => {
    e.target.value < 15 ? setAmountValidation(true) : setAmountValidation(false);
  };

  const steps = [
    {
      header: t("Select Method"),
      content: (
        <>
          <div>
            <AvForm
              onValidSubmit={validateStep1}
            >
              <div className="mb-0">
                <h6 className="mb-3">
                  {props.t("Select Payment Method")}
                  {selectGatwayError && (
                    <p className="small text-danger ">
                      {props.t("Please Select Payment Method")}
                    </p>
                  )}
                </h6>
                <Row className="justify-content-center payment-methods">
                  {/* <Col xs={4} lg={2} className="my-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGateway("VISA");
                        setSelectedPaymentMethod("VISA");
                      }}
                      onMouseEnter={() => {setHoveredPaymentMethod("VISA")}}
                      onMouseLeave={() => {setHoveredPaymentMethod()}}
                      className={`btn btn-${selectedPaymentMethod === "VISA" ? "success" : hoveredPaymentMethod === "VISA" ? "default" : "light"} waves-effect waves-light w-sm py-4`}
                    >
                      <img
                        src="/img/payment-method/visa.png"
                        width="100%"
                        height="100%"
                        alt=""
                      ></img>
                    </button>
                  </Col>
                  <Col xs={4} lg={2} className="my-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGateway("MASTERCARD");
                        setSelectedPaymentMethod("MASTERCARD");
                      }}
                      onMouseEnter={() => {setHoveredPaymentMethod("MASTERCARD")}}
                      onMouseLeave={() => {setHoveredPaymentMethod()}}
                      className={`btn btn-${selectedPaymentMethod === "MASTERCARD" ? "success" : hoveredPaymentMethod === "MASTERCARD" ? "default" : "light"} waves-effect waves-light w-sm py-4`}
                    >
                      <img
                        src="/img/payment-method/mastercard-1.png"
                        width="100%"
                        height="100%"
                        alt=""
                      ></img>
                    </button>
                  </Col>
                  <Col xs={4} lg={2} className="my-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGateway("NETELLER");
                        setSelectedPaymentMethod("NETELLER");
                      }}
                      onMouseEnter={() => {setHoveredPaymentMethod("NETELLER")}}
                      onMouseLeave={() => {setHoveredPaymentMethod()}}
                      className={`btn btn-${selectedPaymentMethod === "NETELLER" ? "success" : hoveredPaymentMethod === "NETELLER" ? "default" : "light"} waves-effect waves-light w-sm py-4`}
                    >
                      <img
                        src="/img/payment-method/neteller.png"
                        width="100%"
                        height="100%"
                        alt=""
                      ></img>
                    </button>
                  </Col>
                  <Col xs={4} lg={2} className="my-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGateway("SKRILL");
                        setSelectedPaymentMethod("SKRILL");
                      }}
                      onMouseEnter={() => {setHoveredPaymentMethod("SKRILL")}}
                      onMouseLeave={() => {setHoveredPaymentMethod()}}
                      className={`btn btn-${selectedPaymentMethod === "SKRILL" ? "success" : hoveredPaymentMethod === "SKRILL" ? "default" : "light"} waves-effect waves-light w-sm py-4`}
                    >
                      <img
                        src="/img/payment-method/skrill.png"
                        width="100%"
                        height="100%"
                        alt=""
                      ></img>
                    </button>
                  </Col> */}
                  <Col xs={4} lg={2} className="my-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGateway("WIRE_TRANSFER");
                        setSelectedPaymentMethod("WIRE_TRANSFER");
                      }}
                      onMouseEnter={() => {setHoveredPaymentMethod("WIRE_TRANSFER")}}
                      onMouseLeave={() => {setHoveredPaymentMethod()}}
                      className={`btn btn-${selectedPaymentMethod === "WIRE_TRANSFER" ? "success" : hoveredPaymentMethod === "WIRE_TRANSFER" ? "default" : "light"} waves-effect waves-light w-sm py-4`}
                    >
                      <img
                        src="/img/payment-method/wire-transfer.png"
                        width="100%"
                        height="100%"
                        alt=""
                      ></img>
                    </button>
                  </Col>
                </Row>
              </div>
              {gateway == "WIRE_TRANSFER" && !banks && <Loader />}
              {gateway == "WIRE_TRANSFER" && banks && (
                <div className="mb-3">
                  <AvFieldSelect
                    name="bankAccount"
                    className="form-select"
                    onChange={(e) => {
                      setBankAccount(e);
                    }}
                    required
                    placeholder="Select Bank Account"
                    options={banks.map((bank) => {
                      return {
                        label:`${bank.bankName}`,
                        value: bank
                      };
                    })}
                  >
                  </AvFieldSelect>
                </div>
              )}
              {(gateway === "WIRE_TRANSFER" && Object.keys(bankAccount).length > 0) ?
                (
                  <>
                    <AvForm>
                      <h5 className="mb-4">{props.t("Payment details")}</h5>
                      <div>
                        <Label>{props.t("Bank Holder Name")}</Label>
                        <AvField
                          type="text"
                          name="accountHolderName"
                          value={bankAccount.accountHolderName}
                          validate={{ required:true }}
                          disabled={true}
                        >
                        </AvField>
                      </div>
                      <div>
                        <Label>{props.t("Bank Name")}</Label>
                        <AvField
                          type="text"
                          name="bankName"
                          value={bankAccount.bankName}
                          validate={{ required:true }}
                          disabled={true}
                        >
                        </AvField>
                      </div>
                      <div>
                        <Label>{props.t("Account Number")}</Label>
                        <AvField
                          type="text"
                          name="accountNumber"
                          value={bankAccount.accountNumber}
                          validate={{ required:true }}
                          disabled={true}
                        >
                        </AvField>
                      </div>
                      <div>
                        <Label>{props.t("Address")}</Label>
                        <AvField
                          type="text"
                          name="address"
                          value={bankAccount.address}
                          validate={{ required:true }}
                          disabled={true}
                        >
                        </AvField>
                      </div>
                      <div>
                        <Label>{props.t("Swift Code")}</Label>
                        <AvField
                          type="text"
                          name="swiftCode"
                          value={bankAccount.swiftCode}
                          validate={{ required:true }}
                          disabled={true}
                        >
                        </AvField>
                      </div>
                      <div>
                        <Label>{props.t("Currency")}</Label>
                        <AvField
                          type="text"
                          name="currency"
                          disabled={true}
                          value={bankAccount.currency}
                          validate={{ required:true }}
                        >
                        </AvField>
                      </div>
                      <p>{props.t("Bank Account")}</p>
                      <p className="text-muted">
                        {props.t("You MUST include the Reference Code in your deposit in order to credit your account!")}
                      </p>
                    </AvForm>
                  </>  
                )  : gateway == "SKRILL" ||
                gateway == "NETELLER" ||
                gateway == "MASTERCARD" ? (
                    <>
                      <p className="text-muted">{props.t("")}{props.t("Enter card information.")}</p>
                      <Row>
                        <AvForm>
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label
                                htmlFor="example-date-input"
                                className="form-label"
                              >
                                {props.t("Name")}
                              </Label>
                              <Input
                                className="form-control"
                                type="text"
                                id="example-date-input"
                              />
                            </div>
                          </Col>
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label
                                htmlFor="example-date-input"
                                className="form-label"
                              >
                                {props.t("Card Number")}
                              </Label>
                              <Input
                                className="form-control"
                                type="text"
                                id="example-date-input"
                              />
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="example-date-input"
                                className="form-label"
                              >
                                {props.t("Expiry date")}
                              </Label>
                              <Input
                                className="form-control"
                                type="date"
                                id="example-date-input"
                              />
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="example-date-input"
                                className="form-label"
                              >
                                {props.t("Security Code (CVV)")}
                              </Label>
                              <Input
                                className="form-control"
                                type="text"
                                id="example-date-input"
                              />
                            </div>
                          </Col>
                        </AvForm>
                      </Row>
                    </>
                  ) : (
                    ""
                  )
              }
              <div className="text-center mt-4">
                <Button
                  type="submit"
                  className="btn btn-success waves-effect waves-light w-lg btn-sm"
                >
                  {props.t("Continue")}
                </Button>
              </div>
            </AvForm>
          </div>
        </>
      ),
    },
    {
      header: "Enter Amount",
      content: (
        <>
          {
            <>
              <AvForm
                onValidSubmit={(e, v) => {
                  validateStep2(e, v);
                }}
              >
                <h6 className="mb-3">{props.t("Enter Amount")}</h6>
                <div className="d-flex justify-content-between mb-2">
                  <div>
                    <Label htmlFor="example-date-input" className="form-label">
                      {props.t("Amount")}
                    </Label>
                  </div>
                  <div>
                    {props.t("Transaction requirements")}
                    <i className="fas fa-info-circle ms-2"></i>
                  </div>
                </div>
                <InputGroup>
                  <Input
                    required
                    onChange={(e) => {
                      amountValidationHanlder(e);
                      setAmount(e.target.value);
                    }}
                    className="form-control"
                    type="number"
                    min="0"
                    value={amount}
                    placeholder="Enter 200-128341"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </InputGroup>
                {amountValidation && (
                  <p className="small text-danger "> {props.t("The minimum value for amount is 15")}</p>
                )}
                <div className="mt-3">
                  <AvFieldSelect
                    options={
                      accounts?.map(acc=>{
                        return {
                          label:`${acc.login} ${acc?.accountTypeId?.title || "-"} (${acc.balance || acc.Balance} ${acc.currency})`,
                          value: acc._id
                        };
                      })
                    }
                    name="toAccount"
                    type="text"
                    errorMessage={props.t("to account is required")}
                    validate={{ required: { value: true } }}
                    label={props.t("CTRADER Account")}
                  >
                  </AvFieldSelect>
                </div>
                {amountError && (
                  <p className="small text-danger "> {props.t("Please Select Account")}</p>
                )}
                <div className="text-center fw-bolder mt-4 received-amount">
                  <span className="fs-5">{selectedWallet?.label}</span>
                  <span className="fs-1">{amount}</span>
                </div>
                {/* <div className="text-center mb-4">You receive:</div> */}
                <div className="mb-3">
                  <Label className="form-label mb-2">{props.t("Transaction Fee")}</Label>
                  <InputGroup className="">
                    <InputGroupText className=" w-100">
                      {transactionFee}{"   "}{selectedWallet?.label}
                    </InputGroupText>
                    {/* <Input className="form-control border-start-0 text-end" type="text" placeholder="0.00 EUR" /> */}
                  </InputGroup>
                </div>
                <div className="mb-3">
                  <Label className="form-label" htmlFor="receipt">
                    {props.t("Receipt")}
                  </Label>
                  <AvField
                    type="file"
                    name="receipt"
                    className="form-control form-control-md"
                    errorMessage={props.t("Receipt is required")}
                    onChange={(e) => {
                      setReceipt(e.target.files[0]);
                    }}
                    validate={{ 
                      required: { value: true },
                      validate: validateFile,
                    }}
                  />
                </div>
                <div className="my-4 text-center">
                  <Button
                    className="btn btn-primary m-2 btn-sm w-lg"
                    onClick={() => toggleTab(0)}
                  >
                    {props.t("Back")}
                  </Button>
                  <Button
                    className="btn btn-success m-2 btn-sm w-lg"
                    type="submit"
                    disabled={loading}
                  >
                    {props.t("Continue")}
                  </Button>
                </div>
              </AvForm>
            </>
          }
        </>
      ),
    },
    {
      header: "Deposit status",
      content: (
        <>
          {result.status ? (
            <>
              <div className="text-center  mb-4">
                <h1 className="fs-1 mb-5">
                  {props.t("Yay!")} <i className="bx bx-wink-smile"></i>
                </h1>
                <p>{props.t("Pending Deposit Thank You")}</p>
                <p>
                  <span className="positive">
                    {result?.result?.amount["$numberDecimal"]}
                    {selectedWallet?.label}
                  </span>
                </p>
              </div>
              <CardWrapper className="mb-4">
                <div className="d-flex align-items-center justify-content-around px-4">
                  <div>
                    <div className="text-muted">{props.t("Status")}</div>
                    <div className="positive">{props.t("gateway")}</div>
                  </div>
                  <div>
                    <div className="text-muted">{result.result?.status}</div>
                    <div>{result.result?.gateway}</div>
                  </div>
                </div>
              </CardWrapper> 
            </>
          ) : (
            <>
              <div className="text-center  mb-4">
                <h1 className="fs-1 mb-5">
                  {props.t("Oops!")} <i className="bx sad"></i>
                </h1>
                <p>{props.t("Your Deposit Request Not Successfully Created")}</p>
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
              {props.t("Continue")}
            </Button>
          </div>
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
export default withTranslation()(Mt5Deposit); 
