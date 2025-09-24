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
import { withTranslation } from "react-i18next";

import {
  fetchBankAccounts,
  fetchWallets,
  toggleCurrentModal,
} from "../../../store/actions";
import { addWithdraw } from "../../../apis/withdraw";
import { getAssetImgSrc } from "helpers/assetImgSrc";
import calculateFee from "../../../helpers/calculateTranFee";

import CardWrapper from "../../Common/CardWrapper";
import CustomModal from "../../Common/CustomModal";
import AddBankAccountModal from "../../BankAccounts/AddBankAccountModal";
import CustomSelect from "components/Common/CustomSelect";
import Loader from "components/Common/Loader";
import { withdrawalConfig } from "../MT5/withdrawalConfig";
import AvFieldSelecvt from "components/Common/AvFieldSelect";
import { AvField, AvForm } from "availity-reactstrap-validation";
import { validateFile } from "helpers/validations/file";

function FiatWithdraw({ isOpen, toggleOpen, ...props }) {
  const [activeStep, setActiveStep] = useState(0);
  const [amountValidation, setAmountValidation] = useState(false);
  const [perfectMoneyAccount, setPerfectMoneyAccount] = useState("");
  const wallets = useSelector((state) => state.crypto.wallets?.wallets);
  const bankAccounts = useSelector(
    (state) => state.crypto.bankAccounts?.bankAccounts?.docs
  );
  const tranFeeGroupDetails = useSelector((state) => state.Profile?.clientData?.transactionFeeId);
  
  const amountValidationHandler = (e) => {
    e.target.value < 10 ? setAmountValidation(true) : setAmountValidation(false);
  };

  const fiatWallets = wallets.filter((wallet) => (
    wallet.isCrypto === false
  ))
    .map((item) => (
      {
        label: item.asset,
        value: item._id,
        image: getAssetImgSrc(item.assetId)
      }
    ));
  const [selectedWallet, setSelectedWallet] = useState(fiatWallets[0]);
  const [bankAccountId, setBankAccounttId] = useState("");
  const [amount, setAmount] = useState("");
  const [gateway, setGateway] = useState("");
  const [result, setResult] = useState("");
  const [bankAccountDetile, setBankAccountDetile] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [wireTransferFlag, setWireTransferFlag] = useState(false);
  const [transactionFee, setTransactionFee] = useState("");

  const [addBankModal, setAddBankModal] = useState(false);
  const [selectBankError, setSelectBankError] = useState(false);
  const [selectGatwayError, setSelectGatwayError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState();
  const [selectedWalletError, setSelectWalletError] = useState(false);
  const [hoveredPaymentMethod, setHoveredPaymentMethod] = useState();
  const [loading, setLoading] = useState(false);
  const [methodConfig, setMethodConfig] = useState({});
  const [isFirstStepValid, setIsFirstStepValid] = useState(false);
  const [name, setName] = useState(false);
  const [phone, setPhone] = useState(false);
  const [address, setAddress] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      // setSelectedWallet("");
      setGateway("");
      setAmount("");
      setBankAccounttId("");
      setBankAccountDetile({});
      setLoading(false);
    }
    dispatch(
      fetchBankAccounts({
        limit: 100,
        page: 1,
      })
    );
    return () => {
      setSelectBankError(false);
      setSelectGatwayError(false);
      setAmountError(false);
      setSelectWalletError(false);
    };
  }, [isOpen]);
  useEffect(() => {
    if (bankAccountId != "") {
      const detile = bankAccounts.find(o => o._id === bankAccountId);
      if (detile) {
        setBankAccountDetile(detile);
        
      }
    }
  }, [bankAccountId]);

  useEffect(() => {
    if (gateway === "WIRE_TRANSFER" && bankAccountDetile) {
      setMethodConfig({
        ...methodConfig,
        bankAccount: {
          name: bankAccountDetile?.accountHolderName,
          bankName: bankAccountDetile?.bankName,
          accountNumber: bankAccountDetile?.accountNumber,
          address: bankAccountDetile?.address,
          swiftCode: bankAccountDetile?.swiftCode,
          currency: bankAccountDetile?.currency,
        },
      });
    }
  }, [bankAccountDetile]);
  const dispatch = useDispatch();
  function toggleTab(tab) {
    if (activeStep !== tab) {
      setActiveStep(tab);
    }
  }
  useEffect(() => {
    setTransactionFee(tranFeeGroupDetails ? calculateFee(tranFeeGroupDetails, amount) : 0);
  }, [tranFeeGroupDetails, amount]);
  const handleSubmit = () => {
    setLoading(true);
    // const formData = new FormData();
    // formData.append("gateway", gateway);
    // formData.append("amount", amount);
    // formData.append("walletId", selectedWallet?.value);
    // formData.append("note", "note");
    // formData.append("payload", `${JSON.stringify(methodConfig)}`);
    // if (methodConfig?.file){
    //   formData.append("receipt", methodConfig?.file);
    // }
    !selectedWalletError &&
      addWithdraw({
        gateway,
        amount,
        walletId: selectedWallet?.value,
        note: "NOTE",
        payload: `${JSON.stringify(methodConfig)}`,
        name,
        address,
        phone
      })
        .then((e) => {
          // console.log(e);
          setLoading(false);
          setResult(e);
          toggleTab(2);
        })
        .catch((e) => {
          // console.log(e);
          setLoading(false);
          setResult(e);
          toggleTab(2);
        });
    // toggleOpen()
  };
  const validateStep1 = () => {
    if (gateway == "WIRE_TRANSFER") {
      if (bankAccountId == "") {
        setSelectBankError(true);
        setTimeout(() => {
          setSelectBankError(false);
        }, 2000);
      }
    }

    if (selectedWallet === "") {
      setSelectWalletError(true);
      setTimeout(() => {
        setSelectWalletError(false);
      }, 2000);
    }
    if (gateway == "") {
      setSelectGatwayError(true);
      setTimeout(() => {
        setSelectGatwayError(false);
      }, 2000);
    }
    if (selectedWallet?.value != "" && gateway != "") {
      if (gateway == "WIRE_TRANSFER") {
        if (bankAccountId != "") {
          toggleTab(1);
        }
      }
      else {
        toggleTab(1);
      }
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
  useEffect(() => {
    dispatch(fetchWallets({
      isCrypto: false,
    }));
  }, []);

  const isFirstSubmitValid = () => {
    if (gateway === "") {
      return setIsFirstStepValid(false);
    } else if (gateway === "WIRE_TRANSFER") {
      if (bankAccountId === "") {
        return setIsFirstStepValid(false);
      } else {
        return setIsFirstStepValid(true);
      }
    } else if (gateway === "PERFECT_MONEY") {
      if (!perfectMoneyAccount) {
        return setIsFirstStepValid(false);
      } else {
        return setIsFirstStepValid(true);
      }
    } 
    else if (gateway === "CRYPTO") {
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
    } else if (gateway === "حواله بنكيه"){
      return setIsFirstStepValid(true);
    }
    return setIsFirstStepValid(false);
  };

  useEffect(() => {
    isFirstSubmitValid();
  }, [gateway, bankAccountId, bankAccounts, methodConfig, perfectMoneyAccount]);

  const steps = [
    {
      header: "Select Method",
      content: (
        <>
          <AvForm>
            <div className="mb-3">
              <h6 className="mb-3">
                {props.t("Select Payment Method")}
                {selectGatwayError && (
                  <p className="small text-danger ">
                    {props.t("Please Select Payment Method")}
                  </p>
                )}
              </h6>
              <Row className="payment-methods justify-content-center">
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
                    setWireTransferFlag(false);
                    setSelectedPaymentMethod("VISA");
                  }}
                  onMouseEnter={() => { setHoveredPaymentMethod("VISA") }}
                  onMouseLeave={() => { setHoveredPaymentMethod() }}
                  className={`btn btn-${selectedPaymentMethod === "VISA" ? "success" : hoveredPaymentMethod === "VISA" ? "default" : "light"} waves-effect waves-light w-sm py-4`}
                >
                  <img
                    src="img/payment-method/visa.png"
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
                    setWireTransferFlag(false);
                    setSelectedPaymentMethod("MASTERCARD");
                  }}
                  onMouseEnter={() => { setHoveredPaymentMethod("MASTERCARD") }}
                  onMouseLeave={() => { setHoveredPaymentMethod() }}
                  className={`btn btn-${selectedPaymentMethod === "MASTERCARD" ? "success" : hoveredPaymentMethod === "MASTERCARD" ? "default" : "light"} waves-effect waves-light w-sm py-4`}
                >
                  <img
                    src="img/payment-method/mastercard-1.png"
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
                    setWireTransferFlag(false);
                    setSelectedPaymentMethod("NETELLER");
                  }}
                  onMouseEnter={() => { setHoveredPaymentMethod("NETELLER") }}
                  onMouseLeave={() => { setHoveredPaymentMethod() }}
                  className={`btn btn-${selectedPaymentMethod === "NETELLER" ? "success" : hoveredPaymentMethod === "NETELLER" ? "default" : "light"} waves-effect waves-light w-sm py-4`}
                >
                  <img
                    src="img/payment-method/neteller.png"
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
                    setWireTransferFlag(false);
                    setSelectedPaymentMethod("SKRILL");
                  }}
                  onMouseEnter={() => { setHoveredPaymentMethod("SKRILL") }}
                  onMouseLeave={() => { setHoveredPaymentMethod() }}
                  className={`btn btn-${selectedPaymentMethod === "SKRILL" ? "success" : hoveredPaymentMethod === "SKRILL" ? "default" : "light"} waves-effect waves-light w-sm py-4`}
                >
                  <img
                    src="img/payment-method/skrill.png"
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
                <InputGroup>
                  <select
                    className="form-select"
                    onChange={(e) => {
                      setBankAccounttId(e.target.value);
                    }}
                  >
                    <option value="">select</option>
                    {bankAccounts?.map((bankAccount) => {
                      return (
                        <option key={bankAccount._id} value={bankAccount._id}>
                          {bankAccount.bankName}
                        </option>
                      );
                    })}
                  </select>
                  <InputGroupText className="custom-input-group-text">
                    <Link
                      to="#"
                      onClick={() => {
                        // console.log("Add New");
                        setAddBankModal(true);
                      }}
                    >
                      {props.t("Add New")}
                    </Link>
                  </InputGroupText>
                </InputGroup>
                {selectBankError && (
                  <p className="small text-danger ">
                    {props.t("Please Select Bank Account")}
                  </p>
                )}
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
                      maxLength:{value: 20}
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
              // gateway === "صناديق-الاعتماد" && (
              //   <>
              //     <div className="mb-3">
              //       <Label>{props.t("Type")}</Label>
              //       <AvFieldSelecvt
              //         name="sandoqType"
              //         className="form-select"
              //         placeholder="Select Type"
              //         onChange={(e) => {
              //           setMethodConfig({
              //             ...methodConfig,
              //             type: e,
              //           });
              //         }}
              //         options={methodConfig?.config?.methods?.map((option) => {
              //           return {
              //             label: option?.title,
              //             value: option?.title,
              //           };
              //         })}
              //       />
              //     </div>
              //     {
              //       methodConfig?.type && (
              //         <>
              //           {methodConfig.type === "حواله" && (
              //             <>
              //               <div className="mb-3">
              //                 <Label className="form-label" htmlFor="receipt">
              //                   {props.t("Receipt")}
              //                 </Label>
              //                 <AvField
              //                   type="file"
              //                   name="receipt"
              //                   className="form-control form-control-md"
              //                   errorMessage={props.t("Receipt is required")}
              //                   onChange={(e) => {
              //                     setMethodConfig({
              //                       ...methodConfig,
              //                       file: e.target.files[0],
              //                     });
              //                   }}
              //                   validate={{
              //                     required: { value: true },
              //                     validate: validateFile(["jpg", "jpeg", "png"], 1000000, (methodConfig?.file || {}), {
              //                       sizeValidationMessage: props.t("The file size is too large"),
              //                       extensionValidationMessage: props.t("The file extension is not allowed"),
              //                     })
              //                   }}
              //                 />
              //               </div>
              //               <div className="mb-3">
              //                 <Label>{props.t("وجه الحواله")}</Label>
              //                 <AvField
              //                   name="locationOfHawala"
              //                   type="text"
              //                   placeholder="وجه الحواله"
              //                   onChange={(e) => {
              //                     setMethodConfig({
              //                       ...methodConfig,
              //                       locationOfHawala: e.target.value,
              //                     });
              //                   }}
              //                 />
              //               </div>
              //             </>
              //           )} 
              //           {methodConfig.type === "اعتماد" && (
              //             <>
              //               <div className="mb-3">
              //                 <Label>{props.t("اسم الصندوق")}</Label>
              //                 <AvField
              //                   name="nameOfBox"
              //                   type="text"
              //                   placeholder="اسم الصندوق"
              //                   onChange={(e) => {
              //                     setMethodConfig({
              //                       ...methodConfig,
              //                       nameOfBox: e.target.value,
              //                     });
              //                   }}
              //                 />
              //               </div>
              //               <div className="mb-3">
              //                 <Label>{props.t("رقم الصندوق")}</Label>
              //                 <AvField
              //                   name="numberOfBox"
              //                   type="text"
              //                   placeholder="رقم الصندوق"
              //                   onChange={(e) => {
              //                     setMethodConfig({
              //                       ...methodConfig,
              //                       numberOfBox: e.target.value,
              //                     });
              //                   }}
              //                 />
              //               </div>
              //             </>
              //           )} 
              //         </>
              //       )
              //     }
              //   </>
              // )
            }
            {(gateway === "WIRE_TRANSFER" && bankAccountDetile && Object.keys(bankAccountDetile).length  !== 0) && (
              <>
                <h5 className="mb-4">{props.t("Payment details")}</h5>
                <Label className="mb-2">{props.t("Bank Account")}</Label>
                <div className="mb-3">
                  <InputGroup>
                    <InputGroupText className="w-100">{bankAccountDetile?.accountHolderName}</InputGroupText>
                  </InputGroup>
                </div>
                <div className="mb-3">
                  <InputGroup>
                    <InputGroupText className="w-100">{bankAccountDetile?.bankName}</InputGroupText>
                  </InputGroup>
                </div>
                <div className="mb-3">
                  <InputGroup>
                    <InputGroupText className="w-100">
                      {bankAccountDetile?.accountNumber}
                    </InputGroupText>
                  </InputGroup>
                </div>
                <div className="mb-3">
                  <InputGroup>
                    <InputGroupText className="w-100">
                      {bankAccountDetile?.address}
                    </InputGroupText>
                  </InputGroup>
                </div>
                <div className="mb-3">
                  <InputGroup>
                    <InputGroupText className="w-100">{bankAccountDetile?.swiftCode}</InputGroupText>
                  </InputGroup>
                </div>
                <div className="mb-3">
                  <InputGroup>
                    <InputGroupText className="w-100">
                      {bankAccountDetile?.currency}
                    </InputGroupText>
                  </InputGroup>
                </div>
                <p className="mb-2">{props.t("Bank Account")}</p>
                {/* <p className="text-muted">
                  {props.t("You MUST include the Reference Code in your deposit in order to credit your account!")}
                </p> */}
              </>
            )}
            <div className="text-center mt-4">
              <Button
                className="btn btn-primary m-2 btn-sm w-lg"
                onClick={() => { dispatch(toggleCurrentModal("selectWithdrawalMethodModal")) }}
              >
                {props.t("Back")}
              </Button>
              <Button
                className="btn btn-danger waves-effect waves-light w-lg btn-sm"
                onClick={() => validateStep1()}
                disabled={!isFirstStepValid}
              >
                {props.t("Continue")}
              </Button>
            </div>
          </AvForm>
        </>
      ),
    },
    {
      header: "Enter Amount",
      content: (
        <>
          {
            fiatWallets
              ?
              <>
              <AvForm
                onValidSubmit={(e, v) => {
                  validateStep2(e, v);
                }}
              >
                <div className="mb-3">
                  <Label className="form-label mb-2">{props.t("Transaction Fee")}</Label>
                  <InputGroup className="">
                    <InputGroupText className=" w-100">
                      {transactionFee}{"   "}{selectedWallet?.label}
                    </InputGroupText>
                  </InputGroup>
                </div>
                <div className="mb-3">
                  <Label className="form-label mb-2">{props.t("Total Amount")}</Label>
                  <InputGroup>
                    <Input
                      required
                      onChange={(e) => {
                        setAmount(e.target.value);
                        amountValidationHandler(e);
                      }}
                      className="form-control"
                      type="number"
                      min="0"
                      value={amount}
                      placeholder={props.t("Enter total amount")}
                    />
                    <InputGroupText className="custom-input-group-text p-0 border-0">
                      <div style={{
                        width: "127px",
                        height: "100%"
                      }}
                      >
                        <CustomSelect
                          name="wallets"
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
                  {amountError && (
                    <p className="small text-danger "> {props.t("Please Enter Amount")}</p>
                  )}
                  {
                    amountValidation &&
                    <p className="small text-danger "> {props.t("Minimum balance amount is" + 10)}</p>
                  }
                   {gateway === "حواله بنكيه" && 
                    <>
                      <div className="mt-2">
                      <Label>{props.t("Name")}</Label>
                      <AvField
                        type="text"
                        name="name"
                        validate={{ required: true }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      >
                      </AvField>
                      </div>
                      <div className="mt-2">
                      <Label>{props.t("Phone")}</Label>
                        <AvField
                          type="text"
                          name="phone"
                          validate={{ required: true }}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        >
                        </AvField>
                      </div>
                      <div className="mt-2">
                      <Label>{props.t("Address to send the transfer to the customer")}</Label>
                        <AvField
                          type="text"
                          name="address"
                          validate={{ required: true }}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        >
                        </AvField>
                      </div>
                    </>}
                </div>
                <div className="text-center">
                  <Button
                    className="btn btn-primary m-2 btn-sm w-lg"
                    onClick={() => toggleTab(0)}
                  >
                    {props.t("Back")}
                  </Button>
                  <Button
                    type="submit"
                    className="btn btn-danger m-2 btn-sm w-lg"
                    disabled={loading || amountValidation}
                  >
                    {props.t("Continue")}
                  </Button>
                </div>
                </AvForm>
              </>
              :
              <Loader />
          }
        </>
      ),
    },
    {
      header: "Withdraw status",
      content: (
        <>
          <>
            {result.status ? (
              <>
                <div className="text-center  mb-4">
                  <h1 className="fs-1 mb-5">
                    {props.t("Yay!")} <i className="bx bx-wink-smile"></i>
                  </h1>
                  <p>{props.t("Your successfully a withdrawal")}</p>
                  <p>
                    <span className="positive">{result?.result?.amount?.$numberDecimal} {result?.result?.currency}</span>
                  </p>
                </div>
                <CardWrapper className="mb-4">
                  <div className="d-flex align-items-center justify-content-between px-5">
                    <div>
                      <div className="text-muted">{props.t("Status")}</div>
                      <div className="positive">{props.t("Completed")}</div>
                    </div>
                    <div>
                      <div className="text-muted">{props.t("Transaction ID")}</div>
                      <div>{result?.result?._id}</div>
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
                  <p>{props.t("Your Withdrawal Request Not Successfully Created")}</p>
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
          </>
          <div className="text-center">
            <Button
              className="btn btn-danger m-2 btn-sm w-lg"
              onClick={toggleOpen}
            >
              {props.t("Continue")}
            </Button>
          </div>
          {/* <div className="text-center">
                <Button className="btn btn-danger m-2 btn-sm w-lg" onClick={handleSubmit}>View Wallet</Button>
            </div> */}
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
export default withTranslation()(FiatWithdraw); 