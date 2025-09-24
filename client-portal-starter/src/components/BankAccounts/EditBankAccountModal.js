import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchBankAccounts } from "../../store/actions";

import {
  Button,
  Container,
  FormFeedback,
  Input,
  Label,
  Modal,
} from "reactstrap";
import { updateBankAccount } from "../../apis/bankAccounts";
import { showErrorNotification, showSuccessNotification } from "store/general/notifications/actions";
import { useTranslation } from "react-i18next";

function EditBankAccountModal({ isOpen, toggleOpen = () => { }, BankAccountData }) {
  const dispatch = useDispatch(); 
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [address, setAddress] = useState("");
  const [iban, setIban] = useState("");
  const [currency, setCurrency] = useState("");
  const [intermediaryBank, setIntermediaryBank] = useState("");
  const [intermediaryAccountNo, setIntermediaryAccountNo] = useState("");
  const [intermediaryBankSwiftCode, setIntermediaryBankSwiftCode] = useState("");
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false); 

  const [validation, setValidation] = useState({
    swiftCode: "",
    iban: ""
  });
  useEffect(() => {
    setAccountName(BankAccountData?.accountHolderName);
    setBankName(BankAccountData?.bankName);
    setAccountNumber(BankAccountData?.accountNumber);
    setSwiftCode(BankAccountData?.swiftCode);
    setAddress(BankAccountData?.address);
    setIban(BankAccountData?.iban);
    setCurrency(BankAccountData?.currency);
  }, [isOpen]);

  // addBankAccount
  const handelSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateBankAccount({
      id: BankAccountData._id,
      body: {
        accountHolderName: accountName,
        bankName: bankName,
        accountNumber: accountNumber,
        swiftCode: swiftCode,
        address: address,
        iban: iban,
        currency: currency,
        intermediaryBank: intermediaryBank,
        intermediaryAccountNo: intermediaryAccountNo,
        intermediaryBankSwiftCode: intermediaryBankSwiftCode,
      }
    })
      .then(() => {
        dispatch(showSuccessNotification("Bank Account Updated successfully !!!"));
        toggleOpen();
        dispatch(
          fetchBankAccounts({
            limit: 100,
            page: 1,
          })
        );
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        dispatch(showErrorNotification(e.toString()));
      });
  };

  // swift code validation handler
  const swiftCodeValidationHandler = (e) => {
    setValidation({
      ...validation,
      swiftCode: {
        error: false,
        errorMessage: ""
      }
    });
    const swiftCode = e?.target?.value;
    const swiftCodeLength = swiftCode.length;

    if (swiftCodeLength !== 8){
      setValidation({
        ...validation,
        swiftCode: {
          error: true,
          errorMessage: t("Swift code must consist of 8 characters")
        }
      });
    } else if (swiftCodeLength === 0){
      setValidation({
        ...validation,
        swiftCode: {
          error: true,
          errorMessage: t("Enter swift code")
        }
      });
    } else if (swiftCode !== swiftCode.toUpperCase()){
      setValidation({
        ...validation,
        swiftCode: {
          error: true,
          errorMessage: t("Swift code must contain uppercase characters only")
        }
      });
    } else if (/\d/.test(swiftCode)){
      setValidation({
        ...validation,
        swiftCode: {
          error: true,
          errorMessage: t("Swift code can't contain numbers")
        }
      });
    }
  };

  // iban validation handler
  const ibanValidationHandler = (e) => {
    setValidation({
      ...validation,
      iban: {
        error: false,
        errorMessage: ""
      }
    });
    const iban = e?.target?.value;
    const ibanLength = iban.length;

    if (ibanLength === 0){
      setValidation({
        ...validation,
        iban: {
          error: true,
          errorMessage: t("Enter an IBAN")
        }
      });
    } else if (ibanLength < 13){
      setValidation({
        ...validation,
        iban: {
          error: true,
          errorMessage: t("IBAN must contain 13 characters/digits at least")
        }
      });
    } else if (ibanLength > 16){
      setValidation({
        ...validation,
        iban: {
          error: true,
          errorMessage: t("IBAN must contain 16 characters/digits at most")
        }
      });
    } else if (
      iban[0] !== iban[0].toUpperCase() ||
      /\d/.test(iban[0]) ||
      iban[1] !== iban[1].toUpperCase() ||
      /\d/.test(iban[1])
    ){
      setValidation({
        ...validation,
        iban: {
          error: true,
          errorMessage: t("IBAN must start with two uppercase charecters")
        }
      });
    }
  };

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
          <h6>{t("Update Bank Account")}</h6>
          <form onSubmit={handelSubmit}>
            <br />
            <Container>
              <div className="mb-3">
                <Label className="form-label mb-3">{t("Account Name")}</Label>
                <Input
                  required
                  onChange={(e) => {
                    setAccountName(e.target.value);
                  }}
                  className="form-control"
                  type="text"
                  defaultValue={accountName}
                  placeholder={t("Enter Account Name")}
                />
              </div>
              <div className="mb-3">
                <Label className="form-label mb-3">{t("Bank Name")}</Label>
                <Input
                  required
                  onChange={(e) => {
                    setBankName(e.target.value);
                  }}
                  className="form-control"
                  type="text"
                  defaultValue={BankAccountData.bankName}
                  placeholder={t("Enter Bank Name")}
                />
              </div>
              <div className="mb-3">
                <Label className="form-label mb-3">{t("Account Number")}</Label>
                <Input
                  required
                  onChange={(e) => {
                    setAccountNumber(e.target.value);
                  }}
                  className="form-control"
                  type="number"
                  defaultValue={BankAccountData.accountNumber}
                  placeholder={t("Enter Account Number")}
                />
              </div>
              <div className="mb-3">
                <Label className="form-label mb-3">{t("Swift Code")}</Label>
                <Input
                  required
                  onChange={(e) => {
                    setSwiftCode(e.target.value);
                    swiftCodeValidationHandler(e);
                  }}
                  className="form-control"
                  type="text"
                  defaultValue={BankAccountData.swiftCode}
                  placeholder={t("Enter Swift Code")}
                  invalid={validation.swiftCode.error}
                />
                <FormFeedback>
                  {validation.swiftCode.errorMessage}
                </FormFeedback>
              </div>
              <div className="mb-3">
                <Label className="form-label mb-3">{t("Address")}</Label>
                <Input
                  required
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  className="form-control"
                  type="text"
                  defaultValue={BankAccountData.address}
                  placeholder={t("Enter Address")}
                />
              </div>
              <div className="mb-3">
                <Label className="form-label mb-3">{t("IBAN")}</Label>
                <Input
                  required
                  onChange={(e) => {
                    setIban(e.target.value);
                    ibanValidationHandler(e);
                  }}
                  className="form-control"
                  type="text"
                  defaultValue={BankAccountData.iban}
                  placeholder={t("Enter Iban")}
                  invalid={validation.iban.error}
                />
                <FormFeedback>
                  {validation.iban.errorMessage}
                </FormFeedback>
              </div>
              <div className="mb-3">
                <Label className="form-label mb-3">{t("Currency")}</Label>
                <select
                  onChange={(e) => setCurrency(e.target.value)}
                  className="form-control"
                  defaultValue={BankAccountData.currency}

                >
                  <option value="">{t("select")}</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div className="mb-3">
                <Label className="form-label mb-3">{t("Intermediary Bank")}</Label>
                <Input
                  onChange={(e) => {
                    setIntermediaryBank(e.target.value);
                  }}
                  className="form-control"
                  type="text"
                  placeholder="Enter Intermediary Bank"
                  defaultValue={BankAccountData.intermediaryBank}

                />
              </div>
              <div className="mb-3">
                <Label className="form-label mb-3">{t("Intermediary Account No")}</Label>
                <Input
                  onChange={(e) => {
                    setIntermediaryAccountNo(e.target.value);
                  }}
                  className="form-control"
                  type="text"
                  placeholder="Enter Intermediary Account No"
                  defaultValue={BankAccountData.intermediaryAccountNo}
                  
                />
  
              </div>
              <div className="mb-3">
                <Label className="form-label mb-3">{t("Intermediary Bank Swift Code")}</Label>
                <Input
                  onChange={(e) => {
                    setIntermediaryBankSwiftCode(e.target.value);
                  }}
                  className="form-control"
                  type="text"
                  placeholder="Enter Intermediary Bank Swift Code"
                  defaultValue={BankAccountData.intermediaryBankSwiftCode}
                />
              </div>
              <div className="text-center">
                <Button
                  className="btn btn-secondary m-2 btn-sm w-lg"
                  onClick={() => toggleOpen()}
                >
                  {t("cancel")}
                </Button>
                <Button
                  className="btn btn-danger m-2 btn-sm w-lg"
                  type="submit"
                  disabled={loading}
                >
                  {t("Edit")}
                </Button>
              </div>
            </Container>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default EditBankAccountModal;
