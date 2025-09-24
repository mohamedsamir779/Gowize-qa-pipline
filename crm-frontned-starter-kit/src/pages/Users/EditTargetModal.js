import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal, Button,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import {
  AvForm, AvField
} from "availity-reactstrap-validation";
import { editTargetStart } from "store/users/actions";
import Loader from "components/Common/Loader";
import { enableFX, enableCrypto } from "config";
import validatePositiveInputs from "helpers/validatePositiveInputs";

function EditTarget({ show, toggle, user }) {
  const dispatch = useDispatch();
  const handleEditTarget = (e, values) => {
    values.userId = user._id;
    dispatch(editTargetStart(values));
  };
  const { submitting } = useSelector((state) => state.usersReducer);

  useEffect(() => {
    !submitting && show && toggle();
  }, [submitting]);
  return (
    <Modal isOpen={show} toggle={toggle} centered={true}>
      <ModalHeader toggle={toggle} tag="h4">
        Change Target
      </ModalHeader>
      <ModalBody >
        <AvForm
          className='p-4'
          onValidSubmit={(e, v) => {
            handleEditTarget(e, v);
          }}
        >
          {enableCrypto &&
            <AvField
              name="crypto.deposit"
              label={enableFX ? "Crypto Money In" : "Money In"}
              type="number"
              value={user?.targetId?.crypto.deposit || "0"}
              min="0"
              errorMessage="Enter money in amount"
              validate={{ required: { value: true } }}
              onKeyPress={(e) => validatePositiveInputs(e)}
            />}
          {enableFX &&
            <AvField
              name="fx.deposit"
              label={enableCrypto ? "Forex Money In" : "Money In"}
              type="number"
              value={user?.targetId?.fx.deposit || "0"}
              min="0"
              errorMessage="Enter money in amount"
              validate={{ required: { value: true } }}
              onKeyPress={(e) => validatePositiveInputs(e)}
            />}
          <AvField
            name="accounts"
            label="Accounts"
            type="number"
            value={user?.targetId?.accounts || "0"}
            min="0"
            errorMessage="Enter no. of accounts"
            validate={{ required: { value: true } }}
            onKeyPress={(e) => validatePositiveInputs(e)}
          />
          {enableFX &&
            <AvField
              name="ibAccounts"
              label="IB Accounts"
              type="number"
              value={user?.targetId?.ibAccounts || "0"}
              min="0"
              errorMessage="Enter no. of IB accounts"
              validate={{ required: { value: true } }}
              onKeyPress={(e) => validatePositiveInputs(e)}
            />
          }
          <AvField
            name="volume"
            label="Volume"
            type="number"
            value={user?.targetId?.volume || "0"}
            min="0"
            errorMessage="Enter volume amount"
            validate={{ required: { value: true } }}
            onKeyPress={(e) => validatePositiveInputs(e)}
          />
          <div className='text-center'>
            {
              submitting
                ? <Loader />
                : <Button type="submit" color="primary">
                  Change
                </Button>
            }
          </div>
        </AvForm>
      </ModalBody>
    </Modal>
  );
}

export default EditTarget;
