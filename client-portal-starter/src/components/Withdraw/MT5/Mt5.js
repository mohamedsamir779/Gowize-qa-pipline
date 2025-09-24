/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
import { addFxWithdraw } from "../../../apis/withdraw";
import calculateFee from "../../../helpers/calculateTranFee";
import CardWrapper from "../../Common/CardWrapper";
import CustomModal from "../../Common/CustomModal";
import AddBankAccountModal from "../../BankAccounts/AddBankAccountModal";
import { AvField, AvForm } from "availity-reactstrap-validation";
import AvFieldSelecvt from "components/Common/AvFieldSelect";
import { getAccountsStart } from "store/actions";
import { withdrawalConfig } from "./withdrawalConfig";
import { validateFile } from "helpers/validations/file";

function Mt5Withdraw({ isOpen, toggleOpen, ...props }) { 
  const dispatch = useDispatch();
  const tranFeeGroupDetails = useSelector((state) => state.Profile?.clientData?.transactionFeeId);
  const { accounts } = useSelector(state=> state.forex.accounts);
  const { clientData } = useSelector(state=>state.Profile);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [selectedWallet, setSelectedWallet] = useState("USD");
  const [amount, setAmount] = useState("");
  const [gateway, setGateway] = useState(""); 
  const [transactionFee, setTransactionFee] = useState("");
  const [result, setResult] = useState("");
  const [selectGatwayError, setSelectGatwayError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState();
  const [selectedAccount, setSelectedAccount] = useState(null);
  // used to check if amount is less than 15 then raise an error
  const [amountValidation, setAmountValidation] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [selectWalletError, setSelectWalletError] = useState(false);
  const [hoveredPaymentMethod, setHoveredPaymentMethod] = useState();
  const [addBankModal, setAddBankModal] = useState(false);
  const [bankAccount, setBankAccount] = useState({});
  const [isFirstStepValid, setIsFirstStepValid] = useState(false);
  const bankAccounts = useSelector(
    (state) => state.crypto.bankAccounts?.bankAccounts?.docs
  );

  const [perfectMoneyAccount, setPerfectMoneyAccount] = useState("");

  const [methodConfig, setMethodConfig] = useState({});
  const { t } = useTranslation();
  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      // setSelectedWallet(defaultFiatWallet?.value);
      setGateway("");
      setAmount("");  
      setIsFirstStepValid(false);
    }
  }, [isOpen]);

  useEffect(() => {
    dispatch(getAccountsStart(
      {
        type: "LIVE",
      },
    ));
  }, []);

  function toggleTab(tab) {
    if (activeStep !== tab) {
      setActiveStep(tab);
    }
  }
  useEffect(() => {
    setTransactionFee(tranFeeGroupDetails ? calculateFee(tranFeeGroupDetails, amount) : 0);
  }, [tranFeeGroupDetails, amount]);

  const handleSubmit = (e, v) => {
    const formData = new FormData();
    formData.append("gateway", gateway);
    console.log(gateway);
    formData.append("amount", amount);
    formData.append("tradingAccountId", v.toAccount?._id);
    formData.append("note", "note");
    formData.append("payload", JSON.stringify(methodConfig));
    if (methodConfig?.file){
      formData.append("receipt", methodConfig?.file);
    }
    const body = {
      gateway: gateway,
      amount: amount,
      tradingAccountId: v.toAccount?._id,
      note: "note",
      name: v.name,
      phone: v.phone,
      address: v.address,
      payload: JSON.stringify(methodConfig)
    };
    addFxWithdraw(body)
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
      console.log("[info] submit ", {
        e,
        v
        }) ;
      handleSubmit(e, v);
    }
  };

  const amountValidationHanlder = (e) => {
    e.target.value < selectedAccount?.accountTypeId?.minWithdrawal ? setAmountValidation(true) : setAmountValidation(false);
  };

  useEffect(()=>{
    amount < selectedAccount?.accountTypeId?.minWithdrawal ? setAmountValidation(true) : setAmountValidation(false);
  }, [selectedAccount]);

  const isFirstSubmitValid = () => {
    if (gateway === "") {
      return setIsFirstStepValid(false);
    } else if (gateway === "WIRE_TRANSFER") {
      if (Object.keys(bankAccount).length === 0) {
        return setIsFirstStepValid(false);
      } else {
        return setIsFirstStepValid(true);
      }
    } else if (gateway === "PERFECT_MONEY") {
      if (!perfectMoneyAccount) {
        return setIsFirstStepValid(false);
      } else {
        console.log(perfectMoneyAccount);
        return setIsFirstStepValid(true);
      }
    } else if (gateway === "CRYPTO") {
      if (methodConfig?.network && methodConfig?.coin && methodConfig?.address !== "") {
        return setIsFirstStepValid(true);
      } else {
        return setIsFirstStepValid(false);
      }
    } else if (gateway === "صناديق-الاعتماد") {
      if (methodConfig.type === "حواله") {
        if (methodConfig.file && (methodConfig.locationOfHawala !== "" && methodConfig.locationOfHawala !== null && methodConfig.locationOfHawala !== undefined)) {
          return setIsFirstStepValid(true);
        } else {
          return setIsFirstStepValid(false);
        }
      }
      if (methodConfig.type === "اعتماد") {
        if (methodConfig.nameOfBox !== "" && methodConfig.numberOfBox !== "" && methodConfig.nameOfBox !== undefined && methodConfig.numberOfBox !== undefined) {
          return setIsFirstStepValid(true);
        } else {
          return setIsFirstStepValid(false);
        }
      }
    }
    else if (gateway === "حواله بنكيه"){
      return setIsFirstStepValid(true);
    }
    return setIsFirstStepValid(false);
  };

  useEffect(() => {
    isFirstSubmitValid();
  }, [gateway, bankAccount, bankAccounts, methodConfig, perfectMoneyAccount]);

  const steps = [
    {
      header: t("Select Method"),
      content: (
        <>
          <div className="my-4">
            <AvForm
              onValidSubmit={validateStep1}
            >
              <div className="mb-4">
                <h6 className="mb-3">
                  {props.t("Select Payment Method")}
                  {selectGatwayError && (
                    <p className="small text-danger ">
                      {props.t("Please Select Payment Method")}
                    </p>
                  )}
                </h6>
                <Row className="justify-content-center payment-methods">
                  {
                    withdrawalConfig.filter(
                      method => method.allowed.mt5
                    ).map((method, index) => (
                      <Col xs={4} lg={2} className="my-2" key={index}>
                        <button
                          type="button"
                          onClick={() => {
                            setGateway(method.gateway);
                            setSelectedPaymentMethod(method.gateway);
                            setMethodConfig(method);
                          }}
                          onMouseEnter={() => {setHoveredPaymentMethod(method.gateway)}}
                          onMouseLeave={() => {setHoveredPaymentMethod()}}
                          className={`btn btn-${selectedPaymentMethod === method.gateway ? "success" : hoveredPaymentMethod === method.gateway ? "default" : "light"} waves-effect waves-light w-sm py-4 d-flex align-items-center justify-content-center`}
                          style={{
                            maxWidth: "80px",
                            maxHeight: "80px",
                          }}
                        >
                          <img
                            src={method.image}
                            // width="100%"
                            // height="100%"
                            alt=""
                          ></img>
                        </button>
                      </Col>
                    ))
                  }
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
                </Row>
              </div>
              {gateway == "WIRE_TRANSFER" && (
                <div className="mb-3">
                  <Label>{props.t("Select Bank Account")}</Label>
                  <AvFieldSelecvt
                    name="bankAccount"
                    className="form-select"
                    onChange={(e) => {
                      setBankAccount(e);
                    }}
                    required
                    placeholder="Select Bank Account"
                    options={bankAccounts?.map((bankAccount) => {
                      return {
                        label:`${bankAccount.bankName}`,
                        value: bankAccount
                      };
                    })}
                  >
                  </AvFieldSelecvt>
                  <InputGroup className="mt-2">
                    <InputGroupText className="custom-input-group-text">
                      <Link
                        to="#"
                        onClick={() => {
                          setAddBankModal(true);
                        }}
                      >
                        {props.t("Add New")}
                      </Link>
                    </InputGroupText>
                  </InputGroup>
                </div>
              )}
              {gateway == "PERFECT_MONEY" && (
                <div className="mb-3">
                  <Label className="mb-3">{props.t("Enter Your Perfect Money Account")}</Label>
                  <AvField
                    name="perfectMoney"
                    className="form-control"
                    placeholder={`${props.t("Perfect Money Account")}`}
                    required
                    validate={{
                      maxLength:{ value: 20 }
                    }}
                    value={perfectMoneyAccount}
                    onChange={(e) => setPerfectMoneyAccount(e.target.value)}
                  />
                  
                </div>
              )}
              {
                gateway === "CRYPTO" && (
                  <>
                    <div className="mb-3">
                      <Label>{props.t("Select Network")}</Label>
                      <AvFieldSelecvt
                        name="cryptoNetwork"
                        className="form-select"
                        onChange={(e) => {
                          setMethodConfig({
                            ...methodConfig,
                            network: e,
                          });
                          // setCryptoCurrency(e);
                        }}
                        options={methodConfig?.config.methods.map((method) => {
                          return {
                            label: method.network,
                            value: method,
                          };
                        })}
                      />
                    </div>
                    {
                      methodConfig?.network && (
                        <>
                          <div className="mb-3">
                            <Label>{props.t("Select Coin")}</Label>
                            <AvFieldSelecvt
                              name="cryptoCoin"
                              className="form-select"
                              onChange={(e) => {
                                setMethodConfig({
                                  ...methodConfig,
                                  coin: e,
                                  address: "",
                                });
                                // setCryptoCurrency(e);
                              }}
                              options={methodConfig?.network?.coins?.map((method) => {
                                return {
                                  label: method,
                                  value: method,
                                };
                              })}
                            />
                          </div>
                        </>
                      )
                    }
                    {
                      methodConfig?.coin && (
                        <>
                          <div className="mb-3">
                            <Label>{props.t("Select Address")}</Label>
                            <AvField
                              name="cryptoAddress"
                              className="form-control"
                              placeholder="Enter Address"
                              value={methodConfig?.address}
                              onChange={(e) => {
                                setMethodConfig({
                                  ...methodConfig,
                                  address: e.target.value,
                                });
                              }}
                            />
                          </div>
                        </>
                      )
                    }
                  </>
                )
              }
              {
                // gateway === "حواله بنكيه" && (
                //   <>
                //     <div className="mb-3">
                //       <Label>{t("Type")}</Label>
                //       <AvFieldSelecvt
                //         name="bankHawalaType"
                //         className="form-select"
                //         placeholder="حواله بنكيه"
                //         onChange={(e) => {
                //           setMethodConfig({
                //             /*...methodConfig,
                //             type: */e,
                //           });
                //         }}
                //         options={                          
                //             [{
                //               label: "حواله بنكيه",
                //               value: "حواله بنكيه",
                //             } ]                       
                //         }
                //       />
                //     </div>
                //     {
                //       // methodConfig?.type && (
                //       //   <>
                //       //     {methodConfig.type === "حواله" && (
                //       //       <>
                //       //         <div className="mb-3">
                //       //           <Label className="form-label" htmlFor="receipt">
                //       //             {t("Receipt")}
                //       //           </Label>
                //       //           <AvField
                //       //             type="file"
                //       //             name="receipt"
                //       //             className="form-control form-control-md"
                //       //             errorMessage={t("Receipt is required")}
                //       //             onChange={(e) => {
                //       //               setMethodConfig({
                //       //                 ...methodConfig,
                //       //                 file: e.target.files[0],
                //       //               });
                //       //             }}
                //       //             validate={{
                //       //               required: { value: true },
                //       //               validate: validateFile(["jpg", "jpeg", "png"], 1000000, (methodConfig?.file || {}), {
                //       //                 sizeValidationMessage: t("The file size is too large"),
                //       //                 extensionValidationMessage: t("The file extension is not allowed"),
                //       //               })
                //       //             }}
                //       //           />
                //       //         </div>
                //       //         <div className="mb-3">
                //       //           <Label>{t("وجه الحواله")}</Label>
                //       //           <AvField
                //       //             name="locationOfHawala"
                //       //             type="text"
                //       //             placeholder="وجه الحواله"
                //       //             onChange={(e) => {
                //       //               setMethodConfig({
                //       //                 ...methodConfig,
                //       //                 locationOfHawala: e.target.value,
                //       //               });
                //       //             }}
                //       //           />
                //       //         </div>
                //       //       </>
                //       //     )} 
                //       //     {methodConfig.type === "اعتماد" && (
                //       //       <>
                //       //         <div className="mb-3">
                //       //           <Label>{t("اسم الصندوق")}</Label>
                //       //           <AvField
                //       //             name="nameOfBox"
                //       //             type="text"
                //       //             placeholder="اسم الصندوق"
                //       //             onChange={(e) => {
                //       //               setMethodConfig({
                //       //                 ...methodConfig,
                //       //                 nameOfBox: e.target.value,
                //       //               });
                //       //             }}
                //       //           />
                //       //         </div>
                //       //         <div className="mb-3">
                //       //           <Label>{t("رقم الصندوق")}</Label>
                //       //           <AvField
                //       //             name="numberOfBox"
                //       //             type="text"
                //       //             placeholder="رقم الصندوق"
                //       //             onChange={(e) => {
                //       //               setMethodConfig({
                //       //                 ...methodConfig,
                //       //                 numberOfBox: e.target.value,
                //       //               });
                //       //             }}
                //       //           />
                //       //         </div>
                //       //       </>
                //       //     )} 
                //       //     {methodConfig.type === "حواله بنكيه" && (
                //       //       <>
                //       //         <div className="mb-3">
                //       //           <Label>{t("اسم الصندوق")}</Label>
                //       //           <AvField
                //       //             name="nameOfBox"
                //       //             type="text"
                //       //             placeholder="اسم الصندوق"
                //       //             onChange={(e) => {
                //       //               setMethodConfig({
                //       //                 ...methodConfig,
                //       //                 nameOfBox: e.target.value,
                //       //               });
                //       //             }}
                //       //           />
                //       //         </div>
                //       //         <div className="mb-3">
                //       //           <Label>{t("رقم الصندوق")}</Label>
                //       //           <AvField
                //       //             name="numberOfBox"
                //       //             type="text"
                //       //             placeholder="رقم الصندوق"
                //       //             onChange={(e) => {
                //       //               setMethodConfig({
                //       //                 ...methodConfig,
                //       //                 numberOfBox: e.target.value,
                //       //               });
                //       //             }
                //       //           }
                //       //           />
                //       //         </div>
                //       //       </>
                //       //     )}
                //       //   </>
                //       // )
                //     }
                //   </>
                // )
              }
              {(gateway === "WIRE_TRANSFER" && bankAccount && Object.keys(bankAccount).length > 0) ?
                (
                  <>
                    <AvForm>
                      <h5 className="mb-4">{props.t("Payment details")}</h5>
                      <div>
                        <Label>{props.t("Bank Holder Name")}</Label>
                        <AvField
                          type="text"
                          name="accountHolderName"
                          value={`${clientData?.firstName} ${clientData?.lastName}`}
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
                      {/* <p className="text-muted">
                        {props.t("You MUST include the Reference Code in your deposit in order to credit your account!")}
                      </p> */}
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
                  disabled={!isFirstStepValid}
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
                       {gateway === "حواله بنكيه" ? props.t("The withdrawal amount to be withdrawn from the wallet or platform") : props.t("Amount")}
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
                  {/* <InputGroupText className="custom-input-group-text p-0 border-0">
                    <div style={{
                      width: "127px",
                    }}
                    >
                      <AvFieldSelect
                        style={{ height:"100%" }}
                        name="wallets"
                        options={[{
                          label:"USD",
                          value:"USD"
                        }]}
                        defaultValue={"USD"}
                        onChange={(e) => {
                          setSelectedWallet(e);
                        }}
                      >
                      </AvFieldSelect>
                    </div>
                  </InputGroupText> */}
                </InputGroup>
                {amount && amountValidation && (
                  <p className="small text-danger "> {props.t(`The minimum value for amount is ${selectedAccount?.accountTypeId?.minWithdrawal}`)}</p>
                )}
                <div className="mt-3">
                  <AvFieldSelecvt
                    options={
                      accounts?.filter(a => a.type !== "DEMO").map(acc=>{
                        return {
                          label:`${acc?.login} ${acc?.accountTypeId?.title} (${acc.balance || acc.Balance} ${acc?.currency})`,
                          value: acc
                        };
                      })
                    }
                    onChange={(e) => {
                      setSelectedAccount(e);
                    }}
                    name="toAccount"
                    type="text"
                    errorMessage={props.t("to account is required")}
                    validate={{ required: { value: true } }}
                    label={props.t("CTRADER Account")}
                  >
                  </AvFieldSelecvt>
                </div>
                {amountError && (
                  <p className="small text-danger "> {props.t("Please Select Account")}</p>
                )}
                <div className="text-center fw-bolder mt-4 received-amount">
                  <span className="fs-5">{selectedWallet?.label}</span>
                  <span className="fs-1">{amount}</span>
                </div>
                {/* <div className="text-center mb-4">You receive:</div> */}
                {gateway === "حواله بنكيه" && 
                    <>
                      <div className="mt-2">
                      <Label>{t("Name")}</Label>
                        <AvField
                          type="text"
                          name="name"
                          validate={{ required: true }}
                        >
                        </AvField>
                      </div>
                      <div className="mt-2">
                      <Label>{t("Phone")}</Label>
                        <AvField
                          type="text"
                          name="phone"
                          validate={{ required: true }}
                        >
                        </AvField>
                      </div>
                      <div className="mt-2">
                      <Label>{t("Address to send the transfer to the customer")}</Label>
                        <AvField
                          type="text"
                          name="address"
                          validate={{ required: true }}
                        >
                        </AvField>
                      </div>
                    </>}
                <div className="mb-3">
                  <Label className="form-label mb-2">{props.t("Transaction Fee")}</Label>
                  <InputGroup className="">
                    <InputGroupText className=" w-100">
                      {transactionFee}{"   "}{selectedWallet?.label}
                    </InputGroupText>
                    {/* <Input className="form-control border-start-0 text-end" type="text" placeholder="0.00 EUR" /> */}
                  </InputGroup>
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
                    disabled={loading || amountValidation}
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
      header: "Withdraw status",
      content: (
        <>
          {result.status ? (
            <>
              <div className="text-center  mb-4">
                <h1 className="fs-1 mb-5">
                  {props.t("Yay!")} <i className="bx bx-wink-smile"></i>
                </h1>
                <p>{props.t("Pending Withdraw Thank You")}</p>
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
                <p>{props.t("Your Withdraw Request Not Successfully Created")}</p>
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
      <AddBankAccountModal
        isOpen={addBankModal}
        toggleOpen={() => {
          setAddBankModal(false);
        }}
      ></AddBankAccountModal>
    </>

  );
}
export default withTranslation()(Mt5Withdraw); 