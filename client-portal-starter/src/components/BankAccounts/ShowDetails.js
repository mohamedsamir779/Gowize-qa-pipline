import React from "react";
import { 
  InputGroup, 
  InputGroupText, 
  Label, 
  Modal,
  Button, 
} from "reactstrap";
//i18n
import { useTranslation, withTranslation } from "react-i18next";

function ShowDetails({
  isOpen,
  toggleOpen = () => {},
  BankAccountData,
  ...props
}) {
  const { t } = useTranslation(); 
  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggleOpen}
        centered={true}
        size="lg"
        className="custom-modal"
      >
        <div className="modal-header">
          <button
            type="button"
            className="close btn btn-soft-dark waves-effect waves-light btn-rounded m-4"
            data-dismiss="modal"
            aria-label="Close"
            onClick={toggleOpen}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <h6>{props.t("Bank Account")}</h6>
          <>
            <Label className="mb-2"></Label>
            <div className="mb-3">
              <InputGroup>
                <InputGroupText className="w-100">
                  {BankAccountData?.accountHolderName}
                </InputGroupText>
              </InputGroup>
            </div>
            <div className="mb-3">
              <InputGroup>
                <InputGroupText className="w-100">
                  {BankAccountData?.bankName}
                </InputGroupText>
              </InputGroup>
            </div>
            <div className="mb-3">
              <InputGroup>
                <InputGroupText className="w-100">
                  {BankAccountData?.accountNumber}
                </InputGroupText>
              </InputGroup>
            </div>
            <div className="mb-3">
              <InputGroup>
                <InputGroupText className="w-100">
                  {BankAccountData?.address}
                </InputGroupText>
              </InputGroup>
            </div>
            <div className="mb-3">
              <InputGroup>
                <InputGroupText className="w-100">
                  {BankAccountData?.swiftCode}
                </InputGroupText>
              </InputGroup>
            </div>
            <div className="mb-3">
              <InputGroup>
                <InputGroupText className="w-100">
                  {BankAccountData?.currency}
                </InputGroupText>
              </InputGroup>
            </div>
            <div className="text-center">
              <Button
                className="btn btn-secondary m-2 btn-sm w-lg"
                onClick={() => toggleOpen()}
              >
                {t("Close")}
              </Button>
            </div>
          </>
        </div>
      </Modal>
    </>
  );
}
export default withTranslation()(ShowDetails); 