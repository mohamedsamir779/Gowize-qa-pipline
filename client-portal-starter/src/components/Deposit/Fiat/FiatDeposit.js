import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
import { getAssetImgSrc } from "helpers/assetImgSrc";
import calculateFee from "../../../helpers/calculateTranFee";

import CustomModal from "../../Common/CustomModal";
import CardWrapper from "../../Common/CardWrapper"; 
import CustomSelect from "components/Common/CustomSelect";
import AvFieldSelect from "components/Common/AvFieldSelect";
import { AvField, AvForm } from "availity-reactstrap-validation";
import { fetchCompanyBankAccounts } from "apis/bankAccounts";
import { addDeposit } from "../../../apis/deposit";
import { validateFile } from "helpers/validations/file";
import { allowedMethods } from "../Methods/allowedMethods";

function FiatDeposit({ isOpen, toggleOpen }) {
  const { t } = useTranslation();
  // Selectors
  const tranFeeGroupDetails = useSelector((state) => state.Profile?.clientData?.transactionFeeId);
  const { wallets } = useSelector((state) => state?.walletReducer);

  const fiatWallets = wallets?.filter((wallet) => (
    wallet.isCrypto === false && wallet.isInventory === false
  )).map((item) => (
    {
      label: item.asset,
      value: item._id,
      image: getAssetImgSrc(item.assetId)
    }
  ));
  
  // States
  const [activeStep, setActiveStep] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState(fiatWallets[0]);
  const [amount, setAmount] = useState("");
  const [gateway, setGateway] = useState(""); 
  const [transactionFee, setTransactionFee] = useState("");
  const [result, setResult] = useState("");
  const [selectGatewayError, setSelectGatewayError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState();
  // used to check if amount is less than 15 then raise an error
  const [amountValidation, setAmountValidation] = useState(false);
  const [selectWalletError, setSelectWalletError] = useState(false);
  const [hoveredPaymentMethod, setHoveredPaymentMethod] = useState();
  const [bankAccount, setBankAccount] = useState({});
  const [banks, setBanks] = useState(null);
  const [file, setFile] = useState({});

  // Effects
  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      setGateway("");
      setAmount("");  
    }
  }, [isOpen]);

  useEffect(() => {
    setTransactionFee(tranFeeGroupDetails ? calculateFee(tranFeeGroupDetails, amount) : 0);
  }, [tranFeeGroupDetails, amount]);

  useEffect(async () => {
    if (selectedPaymentMethod === "WIRE_TRANSFER") {
      setBanks(await fetchCompanyBankAccounts());
    }
  }, [selectedPaymentMethod]);

  // Handlers
  function toggleTab(tab) {
    if (activeStep !== tab) {
      setActiveStep(tab);
    }
  }
  const handleSubmit = ( ) => {
    !amountValidation && !selectWalletError &&  
    addDeposit({
      gateway: gateway,
      walletId: selectedWallet?.value,
      amount: amount,
      note: "note",
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
  const validateStep1 = () => {
    if (selectedWallet === "") {
      setSelectWalletError(true);
      setTimeout(() => {
        setSelectWalletError(false);
      }, 2000);
    } 
    if (gateway === "") {
      setSelectGatewayError(true);
      setTimeout(() => {
        setSelectGatewayError(false);
      }, 2000);
    }
    if (gateway != "") {
      toggleTab(1);
    }
  };
  const validateStep2 = () => {
    if (amount == "") {
      setAmountError(true);
      setTimeout(() => {
        setAmountError(false);
      }, 2000);
    } else {
      handleSubmit();
    }
  };

  const amountValidationHandler = (e) => {
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
                  {t("Select Payment Method")}
                  {selectGatewayError && (
                    <p className="small text-danger ">
                      {t("Please Select Payment Method")}
                    </p>
                  )}
                </h6>
                <Row className="justify-content-center payment-methods">
                  {
                    allowedMethods.map((method) => (
                      <Col key={method.gateway} xs={4} lg={2} className="my-2">
                        <button
                          type="button"
                          onClick={() => {
                            setGateway(method.gateway);
                            setSelectedPaymentMethod(method.gateway);
                          }}
                          onMouseEnter={() => {setHoveredPaymentMethod(method.gateway)}}
                          onMouseLeave={() => {setHoveredPaymentMethod()}}
                          className={`btn btn-${selectedPaymentMethod === method.gateway ? "success" : hoveredPaymentMethod === method.gateway ? "default" : "light"} waves-effect waves-light w-sm py-4`}
                        >
                          <img
                            src={method.image}
                            width="100%"
                            height="100%"
                            alt=""
                          ></img>
                        </button>
                      </Col>
                    ))
                  }
                </Row>
              </div>
              {
                gateway !== "" && <></>
              }
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
                    validate={{
                      required: {
                        value: true,
                        errorMessage: t("Please select bank account"),
                      },
                    }}
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
                      <h5 className="mb-4">{t("Payment details")}</h5>
                      <div>
                        <Label>{t("Bank Holder Name")}</Label>
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
                        <Label>{t("Bank Name")}</Label>
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
                        <Label>{t("Account Number")}</Label>
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
                        <Label>{t("Address")}</Label>
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
                        <Label>{t("Swift Code")}</Label>
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
                        <Label>{t("Currency")}</Label>
                        <AvField
                          type="text"
                          name="currency"
                          disabled={true}
                          value={bankAccount.currency}
                          validate={{ required:true }}
                        >
                        </AvField>
                      </div>
                      <p>{t("Bank Account")}</p>
                      <p className="text-muted">
                        {t("You MUST include the Reference Code in your deposit in order to credit your account!")}
                      </p>
                    </AvForm>
                  </>  
                )  : gateway == "SKRILL" ||
                gateway == "NETELLER" ||
                gateway == "MASTERCARD" ? (
                    <>
                      <p className="text-muted">{t("")}{t("Enter card information.")}</p>
                      <Row>
                        <AvForm>
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label
                                htmlFor="example-date-input"
                                className="form-label"
                              >
                                {t("Name")}
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
                                {t("Card Number")}
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
                                {t("Expiry date")}
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
                                {t("Security Code (CVV)")}
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
                  {t("Continue")}
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
        <AvForm
          onValidSubmit={(e, v) => {
            validateStep2(e, v);
          }}
        >
          <h6 className="mb-3">{t("Enter Amount")}</h6>
          <div className="d-flex justify-content-between mb-2">
            <div>
              <Label htmlFor="example-date-input" className="form-label">
                {t("Amount")}
              </Label>
            </div>
            <div>
              {t("Transaction requirements")}
              <i className="fas fa-info-circle ms-2"></i>
            </div>
          </div>
          <div className="mt-3">
            <InputGroup>
              <Input
                required
                onChange={(e) => {
                  amountValidationHandler(e);
                  setAmount(e.target.value);
                }}
                className="form-control"
                type="number"
                min="0"
                value={amount}
                placeholder="Enter 15-128341"
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <InputGroupText className="custom-input-group-text p-0 border-0">
                <div style={{
                  width: "127px",
                  height: "100%"
                }}
                >
                  <CustomSelect
                    placeholder="Select"
                    name="wallets"
                    isRequired
                    options={fiatWallets}
                    defaultValue={selectedWallet}
                    onChange={(e) => {
                      setSelectedWallet(e);
                    }}
                  >
                  </CustomSelect>
                </div>
              </InputGroupText>
            </InputGroup>
          </div>
          {amountError && (
            <p className="small text-danger "> {t("Please Enter Account")}</p>
          )}
          <div className="text-center fw-bolder mt-4 received-amount">
            <span className="fs-5">{selectedWallet?.label}</span>
            <span className="fs-1">{amount}</span>
          </div>
          {/* <div className="text-center mb-4">You receive:</div> */}
          <div className="mb-3">
            <Label className="form-label mb-2">{t("Transaction Fee")}</Label>
            <InputGroup className="">
              <InputGroupText className=" w-100">
                {transactionFee}{"   "}{selectedWallet?.label}
              </InputGroupText>
              {/* <Input className="form-control border-start-0 text-end" type="text" placeholder="0.00 EUR" /> */}
            </InputGroup>
          </div>
          <div className="mb-3">
            <Label className="form-label" htmlFor="receipt">
              {t("Receipt")}
            </Label>
            <AvField
              type="file"
              name="receipt"
              className="form-control form-control-md"
              errorMessage={t("Receipt is required")}
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
              validate={{ 
                required: { value: true },
                validate: validateFile(["jpg", "jpeg", "png"], 2097152, file, {
                  sizeValidationMessage: t("File size must be less than 2MB"),
                  extensionValidationMessage: t("File type must be jpg, jpeg or png"),
                }),
              }}
            />
          </div>
          <div className="my-4 text-center">
            <Button
              className="btn btn-primary m-2 btn-sm w-lg"
              onClick={() => toggleTab(0)}
            >
              {t("Back")}
            </Button>
            <Button
              className="btn btn-success m-2 btn-sm w-lg"
              type="submit"
            >
              {t("Continue")}
            </Button>
          </div>
        </AvForm>
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
                  {t("Yay!")} <i className="bx bx-wink-smile"></i>
                </h1>
                <p>{t("Pending Deposit Thank You")}</p>
                <p>
                  <span className="positive">
                    {result?.result?.amount["$numberDecimal"]}
                    {selectedWallet.label}
                  </span>
                </p>
              </div>
              <CardWrapper className="mb-4">
                <div className="d-flex align-items-center justify-content-around px-4">
                  <div>
                    <div className="text-muted">{t("Status")}</div>
                    <div className="positive">{t("gateway")}</div>
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
export default withTranslation()(FiatDeposit); 
