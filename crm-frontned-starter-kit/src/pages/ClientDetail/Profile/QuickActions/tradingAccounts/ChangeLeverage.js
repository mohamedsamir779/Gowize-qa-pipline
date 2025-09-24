import React, { useDispatch, useSelector } from "react-redux";
import { AvForm, AvField } from "availity-reactstrap-validation";
import {
  Modal, ModalHeader, ModalBody, Button,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import Loader from "components/Common/Loader";
import { useEffect, useState } from "react";
import { fetchAccountTypes, updateLeverage } from "store/actions";
import AvFieldSelect from "components/Common/AvFieldSelect";
import LEVERAGES from "constants/accountType";
const ChangeLeverage = ({ show, toggle, selectedAccount: sA }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [leverages, setLeverages] = useState([]);
  const tradingAccounts = useSelector((state) => state.tradingAccountReducer.accounts.docs);
  const { submitting, error, accountTypes } = useSelector((state) => state.tradingAccountReducer);
  const [selectedAccount, setSelectedAccount] = useState(sA || "");

  useEffect(() => {
    if (submitting === false && error === null && show === true) {
      toggle();
    }
  }, [submitting]);

  useEffect(() => {
    if (!accountTypes?.length) {
      dispatch(fetchAccountTypes());
    }
  }, []);
  
  useEffect(() => {
    if (accountTypes?.length > 0 && selectedAccount) {
      const selectedAccountType = accountTypes.find((at) => at._id === selectedAccount.accountTypeId?._id);
      if (selectedAccountType?.leverages?.length > 0) {
        setLeverages(selectedAccountType.leverages);
      } else {
        setLeverages(LEVERAGES);
      }
    } else {
      setLeverages(LEVERAGES);
    }
  }, [selectedAccount, accountTypes]);
  return (
    <>
      <button 
        type="button" 
        className="btn btn-primary waves-effect waves-light w-100 me-1"
        onClick={toggle}
      >
        {t("Change Leverage")}
      </button>
      <Modal centered isOpen={show} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          {t("Change Leverage")}
        </ModalHeader>
        <ModalBody>
          <AvForm
            onValidSubmit={(e, v) => {
              dispatch(updateLeverage({
                _id: v.account,
                body: {
                  leverage: v.leverage,
                },
              }));
            }}
          >
            <AvFieldSelect
              name="account"
              label={t("Select Account")}
              value={selectedAccount?._id ?? ""}
              options={tradingAccounts
                ?.filter((account) => account.type === "LIVE")
                ?.map((account) => ({
                  value: account._id,
                  label: `${account.login} 1/(${account.MarginLeverage ?? account.Leverage ?? account.leverageInCents})`,
                }))}
              onChange={(e) => {
                const selectedAccount = tradingAccounts.find((account) => account._id === e);
                setSelectedAccount(selectedAccount);
              }}
            />
            <AvField type="select" name="leverage"
              value="100"
              label={t("Select Leverage")}
              className="form-select mt-1">
              {leverages.map((leverage) => (
                <option key={leverage} value={leverage}>1:{leverage}</option>
              ))}
            </AvField>
            <div className="text-center mt-3 mb-1">
              {
                submitting
                  ? <Loader />
                  : <Button type="submit" className="border-0 color-bg-btn shadow">{t("Change")}</Button>
              }
            </div>
          </AvForm>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ChangeLeverage;