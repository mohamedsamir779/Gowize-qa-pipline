import { AvField, AvForm } from "availity-reactstrap-validation";
import calculateFee from "helpers/calculateFee";
import { validateFile } from "helpers/validations/file";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  InputGroup,
  InputGroupText,
  Label
} from "reactstrap";
import FiatFormDetails from "./Fiat/FiatFormDetails";
import Mt5Details from "./MT5/Mt5Details";
import { finiticPayFees } from "config";
import { getFiniticPayFeesConfig } from "apis/deposit";

export default function StageTwo(props) {
  const {
    t,
    toggleTab,
    type,
    gateway,
    handleSubmit,
    receipt = false,
    loading,
    paymentPayload,
    setLoading,
    selectedPaymentMethod
  } = props;

  const [file, setFile] = useState({});
  const [amount, setAmount] = useState();
  const [amountValidation, setAmountValidation] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(undefined);
  const tranFeeGroupDetails = useSelector((state) => state.Profile?.clientData?.transactionFeeId);
  const [transactionFee, setTransactionFee] = useState(0);
  const [payeeAccount, setPayeeAccount] = useState();
  const [notes, setNotes] = useState("");
  const [selectedAccount, setSelectedAccount] = useState([]);
  const [minimumDepositAmount, setMinimumDepositAmount] = useState(10);
  const [feesLoading, setFeesLoading] = useState(false);
  const [fees, setFees] = useState({});

  const amountValidationHandler = () => {
    if (selectedAccount){
      if (selectedAccount?.[0]?.currency === "CENT") {
        setAmountValidation(false);
      } else {
        parseFloat(amount) < (selectedAccount?.[0]?.accountTypeId?.minDeposit ?? minimumDepositAmount) ? setAmountValidation(true) : setAmountValidation(false);
      }
    } else {
      amount < minimumDepositAmount || !amount ? setAmountValidation(true) : setAmountValidation(false);
    }
  };

  useEffect(()=>{
    amountValidationHandler();
  }, [selectedAccount]);

  useEffect(() => {
    if (gateway === "FINITIC_PAY") {
      setFeesLoading(true);
      getFiniticPayFeesConfig()
        .then((resp) => resp.result)
        .then((res) => setFees(res))
        .finally(() => setFeesLoading(false));
    }
  }, [gateway]);

  useEffect(() => {
    if (amount > 0) {
      if (gateway === "FINITIC_PAY") {
        const { isPercentage, minDeposit, onChainfee, value, minValue } = fees;
        if (isPercentage) {
          const cFees = parseFloat((value * amount) / 100);
          const feeAmount = cFees <= parseFloat(minValue) ? parseFloat(minValue) : cFees;
          setTransactionFee(parseFloat(feeAmount).toFixed(2));
          setMinimumDepositAmount(parseFloat(minDeposit));
        } else {
          setTransactionFee(parseFloat(onChainfee + minValue).toFixed(2));
        }
      } else {
        setMinimumDepositAmount(10);
        setTransactionFee(tranFeeGroupDetails ? calculateFee(tranFeeGroupDetails, amount) : 0);
      }
      amountValidationHandler();
    } else {
      setTransactionFee(0);
    }
  }, [tranFeeGroupDetails, amount, gateway]);

  useEffect(() => {
    if (gateway !== "FINITIC_PAY") {
      setMinimumDepositAmount(10);
    }
  }, [gateway]);

  const renderFormType = () => {
    switch (type) {
      case "fiatDeposit":
        return <FiatFormDetails t={t}
          selectedWallet={selectedWallet}
          amount={amount}
          setAmount={setAmount}
          setPayeeAccount={setPayeeAccount}
          setNotes={setNotes}
          selectedPaymentMethod={selectedPaymentMethod}
          setAmountValidation={setAmountValidation}
          setSelectedWallet={setSelectedWallet}
          minDepositAmount={minimumDepositAmount}
        />;
      case "mt5Deposit":
        return <Mt5Details
          t={t}
          amount={amount}
          setAmount={setAmount}
          selectedPaymentMethod={selectedPaymentMethod}
          amountValidation={amountValidation}
          setPayeeAccount={setPayeeAccount}
          setNotes={setNotes}
          setAmountValidation={setAmountValidation}
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          minDepositAmount={minimumDepositAmount}
        />;
      default:
        return <></>;
    }
  };


  const handleOnValidSubmit = (e, v) => {
    setLoading(true);
    const formData = new FormData();
    if (type === "mt5Deposit") {
      console.log("Stage2- MT5Deposit");
      if (receipt) {
        console.log("Stage2- if receipt true");
        formData.append("gateway", gateway);
        formData.append("amount", parseFloat(amount));
        // formData.append("note", "note");
        formData.append("tradingAccountId", v.tradingAccountId);
        formData.append("receipt", file);
        formData.append("paymentPayload", paymentPayload);

        if (selectedPaymentMethod === "PERFECT_MONEY") {
          // formData.append("payeeAccount", payeeAccount);
          formData.append("note", notes.toString());
        }

        handleSubmit(formData);
      } else {
        if (gateway === "CRYPTO") {
          console.log("Stage2- CRYPTO");
          handleSubmit({
            gateway,
            paymentPayload,
            amount: parseFloat(amount),
            note: "note",
            tradingAccountId: v.tradingAccountId,
          });
        }
        if (gateway === "حواله بنكيه") {
          console.log("Stage2- حواله بنكيه");
          handleSubmit({
            gateway,
            paymentPayload,
            amount: parseFloat(amount),
            note: "note",
            tradingAccountId: v.tradingAccountId,
          });
        }
      }
    } else if (type === "fiatDeposit") {
      if (receipt) {
        formData.append("gateway", gateway);
        formData.append("amount", parseFloat(amount));
        // formData.append("note", "note");
        formData.append("walletId", selectedWallet.value);
        formData.append("receipt", file);
        formData.append("paymentPayload", paymentPayload);
        if (selectedPaymentMethod === "PERFECT_MONEY") {
          // formData.append("payeeAccount", payeeAccount);
          formData.append("note", notes.toString());
        }
        handleSubmit(formData);
      } else {
        handleSubmit({
          gateway,
          paymentPayload,
          amount: parseFloat(amount),
          note: "note",
          walletId: selectedWallet.value,
        });
      }
    }
  };

  return (
    <AvForm
      onValidSubmit={(e, v) => {
        setLoading(true);
        const formData = new FormData();
        if (type === "mt5Deposit") {
          if (receipt) {
            formData.append("gateway", gateway);
            formData.append("amount", parseFloat(amount));
            formData.append("note", "note");
            formData.append("currency", selectedAccount?.[0]?.currency);
            formData.append("tradingAccountId", v.tradingAccountId);
            formData.append("receipt", file);
            formData.append("paymentPayload", paymentPayload);
            handleSubmit(formData);
          } else {
            if (["CRYPTO", "FINITIC_PAY", "EPAYME", "PAYMAXIS"].includes(gateway)) {
              handleSubmit({
                gateway,
                paymentPayload,
                amount: parseFloat(amount),
                note: "note",
                tradingAccountId: v.tradingAccountId,
              });
            }
          }
        } else if (type === "fiatDeposit") {
          if (receipt) {
            formData.append("gateway", gateway);
            formData.append("amount", parseFloat(amount));
            formData.append("note", "note");
            formData.append("walletId", selectedWallet.value);
            formData.append("receipt", file);
            formData.append("paymentPayload", paymentPayload);
            handleSubmit(formData);
          } else {
            handleSubmit({
              gateway,
              paymentPayload,
              amount: parseFloat(amount),
              note: "note",
              walletId: selectedWallet.value,
            });
          }
        }
      }}
    >
      <h6 className="mb-3">{t("Enter Amount")}</h6>
      <div className="d-flex justify-content-between mb-2">
        {renderFormType()}
      </div>
      <div className="mb-3">
        <Label className="form-label mb-2">{t("Transaction Fee")}</Label>
        <InputGroup className="">
          <InputGroupText className=" w-100">
            {parseFloat(transactionFee ?? 0)}{"   "}{selectedWallet?.asset}
          </InputGroupText>
        </InputGroup>
      </div>
      {receipt && (
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
              validate: validateFile(["jpg", "jpeg", "png"], 1000000, file, {
                sizeValidationMessage: t("The file size is too large"),
                extensionValidationMessage: t("The file extension is not allowed"),
              })
            }}
          />
        </div>
      )}
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
          disabled={amountValidation || loading || !amount}
        >
          {t("Continue")}
        </Button>
      </div>

    </AvForm>
  );
}
