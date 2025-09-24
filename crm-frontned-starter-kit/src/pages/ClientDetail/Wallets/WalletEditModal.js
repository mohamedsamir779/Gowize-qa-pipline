// a modal to only edit title and action
import React, { useEffect } from "react";
import {
  useDispatch, connect
} from "react-redux";
import {
  Modal, Button,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
} from "reactstrap";
import {
  AvForm, AvField
} from "availity-reactstrap-validation";

import { editBankAccount } from "store/bankAccount/actions";
// i18n
import { withTranslation } from "react-i18next";

function WalletEditModal(props){
  const { open, selectedBankAccount = {}, onClose } = props;
  const dispatch = useDispatch();
  const handleEditSystemEmail = (e, values) => {
    dispatch(editBankAccount({
      id: selectedBankAccount.id,
      values
    }));
  };
  useEffect(()=>{
    if (props.bankAccountEditClearingCounter > 0 && open) {
      onClose();
    }
  }, [props.bankAccountEditClearingCounter]);

  return (
    <React.Fragment >
      <Modal isOpen={open} toggle={onClose} centered={true}>
        <ModalHeader toggle={onClose} tag="h4">
          {props.t("Edit bank account")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleEditSystemEmail(e, v);
              props.bankAccountUpdateHandler();
            }}
          >
            <div className="mb-3">
              <AvField
                name="assetId"
                label={props.t("Asset Id")}
                placeholder={props.t("Asset id")}
                type="text"
                value={selectedBankAccount.bankName}
                errorMessage={props.t("Bank name is required")}
                validate={{ required: { value: true } }}
              />
            </div>

            {/* submit button */}
            <div className='text-center pt-3 p-2'>
              <Button disabled={props.addLoading} type="submit" color="primary">
                {props.t("Update")}
              </Button>
            </div>
          </AvForm>
          {props.editError && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {/* TODO this needs to be handled in translation */}
            {props.t(JSON.stringify(props.editError))}
          </UncontrolledAlert>}
          {props.editResult && <UncontrolledAlert color="success">
            <i className="mdi mdi-check-all me-2"></i>
            {props.t("Wallet updated successfully")} !!!
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}


const mapStateToProps = (state) => ({
  addLoading: state.walletReducer.addLoading,
  editResult: state.walletReducer.editResult,
  editError: state.walletReducer.editError,
  bankAccountEditClearingCounter: state.walletReducer.bankAccountEditClearingCounter
});

export default connect(mapStateToProps, null)(withTranslation()(WalletEditModal));