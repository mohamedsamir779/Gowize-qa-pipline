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

// i18n
import { withTranslation } from "react-i18next";
import { editBankAccount } from "store/companyBankAccount/actions";

function BankAccountEditModal(props){
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
                name="bankName"
                label={props.t("Bank name")}
                placeholder={props.t("Enter Bank Name")}
                type="text"
                value={selectedBankAccount.bankName}
                errorMessage={props.t("Enter Bank Name")}
                // validate={{ required: { value: true } }}
              />
            </div>

            <div className="mb-3">
              <AvField
                name="swiftCode"
                label={props.t("Swift code")}
                placeholder={props.t("Enter Swift Code")}
                type="text"
                value={selectedBankAccount.swiftCode}
                // validate={
                //   { 
                //     required: { 
                //       value: true,
                //       errorMessage: "Enter swift code" 
                //     },
                //     minLength: {
                //       value: 8,
                //       errorMessage: "Swift code must consist of 8 characters"
                //     },
                //     maxLength: {
                //       value: 8,
                //       errorMessage: "Swift code must consist of 8 characters"
                //     },
                //     pattern: {
                //       value: "/^[A-Z]*$/",
                //       errorMessage: "Swift code can only contain uppercase characters"
                //     }
                //   }
                // }
              />
            </div>

            <div className="mb-3">
              <AvField
                name="iban"
                label={props.t("IBAN")}
                placeholder={props.t("Enter IBAN")}
                type="text"
                value={selectedBankAccount.iban}
                errorMessage={props.t("Enter IBAN")}
                // validate={
                //   { 
                //     required: { 
                //       value: true,
                //       errorMessage: "Enter IBAN"
                //     },
                //     pattern: {
                //       value: "^[A-Z][A-Z]", 
                //       errorMessage: "IBAN must start with two uppercase charecters"
                //     },
                //     minLength: {
                //       value: 13,
                //       errorMessage: "IBAN must contain 13 characters/digits at least"
                //     }
                //   }
                // }
              />
            </div>

            <div className="mb-3">
              <AvField
                name="accountNumber"
                label={props.t("Account number")}
                placeholder={props.t("Enter Account Number")}
                type="text"
                value={selectedBankAccount.accountNumber}
                errorMessage={props.t("Enter Account Number")}
                onKeyPress={(e) => {
                  if (!isNaN(e.key) && e.target.value.length > 0){
                    return true;
                  }
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                // validate={
                //   { 
                //     required: { 
                //       value: true, 
                //       errorMessage: "Enter account number" 
                //     },
                //     number: {
                //       value: true,
                //       errorMessage: "Account number must be a number"
                //     }
                //   }
                // }
              />
            </div>

            <div className="mb-3">
              <AvField
                name="currency"
                label={props.t("Currency")}
                placeholder={props.t("Enter Currency")}
                type="text"
                value={selectedBankAccount.currency}
                errorMessage={props.t("Enter Currency")}
                // validate={{ required: { value: true } }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="intermediaryBank"
                label={props.t("Intermediary Bank")}
                placeholder={props.t("Intermediary Bank")}
                value={selectedBankAccount.intermediaryBank}

                type="text"
              />
            </div>
            <div className="mb-3">
              <AvField
                name="intermediaryAccountNo"
                label={props.t("Intermediary Account No")}
                placeholder={props.t("Intermediary Account No")}
                type="text"
                value = {selectedBankAccount.intermediaryAccountNo}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="intermediaryBankSwiftCode"
                label={props.t("Intermediary Bank Swift Code")}
                placeholder={props.t("Intermediary Bank Swift Code")}
                value = {selectedBankAccount.intermediaryBankSwiftCode}
                type="text"
              />
            </div>
            {/* submit button */}
            <div className='text-center pt-3 p-2'>
              <Button disabled={props.editResult} type="submit" color="primary">
                {props.t("Edit")}
              </Button>
            </div>
          </AvForm>
          {props.editError && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {/* TODO this needs to be handled in translation */}
            {props.t(JSON.stringify(props.editError))}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}


const mapStateToProps = (state) => ({
  editResult: state.bankAccountReducer.editResult,
  editError: state.bankAccountReducer.editError,
  bankAccountEditClearingCounter: state.bankAccountReducer.bankAccountEditClearingCounter
});

export default connect(mapStateToProps, null)(withTranslation()(BankAccountEditModal));