import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal, Button,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import {
  AvForm, AvField, AvCheckboxGroup, AvCheckbox
} from "availity-reactstrap-validation";
import Loader from "components/Common/Loader";
import useModal from "hooks/useModal";
import AvFieldSelect from "components/Common/AvFieldSelect";
import validatePositiveInputs from "helpers/validatePositiveInputs";
import { addAccountType } from "store/actions";

const PLATFORMS = ["MT5", "MT4", "CTRADER"];
const TYPES = ["LIVE", "DEMO", "IB"];
const LEVERAGE = [1, 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000];
const CURRENCIES = ["USD", "EUR", "GBP", "EGP"];

function AddAccountType(props) {
  const dispatch = useDispatch();

  const [showModal, toggleModal] = useModal(false);
  const [leverageOptions, setLeverageOptions] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const create = useSelector((state) => state.Profile?.AccTypesPermissions?.create);
  const { submitting, error } = useSelector((state) => state.tradingAccountReducer);

  useEffect(() => {
    (!submitting && !error && showModal) && toggleModal();
  }, [submitting]);

  const handleSubmit = (e, v) => {
    if (v.visibility.length > 0) {
      // convert visibility array to boolean properties
      v.visibility = v.visibility.reduce((acc, curr) => {
        acc[curr] = true;
        return acc;
      }, {});
      v = {
        ...v,
        ...v.visibility,
      };
    }
    delete v.visibility;
    // add groupPath to currencies array
    v.currencies = v.currencies.reduce((acc, curr) => {
      acc.push({
        currency: curr,
        groupPath: v[`${curr}GroupPath`],
      });
      delete v[`${curr}GroupPath`];
      return acc;
    }, []);
    dispatch(addAccountType(v));
  };

  return (
    <>
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleModal}><i className="bx bx-plus me-1"></i> Add New Type</Link>
      <Modal isOpen={showModal} toggle={toggleModal} centered={true}>
        <ModalHeader toggle={toggleModal} tag="h4">
          Add New Type
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='px-4'
            onValidSubmit={(e, v) => { handleSubmit(e, v) }}
          >
            <AvField
              name="title"
              label="Title"
              placeholder="Select Title"
              type="text"
              validate={{
                required: {
                  value: true,
                  errorMessage: "Title is required"
                }
              }}
            />
            <AvFieldSelect
              name="platform"
              label="Platform"
              placeholder="Select Platform"
              options={PLATFORMS.map((type) => ({
                value: type,
                label: type
              }))}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Platform is required"
                }
              }}
            />
            <AvFieldSelect
              name="type"
              label="Type"
              placeholder="Select Type"
              options={TYPES.map((type) => ({
                value: type,
                label: type
              }))}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Type is required"
                }
              }}
            />
            <AvFieldSelect
              name="leverages"
              label="Leverage Options"
              placeholder="Select Leverage Options"
              ismulti="true"
              options={LEVERAGE.map((type) => ({
                value: type,
                label: type
              }))}
              onChange={(e) => {
                setLeverageOptions(e);
              }}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Leverage options is required"
                }
              }}
            />
            <AvFieldSelect
              name="defaultLeverage"
              label="Default Leverage"
              placeholder="Select Default Leverage"
              options={leverageOptions.map((type) => ({
                value: type,
                label: type
              }))}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Default leverage is required"
                }
              }}
            />
            <AvField
              name="minWithdrawal"
              label="Min Withdrawal"
              placeholder="Add Min Withdrawal"
              type="number"
              min="0"
              onKeyPress={(e) => {
                validatePositiveInputs(e);
              }}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Min Withdrawal is required"
                }
              }}
            />
            <AvField
              name="minDeposit"
              label="Min Deposit"
              placeholder="Add Min Deposit"
              type="number"
              min="0"
              onKeyPress={(e) => {
                validatePositiveInputs(e);
              }}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Min Deposit is required"
                }
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
              validate={{
                required: {
                  value: true,
                  errorMessage: "Sequence is required"
                }
              }}
            />
            <AvFieldSelect
              name="currencies"
              label="Currencies"
              placeholder="Select Currencies"
              ismulti="true"
              options={CURRENCIES.map((type) => ({
                value: type,
                label: type
              }))}
              onChange={(e) => {
                setCurrencies(e);
              }}
              validate={{
                required: {
                  value: true,
                  errorMessage: "Currencies is required"
                }
              }}
            />
            {
              currencies.length > 0 &&
              currencies.map((currency) => (
                <AvField
                  key={currency}
                  name={`${currency}GroupPath`}
                  label={`${currency} Group Path`}
                  placeholder={`Select ${currency} group path`}
                  type="text"
                  validate={{
                    required: {
                      value: true,
                      errorMessage: `${currency} group path is required`
                    }
                  }}
                />
              ))
            }
            <AvCheckboxGroup inline name="visibility">
              <AvCheckbox label="For CRM" value="forCrm" />
              <AvCheckbox label="For CP" value="forCp" />
            </AvCheckboxGroup>
            <div className='text-center mt-3 p-2'>
              {
                submitting
                  ? <Loader />
                  : <Button disabled={props.addLoading} type="submit" color="primary">
                    Add
                  </Button>
              }
            </div>
          </AvForm>
        </ModalBody>
      </Modal>
    </>
  );
}

export default AddAccountType;