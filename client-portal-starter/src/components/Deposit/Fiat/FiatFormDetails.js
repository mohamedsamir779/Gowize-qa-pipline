import CustomSelect from "components/Common/CustomSelect";
import Loader from "components/Common/Loader";
import { getAssetImgSrc } from "helpers/assetImgSrc";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWallets } from "store/actions";
import {
  Input,
  InputGroup,
  InputGroupText
} from "reactstrap";
import { payeeAccounts } from "../Methods/PerfectMoney";
import { AvField } from "availity-reactstrap-validation";
import { default as AvFieldSelect } from "components/Common/AvFieldSelect";
import { max } from "lodash";

export default function FiatFormDetails(props) {
  const {
    t,
    selectedWallet,
    amount,
    setAmount,
    setSelectedWallet,
    setAmountValidation,
    selectedPaymentMethod,
    setPayeeAccount,
    setNotes,
    minDepositAmount
  } = props;
  const dispatch = useDispatch();
  const [amountError, setAmountError] = useState(false);
  const [minAmount, setMinAmount] = useState(10);

  const { wallets, loading } = useSelector((state) => state?.walletReducer);

  useEffect(() => {
    if (amount < 10) {
      setAmountError(true);
      setAmountValidation(true);
    } else {
      setAmountError(false);
      setAmountValidation(false);
    }
  }, [amount]);

  // useEffect(() => {
  //   const sWallet = wallets?.find((wallet) => wallet._id === selectedWallet?.value);
  //   const minAmount = parseInt(sWallet?.assetId?.minAmount?.deposit) > minDepositAmount ? parseInt(sWallet?.assetId?.minAmount?.deposit) : minDepositAmount;
  //   setMinAmount(minAmount);
  // }, [selectedWallet]);

  useEffect(() => {
    if (wallets?.length > 0) {
      setSelectedWallet({
        label: wallets[0].asset,
        value: wallets[0]._id,
        image: getAssetImgSrc(wallets[0].assetId)
      });
      // const minAmount = parseInt(wallets[0].assetId?.minAmount?.deposit) > minDepositAmount ? parseInt(wallets[0].assetId?.minAmount?.deposit) : minDepositAmount;
      // setMinAmount(minAmount);
    }
  }, [wallets]);

  const loadWallets = () => {
    dispatch(fetchWallets());
  };

  useEffect(() => {
    if (!wallets || wallets?.length === 0) {
      loadWallets({
        isCrypto: false,
        isInventory: false,
      });
    }
  }, []);

  const fiatWallets = wallets?.map((wallet) => {
    return {
      label: wallet.asset,
      value: wallet._id,
      image: getAssetImgSrc(wallet.assetId)
    };
  });

  return (
    <div className="w-100">
      {loading ? <Loader /> : (
        <>
          {t("Transaction requirements")}
          <i className="fas fa-info-circle ms-2"></i>
          <div className="mt-3">
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
                placeholder={`Enter ${minAmount}-128341`}
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
                    defaultValue={fiatWallets[0]}
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
            <p className="small text-danger "> {
              !amount ? t("Amount is required") : t("Amount must be greater than " + 10)
            } </p>
          )}
          <div className="text-center fw-bolder mt-4 received-amount">
            <span className="fs-5">{selectedWallet?.label}</span>
            <span className="fs-1">{amount}</span>
          </div>

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
        </>
      )}
    </div>
  );
}
