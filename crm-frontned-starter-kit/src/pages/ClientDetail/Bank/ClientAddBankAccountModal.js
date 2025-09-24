import React, { useState, useEffect } from "react";
import {
  Link, useParams
} from "react-router-dom";
import { useDispatch, connect } from "react-redux";
import {
  Modal, Button, ModalHeader, ModalBody, UncontrolledAlert 
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

import { addBankAccount } from "store/bankAccount/actions";
// i18n
import { withTranslation } from "react-i18next";

function ClientAddBankAccountModal(props){
  const { buttonText } = props;
  const { id } = useParams();
  const { clientId } = props;
  const [addModal, setAddModal] = useState(false);
  const dispatch = useDispatch();
  const addBankAccountHandler = (e, values) => {
    values.customerId = clientId;
    dispatch(addBankAccount(values));
  };
  const toggleAddModal = () => {
    setAddModal(!addModal);
  };

  useEffect(()=>{
    if (props.addClearingCounter > 0 && addModal) {
      setAddModal(false);
    }
  }, [props.addClearingCounter]);
  
  return (
    <React.Fragment >
      <button className="btn btn-primary" onClick={toggleAddModal} disabled={props.isLead}>
        <i className={`bx ${!buttonText ? "bx-plus" : ""} me-1`}></i> {props.t(`${buttonText ? buttonText : "Add New Bank Account"}`)} 
      </button>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add new bank account")} 
        </ModalHeader>
        <ModalBody >
          <AvForm
            className="p-4" 
            onValidSubmit={(e, v) => {
              v.customerId = id;
              addBankAccountHandler(e, v);
            }}
          >
            <div className="mb-3">
              <AvField
                name="accountHolderName"
                label={props.t("Account owner name")}
                placeholder={props.t("Enter Account Owner Name")}
                type="text"
                errorMessage={props.t("Enter Account Owner Name")}
                // validate={{ required: { value: true } }}
              />
            </div>

            <div className="mb-3">
              <AvField
                name="bankName"
                label={props.t("Bank name")}
                placeholder={props.t("Enter Bank Name")}
                type="text"
                errorMessage={props.t("Enter Bank Name")}
                // validate={{ required: { value: true } }}
              />
            </div>

            <div className="mb-3">
              <AvField
                name="accountNumber"
                label={props.t("Account number")}
                placeholder={props.t("Enter Account Number")}
                type="text"
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
                //     },
                //     pattern: {
                //       value: "^[0-9]+$",
                //       errorMessage: "testing error message"
                //     },
                //   }
                // }
              />
            </div>

            <div className="mb-3">
              <AvField
                name="swiftCode"
                label={props.t("Swift code")}
                placeholder={props.t("Enter Swift Code")}
                type="text"
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
                name="address"
                label={props.t("Address")}
                placeholder={props.t("Enter Address")}
                type="text"
                errorMessage={props.t("enter Address")}
                // validate={{ required: { value: true } }}
              />
            </div>

            <div className="mb-3">
              <AvField
                name="iban"
                label={props.t("IBAN")}
                placeholder={props.t("Enter IBAN")}
                type="text"
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
                //       errorMessage: "IBAN must contain at least 13 characters"
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
                errorMessage={props.t("Enter Currency")}
                // validate={{ required: { value: true } }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="intermediaryBank"
                label={props.t("Intermediary Bank")}
                placeholder={props.t("Intermediary Bank")}
                type="text"
                // errorMessage={props.t("Intermediary Bank")}
                // validate={{ required: { value: true } }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="intermediaryAccountNo"
                label={props.t("Intermediary Account No")}
                placeholder={props.t("Intermediary Account No")}
                type="text"
                // errorMessage={props.t("Intermediary Account No")}
                // validate={{ required: { value: true } }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="intermediaryBankSwiftCode"
                label={props.t("Intermediary Bank Swift Code")}
                placeholder={props.t("Intermediary Bank Swift Code")}
                type="text"
                // errorMessage={props.t("Intermediary Bank Swift Code")}
                // validate={{ required: { value: true } }}
              />
            </div>
            <div className="text-center pt-3 p-2">
              {/* on clicking this button it switches from the list component to the edit component if 
                  submission is valid but it adds the new system email to the db onValidSubmit above */}
              <Button disabled={props.addLoading} type="submit" color="primary">
                {props.t("Add")}
              </Button>
            </div>
          </AvForm>
          {props.addError && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {/* TODO this needs to be handled in translation */}
            {props.t(JSON.stringify(props.addErrorDetails))}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  addLoading: state.bankAccountReducer.addLoading,
  addErrorDetails: state.bankAccountReducer.addErrorDetails,
  addSuccess: state.bankAccountReducer.addSuccess,
  addError: state.bankAccountReducer.addError,  
  addClearingCounter: state.bankAccountReducer.addClearingCounter
});

export default connect(mapStateToProps, null)(withTranslation()(ClientAddBankAccountModal));