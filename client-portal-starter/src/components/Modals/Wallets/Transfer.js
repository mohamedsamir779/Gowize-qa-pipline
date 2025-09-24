import React, { useEffect } from "react";
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { AvField, AvForm } from "availity-reactstrap-validation";
import AvFieldSelecvt from "components/Common/AvFieldSelect";
import { useDispatch, useSelector } from "react-redux";
import {
  createWalletTransfer,
  // createGoldTransfer,
  // fetchConversionRateStart,
  fetchWallets,
  getAccountsStart
} from "store/actions";
import Loader from "components/Common/Loader";
import { fetchConversionRateStart } from "store/general/conversionRates/actions";

export default function TransferModal({ isOpen, toggle }) {

  const [from, setFrom] = React.useState(undefined);
  const [to, setTo] = React.useState(undefined);
  const [differentCurrency, setDifferentCurrency] = React.useState(false);
  const [amount, setAmount] = React.useState(0);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { wallets, loading: walletLoading, clearingCounter, transferLoading } = useSelector((state) => state?.walletReducer);
  const { accounts, loading: accountLoading } = useSelector((state) => state.forex?.accounts);
  const { conversionRate = 1, loading: conversionLoading } = useSelector((state) => state?.conversionReducer);

  useEffect(() => {
    dispatch(getAccountsStart({
      type: "LIVE"
    }));
  }, []);

  useEffect(() => {
    dispatch(fetchWallets({
      isDemo: false,
    }));
  }, []);

  useEffect(() => {
    if (from !== undefined && to !== undefined) {
      if (from.currency !== to.currency) {
        setDifferentCurrency(true);
      } else {
        setDifferentCurrency(false);
      }
    }
    if (from === undefined || to === undefined) {
      setDifferentCurrency(false);
    }
  }, [from, to]);

  useEffect(() => {
    if (isOpen && transferLoading) {
      toggle();
    }
  }, [clearingCounter, transferLoading]);

  useEffect(() => {
    if (differentCurrency) {
      dispatch(fetchConversionRateStart({
        from: from.currency,
        to: to.currency
      }));
    }
  }, [differentCurrency, from, to]);

  const handleOnSelect = (selection, field) => {
    if (field === "from") {
      setFrom(selection);
    } else {
      setTo(selection);
    }
  };


  const getFromOptions = () => {
    const options = [];
    if (wallets.length > 0) {
      const filteredWallets = wallets.filter((wallet) => wallet?._id !== to?.id && !wallet.isInventory && !wallet.isCrypto);
      filteredWallets.forEach((wallet) => {
        options.push({
          label: `${wallet.asset} - ${wallet.amount?.toFixed(2)}`,
          value: {
            isWallet: true,
            id: wallet._id,
            currency: wallet?.isIb ? "USD" : wallet.asset,
            amount: wallet.amount
          }
        });
      });
    }
    if (accounts !== null && accounts.length > 0) {
      const filteredAccounts = accounts.filter((account) => account._id !== to?.id && account.type === "LIVE");
      filteredAccounts.forEach((account) => {
        options.push({
          label: `${account?.login} | ${account?.accountTypeId?.title} ${account?.accountTypeId?.type} - ${account.currency} - ${account?.balance}`,
          value: {
            isWallet: false,
            platform: account.platform,
            id: account._id,
            currency: account.currency,
            amount : account.balance
          }
        });
      });
    }
    return options;
  };

  const getToOptions = () => {
    if (from === undefined) return [];
    const options = [];
    if (accounts !== null && accounts.length > 0) {
      const filteredAccounts = accounts.filter((account) => account._id !== from?.id && account.type === "LIVE" && (from?.platform === account.platform || from.isWallet));
      filteredAccounts.forEach((account) => {
        options.push({
          label: `${account?.login} | ${account?.accountTypeId?.title} ${account?.accountTypeId?.type} - ${account.currency} - ${account?.balance}`,
          value: {
            isWallet: false,
            id: account._id,
            currency: account.currency,
            amount:  account.balance
          }
        });
      });
    }
    if (wallets.length > 0) {
      const filteredWallets = wallets.filter((wallet) => wallet._id !== from.id && !wallet.isInventory && !wallet.isCrypto);
      filteredWallets.forEach((wallet) => {
        options.push({
          label: `${wallet.asset} - ${wallet.amount?.toFixed(2)}`,
          value: {
            isWallet: true,
            id: wallet._id,
            currency: wallet?.isIb ? "USD" : wallet.asset,
            amount: wallet.amount
          }
        });
      });
    }
    return options;
  };
  
  const handleSubmit = (e, values) => {
    const data = {
      fromId: values.from.id,
      toId: values.to.id,
      baseCurrency: from.currency,
      targetCurrency: to.currency,
      amount: values.amount,
      note: values.note,
    };
    if (from.isWallet && to.isWallet) {
      data.source = "WALLET";
      data.destination = "WALLET";
    } else if (!from.isWallet && !to.isWallet) {
      data.source = "FX";
      data.destination = "FX";
    } else if (from.isWallet && !to.isWallet) {
      data.source = "WALLET";
      data.destination = "FX";
    } else if (!from.isWallet && to.isWallet) {
      data.source = "FX";
      data.destination = "WALLET";
    }
    dispatch(createWalletTransfer(data));
  };
  return (
    <Modal centered isOpen={isOpen} toggle={toggle} >
      <ModalHeader className="d-flex flex-column gap-3" toggle={toggle}>
        {t("Internal Transfer")}
      </ModalHeader>
      {
        (walletLoading || accountLoading) ? <Loader/> : (
          <ModalBody  style={{
            margin: "1rem"
          }}>
            <AvForm onValidSubmit={(e, v) => handleSubmit(e, v)} >
              <div className="mb-3">
                <AvFieldSelecvt
                  name="from"
                  label={t("From")}
                  options={getFromOptions()}
                  value={from}
                  onChange={(e) => handleOnSelect(e, "from")}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "From is required"
                    },
                  }}
                />
              </div>
              <div className="mb-3">
                <AvFieldSelecvt
                  name="to"
                  label={t("To")}
                  value={to}
                  options={getToOptions()}
                  onChange={(e) => handleOnSelect(e, "to")}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "To is required"
                    },
                  }}
                />
              </div>
              {
                differentCurrency && (
                  conversionLoading ? <Loader/> : (
                    <div className="mb-3">
                      <Alert color="warning">
                        {t("You have selected different currencies. Conversion rate will be applied.")}
                        {` 1 ${from.currency} = ${parseFloat((conversionRate))?.toFixed(2)} ${to.currency}`}
                      </Alert>
                    </div>
                  )
                )
              }
              <div className="mb-3">
                <AvField
                  name="amount"
                  label={from ? `${t("Amount")} (${from.currency})` : t("Amount")}
                  type="number"
                  onChange={(e) => setAmount(e.target.value)}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Amount is required"
                    },
                    min: {
                      value: 1,
                      errorMessage: "Amount must be greater than 0"
                    },
                    max: {
                      value: from?.amount,
                      errorMessage: `You don't have enough balance. Your balance is ${from?.amount} ${from?.currency}`
                    }
                  }}
                />
              </div>
              <div className="mb-3">
                <AvField
                  name="note"
                  label={t("Note")}
                  type="text"
                />
              </div>
              <div className="mb-3">
                {
                  (amount > 0 && to && from) && (
                    <Alert className="text-center">
                      {!differentCurrency ? `Total credit Amount: ${amount} ${from?.currency}` : `Total credit Amount: ${(amount * conversionRate)?.toFixed(3)} ${to?.currency}`}
                    </Alert>
                  )
                }
              </div>
              <div className="mb-3 text-center">
                {
                  conversionLoading ? <Loader/> : (
                    <Button className="color-bg-btn border-0 w-75" type="submit">
                      {t("Submit")}
                    </Button>
                  )
                }
              </div>
            </AvForm>
          </ModalBody>
        )
      }
    </Modal>
  );
}
