import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal, Button, ModalHeader, ModalBody 
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import Loader from "components/Common/Loader";
import AvFieldSelect from "components/Common/AvFieldSelect";
import validatePositiveInputs from "helpers/validatePositiveInputs";

import { updateAccountType } from "store/actions";

const PLATFORMS = ["MT5", "MT4", "CTRADER"];
const TYPES = ["LIVE", "DEMO", "IB"];
const LEVERAGE = [1, 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000];
const CURRENCIES = ["USD", "EUR", "GBP", "EGP"];

function EditAccountType({ show, toggle, selectedAccountType }) {
  const dispatch = useDispatch();
  const { updating, error } = useSelector(
    (state) => state.tradingAccountReducer
  );
  const [leverageOptions, setLeverageOptions] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    if (selectedAccountType) {
      setCurrencies(
        selectedAccountType.currencies.map((currency) => currency.currency)
      );
      setLeverageOptions(selectedAccountType.leverages);
    }
  }, [selectedAccountType]);

  useEffect(() => {
    !updating && !error && show && toggle();
  }, [updating]);

  const handleSubmit = (e, v) => {
    // add groupPath to currencies array
    v.currencies = v.currencies.reduce((acc, curr) => {
      acc.push({
        currency: curr,
        groupPath: v[`${curr}GroupPath`],
      });
      delete v[`${curr}GroupPath`];
      return acc;
    }, []);
    dispatch(updateAccountType(selectedAccountType._id, v));
  };

  return (
    <>
      <Modal isOpen={show} toggle={toggle} centered={true}>
        <ModalHeader toggle={toggle} tag="h4">
          Edit Account Type
        </ModalHeader>
        <ModalBody>
          <AvForm
            className="px-4"
            onValidSubmit={(e, v) => {
              handleSubmit(e, v);
            }}
          >
            <AvField
              name="title"
              label="Title"
              placeholder="Select Title"
              type="text"
              value={selectedAccountType?.title}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Title is required",
                },
              }}
            />
            <AvFieldSelect
              name="platform"
              label="Platform"
              placeholder="Select Platform"
              value={selectedAccountType?.platform}
              options={PLATFORMS.map((type) => ({
                value: type,
                label: type,
              }))}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Platform is required",
                },
              }}
            />
            <AvFieldSelect
              name="type"
              label="Type"
              placeholder="Select Type"
              options={TYPES.map((type) => ({
                value: type,
                label: type,
              }))}
              value={selectedAccountType?.type}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Type is required",
                },
              }}
            />
            <AvFieldSelect
              name="leverages"
              label="Leverage Options"
              placeholder="Select Leverage Options"
              ismulti={true}
              value={selectedAccountType?.leverages}
              options={LEVERAGE.map((type) => ({
                value: type,
                label: type,
              }))}
              onChange={(e) => {
                setLeverageOptions(e);
              }}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Leverage options is required",
                },
              }}
            />
            <AvFieldSelect
              name="defaultLeverage"
              label="Default Leverage"
              placeholder="Select Default Leverage"
              options={leverageOptions?.map((type) => ({
                value: type,
                label: type,
              }))}
              // if default leverage is not in leverage options, set it to null
              value={
                leverageOptions?.includes(selectedAccountType?.defaultLeverage)
                  ? selectedAccountType?.defaultLeverage
                  : null
              }
              validate={{
                required: {
                  value: true,
                  errorMessage: "Default leverage is required",
                },
              }}
            />
            <AvField
              name="minWithdrawal"
              label="Min Withdrawal"
              placeholder="Add Min Withdrawal"
              type="number"
              min="0"
              value={selectedAccountType?.minWithdrawal}
              onKeyPress={(e) => {
                validatePositiveInputs(e);
              }}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Min Withdrawal is required",
                },
              }}
            />
            <AvField
              name="minDeposit"
              label="Min Deposit"
              placeholder="Add Min Deposit"
              type="number"
              min="0"
              value={selectedAccountType?.minDeposit}
              onKeyPress={(e) => {
                validatePositiveInputs(e);
              }}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Min Deposit is required",
                },
              }}
            />
            <AvField
              name="sequence"
              label="Sequence"
              placeholder="Select Sequence"
              type="number"
              min="0"
              onKeyPress={(e) => {
                validatePositiveInputs(e);
              }}
              value={selectedAccountType?.sequence}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Sequence is required",
                },
              }}
            />
            <AvFieldSelect
              name="currencies"
              label="Currencies"
              placeholder="Select Currencies"
              ismulti={true}
              options={CURRENCIES.map((type) => ({
                value: type,
                label: type,
              }))}
              onChange={(e) => {
                setCurrencies(e);
              }}
              value={currencies}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Currencies is required",
                },
              }}
            />
            {currencies.length > 0 &&
              currencies.map((currency) => (
                <AvField
                  key={currency}
                  name={`${currency}GroupPath`}
                  label={`${currency} Group Path`}
                  placeholder={`Select ${currency} group path`}
                  type="text"
                  value={
                    selectedAccountType?.currencies.find(
                      (curr) => curr.currency === currency
                    )?.groupPath
                  }
                  validate={{
                    required: {
                      value: true,
                      errorMessage: `${currency} group path is required`,
                    },
                  }}
                />
              ))}
            <div className="text-center mt-3 p-2">
              {updating ? (
                <Loader />
              ) : (
                <Button disabled={updating} type="submit" color="primary">
                  Edit
                </Button>
              )}
            </div>
          </AvForm>
        </ModalBody>
      </Modal>
    </>
  );
}

export default EditAccountType;
