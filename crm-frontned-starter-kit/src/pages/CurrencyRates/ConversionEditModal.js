import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useTranslation } from "react-i18next";
import { editConversionRates } from "store/actions";

function ConversionEditModal(props) {
  const {
    editModal,
    toggleEditModal,
    value,
  } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleAddConversionRate = (e, values = {}) => {
    if (!values) return;
    dispatch(editConversionRates({
      id: value._id,
      ...values
    }));
  };

  return (
    <Modal isOpen={editModal} toggle={toggleEditModal} centered={true}>
      <ModalHeader toggle={toggleEditModal} tag="h4">
        Edit Conversion Rate
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
              value={value.baseCurrency}
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
              value={value.targetCurrency}
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
              value={value.value}
              errorMessage={t("Enter Value")}
              validate={{ required: { value: true } }}
            />
          </div>
          <div className="text-center ">
            <Button type="submit"  color="primary" className="">
              {t("Save")}
            </Button>
          </div>
        </AvForm>
      </ModalBody>
    </Modal>
  );
}

export default (ConversionEditModal);
