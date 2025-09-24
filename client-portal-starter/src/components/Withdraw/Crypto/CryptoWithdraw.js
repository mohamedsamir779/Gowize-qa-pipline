import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
//i18n
import { withTranslation } from "react-i18next";

import { addWithdrawCrypto } from "../../../apis/withdraw";
import { toggleCurrentModal } from "../../../store/actions";
import calculateFee from "../../../helpers/calculateTranFee";

import CardWrapper from "../../Common/CardWrapper";
import CustomModal from "../../Common/CustomModal";
import WalletsListSelect from "components/Common/WalletsListSelect";
import NetworksListSelect from "components/Common/NetworksListSelect";

function CryptoWithdraw({ isOpen, toggleOpen, ...props }) {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const wallets = useSelector((state) => state.crypto.wallets?.wallets);
  const tranFeeGroupDetails = useSelector(
    (state) => state.Profile.clientData?.transactionFeeId
  );

  const [asset, setAsset] = useState("");
  const [assetId, setAssetId] = useState("");

  const [transactionFee, setTransactionFee] = useState("");

  const [selectedWallet, setSelectedWallet] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [networkAddress, setNetworkAddress] = useState(null);
  const [networkName, setNetworkName] = useState(null);
  const [network, setNetwork] = useState(null);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");
  const [amountValidation, setAmountValidation] = useState(false);
  const [selectCurrancyError, setSelectCurrancyError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      setSelectedWallet(null);
      setAmount("");
      setAddress("");
    }
  }, [isOpen]);

  function toggleTab(tab) {
    if (activeStep !== tab) {
      setActiveStep(tab);
    }
  }

  useEffect(() => {
    setTransactionFee(
      tranFeeGroupDetails ? calculateFee(tranFeeGroupDetails, amount) : 0
    );
  }, [tranFeeGroupDetails, amount]);

  const amountValidationHandler = (e) => {
    e.target.value < 15
      ? setAmountValidation(true)
      : setAmountValidation(false);
  };

  const handleSubmit = () => {
    // event.preventDefault();
    console.log({
      to: address,
      walletId: selectedWallet?._id,
      amount: amount,
      note: "note",
      assetId: assetId._id,
      addressId: network._id,
      chainId: network.chainId._id,
      networkName: network.chainId.name,
      cryptoapiName: network.chainId.cryptoapiName,
      from: network.address,
    });

    addWithdrawCrypto({
      to: address,
      walletId: selectedWallet?._id,
      amount: amount,
      note: "note",
      assetId: assetId._id,
      addressId: network._id,
      chainId: network.chainId._id,
      networkName: network.chainId.name,
      cryptoapiName: network.chainId.cryptoapiName,
      from: network.address,
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
    if (!selectedWallet) {
      setSelectCurrancyError(true);
      setTimeout(() => {
        setSelectCurrancyError(false);
      }, 2000);
    }
    if (address == "") {
      setAddressError(true);
      setTimeout(() => {
        setAddressError(false);
      }, 2000);
    }
    if (!networkName) {
      setNetworkError(true);
      setTimeout(() => {
        setNetworkError(false);
      }, 2000);
    }
    if (selectedWallet && address != "") {
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

  const steps = [
    {
      header: "Select Method",
      content: (
        <>
          <div className="mb-3">
            <InputGroup>
              <InputGroupText className="custom-input-group-text">
                {props.t("Available Balance")}
              </InputGroupText>
              <Input
                value={selectedWallet?.amount}
                className="form-control border-start-0 text-end"
                type="text"
                disabled
              />
            </InputGroup>
          </div>
          <Row className="mb-3">
            <Col>
              <Label className="mb-2">{props.t("Select wallet")}</Label>
              <WalletsListSelect
                className="h-50"
                onChange={(e) => {
                  setSelectedWallet(e.value);
                  setAsset(e.value?.asset);
                  setAssetId(e.value?.assetId);
                }}
                wllates={wallets.filter((x) => x.isCrypto)}
              ></WalletsListSelect>
              {selectCurrancyError && (
                <p className="small text-danger ">
                  {" "}
                  {props.t("Please Select Currency")}
                </p>
              )}
            </Col>
            <Col>
              <Label className="mb-2">{props.t("Network")}</Label>
              <NetworksListSelect
                className="h-50"
                noOptionsMessage={({ inputValue }) =>
                  !inputValue && "Select a coin first"
                }
                onChange={(e) => {
                  console.log(e.value);
                  setNetwork(e.value);
                  setNetworkAddress(e.value.address);
                  setNetworkName(e.value.chainId.name);
                }}
                networks={selectedWallet ? selectedWallet?.networks : []}
              ></NetworksListSelect>
              {networkError && (
                <p className="small text-danger ">
                  {props.t("Please select a network")}
                </p>
              )}
            </Col>
          </Row>
          <div className="mb-3">
            <Label>{props.t("Enter Address")}</Label>

            <input
              className="form-control "
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              type="text"
              placeholder={props.t("Enter Address")}
            ></input>
            {addressError && (
              <p className="small text-danger ">
                {props.t("Please Enter Address")}
              </p>
            )}
          </div>
          <div className="text-center mt-4">
            <Button
              className="btn btn-primary m-2 btn-sm w-lg"
              onClick={() => {
                dispatch(toggleCurrentModal("selectWithdrawalMethodModal"));
              }}
            >
              {props.t("Back")}
            </Button>
            <Button
              className="btn btn-danger waves-effect waves-light w-lg btn-sm"
              onClick={() => validateStep1()}
            >
              {props.t("Continue")}
            </Button>
          </div>
        </>
      ),
    },
    {
      header: "Enter Amount",
      content: (
        <>
          <div className="mb-3">
            <Label className="form-label mb-2">
              {props.t("Transaction Fee")}
            </Label>
            <InputGroup className="">
              <InputGroupText className=" w-100">
                {transactionFee}
                {"   "}
                {asset}
              </InputGroupText>
              {/* <Input className="form-control border-start-0 text-end" type="text" placeholder="0.00 EUR" /> */}
            </InputGroup>
          </div>
          <div className="mb-3">
            <Label className="form-label mb-2">{props.t("Total Amount")}</Label>
            <Input
              onChange={(e) => {
                setAmount(e.target.value);
                amountValidationHandler(e);
              }}
              className="form-control "
              type="number"
              placeholder="0.00 USDT"
            />
            {amountError && (
              <p className="small text-danger ">
                {" "}
                {props.t("Please Enter Amount")}
              </p>
            )}
            {amountValidation && (
              <p className="small text-danger ">
                {" "}
                {props.t("The minimum value for amount is 15")}
              </p>
            )}
          </div>
          <div className="text-center">
            <Button
              className="btn btn-secondary m-2 btn-sm w-lg"
              onClick={() => toggleTab(0)}
            >
              {props.t("Previous")}
            </Button>
            <Button
              className="btn btn-danger m-2 btn-sm w-lg"
              disabled={amountValidation}
              onClick={() => validateStep2()}
            >
              {props.t("Continue")}
            </Button>
          </div>
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
                  <p>{props.t("Your Withdrawal Request Has Been Created")} </p>
                  <p>
                    <span className="positive">
                      {result?.result?.amount?.["$numberDecimal"]}
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
                  <p>
                    {props.t(
                      "Your Withdrawal Request Not Successfully Created"
                    )}
                  </p>
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
    </>
  );
}
export default withTranslation()(CryptoWithdraw);
