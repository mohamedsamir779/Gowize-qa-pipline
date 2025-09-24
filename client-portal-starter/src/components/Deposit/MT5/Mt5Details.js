import React from "react";
import {
  Alert, Input, InputGroup, Label
} from "reactstrap";
import { default as AvFieldSelect } from "components/Common/AvFieldSelect";
import { useSelector, useDispatch } from "react-redux";
import Loader from "components/Common/Loader";
import { payeeAccounts } from "../Methods/PerfectMoney";
import { AvField } from "availity-reactstrap-validation";
import { useEffect } from "react";
import { getAccountsStart } from "store/actions";
export default function Mt5Details(props) {
  const dispatch = useDispatch();
  const {
    t,
    amount,
    setAmount,
    amountValidation,
    amountError,
    selectedPaymentMethod,
    setPayeeAccount,
    setNotes,
    setAmountValidation,
    selectedAccount,
    setSelectedAccount,
    minDepositAmount
  } = props;

  const { accounts, loading } = useSelector((state) => state?.forex?.accounts);


  useEffect(() => {
    dispatch(
      getAccountsStart({})
    );
  }, []);

  const handleAccountChange = (event) => {
    setSelectedAccount(accounts?.filter((acc) => acc._id === event));    
  };


  return (
    <div className="w-100">
      {loading ? <Loader /> : accounts && (
        <>
          {selectedPaymentMethod === "PERFECT_MONEY" ?
            (<div className="mt-3">
              <AvFieldSelect
                name="payeeAccount"
                required
                options={payeeAccounts?.map((acc) => {
                  return {
                    label: acc.name,
                    value: acc
                  };
                })}
                onChange={(e) => {
                  setPayeeAccount(e);
                }}
                type="text"
                errorMessage={t("Payee account is required")}
                validate={{ required: { value: true } }}
                label={t("Payee Account")}
              >
              </AvFieldSelect>
            </div>)
            : null}
          <div className="mt-3">
            <AvFieldSelect
              options={
                accounts?.map(acc => {
                  return {
                    label: `${acc.login} ${acc?.accountTypeId?.title || "-"} (${acc.balance || acc.Balance} ${acc.currency})`,
                    value: acc._id
                  };
                })
              }
              name="tradingAccountId"
              type="text"
              onChange={handleAccountChange}
              errorMessage={t("CTRADER account is required")}
              validate={{ required: { value: true } }}
              label={t("CTRADER Account")}
            >
            </AvFieldSelect>
          </div>
          {selectedPaymentMethod === "PERFECT_MONEY" ?
            <div className="mt-3">
              <AvField
                type="text"
                name="notes"
                validate={{ required: true }}
                label={t("Notes")}
                // disabled={true}
                onChange={(e) => {
                  setNotes(e.target.value);
                }}
              >
              </AvField>
            </div>
            : null}
          {amountError && (
            <p className="small text-danger "> {t("Please Select Account")}</p>
          )}
          {selectedAccount && (
            <div className="mt-3">

              <Label htmlFor="example-date-input" className="form-label">
                {props.t(`Amount (${selectedAccount[0]?.currency || "USD"})`)}
              </Label>
              <InputGroup>
                <Input
                  required
                  onChange={(e) => {
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
              {selectedAccount?.[0]?.currency === "CENT" && (
                <div className="mt-3">
                  <Alert color="warning">
                    {t("Conversion rate will be applied.")}
                    {" 1 CENT = 0.01 USD"}
                  </Alert>
                </div>
              )}
              
              {amountValidation && (
                <p className="small text-danger "> {selectedAccount?.[0]?.accountTypeId?.minDeposit ? <>{t("The minimum value for amount is " + selectedAccount?.[0]?.accountTypeId?.minDeposit )}</> : <>{t("Please choose trading account first")}</>}</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
