import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useTranslation } from "react-i18next";
import { addConversionRates } from "store/actions";

function ConversionAddModal(props) {
  const [addModal, setAddTeamModal] = useState(false);
  const {
    submit,
    clearingCounter
  } = useSelector((state) => state.conversionRatesReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const toggleAddModal = () => {
    setAddTeamModal(!addModal);
  };
  const handleAddConversionRate = (e, values = {}) => {
    dispatch(addConversionRates(values));
  };

  useEffect(() => {
    if (clearingCounter > 0 && addModal) {
      setAddTeamModal(false);
    }
  }, [submit]);
  const create = true;
  return (
    <React.Fragment>
      <Button color="primary" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}>
        <i className="bx bx-plus me-1"></i>  Add New Conversion Rate
      </Button>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          Add Conversion Rate
        </ModalHeader>
        <ModalBody>
          <AvForm
            className="p-4"
            onValidSubmit={(e, v) => {
              handleAddConversionRate(e, v);
            }}
          >
            <div className="mb-3">
              <AvField
                name="baseCurrency"
                label={t("Base Currency")}
                placeholder={t("Enter Base Currency")}
                type="text"
                errorMessage={t("Enter Base Currency")}
                validate={{ required: { value: true } }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="targetCurrency"
                label={t("Target Currency")}
                placeholder={t("Enter Target Currency")}
                type="text"
                errorMessage={t("Enter Target Currency")}
                validate={{ required: { value: true } }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="value"
                label={t("Value")}
                placeholder={t("Enter Value")}
                type="text"
                errorMessage={t("Enter Value")}
                validate={{ required: { value: true } }}
              />
            </div>
            <div className="text-center ">
              <Button type="submit"  color="primary" className="">
                Add
              </Button>
            </div>
          </AvForm>
          {props.addError && (
            <UncontrolledAlert color="danger">
              <i className="mdi mdi-block-helper me-2"></i>
              {/* {props.addErrorDetails} */}
            </UncontrolledAlert>
          )}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

export default (ConversionAddModal);
