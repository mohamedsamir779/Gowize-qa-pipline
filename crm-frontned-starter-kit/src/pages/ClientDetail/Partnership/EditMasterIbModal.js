import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AvField, AvForm } from "availity-reactstrap-validation";
import { updateMasterIbAgreement } from "store/actions";

import {
  Row, Col, Button,
  Modal, ModalBody, ModalHeader,
} from "reactstrap";

import validatePositiveInputs from "helpers/validatePositiveInputs";
import AvFieldSelect from "components/Common/AvFieldSelect";

const getAccountTypeName = (accountTypeId, accountTypes) => {
  return accountTypes?.find((type) => type._id === accountTypeId)?.title;
};

const EditMasterIbModal = ({ show, toggle, accountTypes, customerId, products, agreement, markups }) => {
  const customerAgreement = agreement.members && agreement.members.find((mem) => mem.customerId._id === customerId);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { submitting } = useSelector((state) => state.ibAgreements);

  useEffect(() => {
    !submitting && show && toggle();
  }, [submitting]);

  return (
    <Modal isOpen={show} toggle={toggle} centered={true} scrollable={true}>
      <ModalHeader toggle={toggle} tag="h4">
        {t("Edit Master IB Agreement")}
      </ModalHeader>
      <ModalBody >
        <AvForm
          onValidSubmit={(e, v) => {
            dispatch(updateMasterIbAgreement({
              id: agreement._id,
              customerId,
              title: v.title,
              values: v.values,
            }));
          }}
        >
          <AvField
            name={"title"}
            label={t("Agreement name")}
            className="mb-3"
            type="text"
            value={agreement.title}
            errorMessage={t("Required!")}
            validate={{ required: { value: true } }}
          />
          {customerAgreement?.values.map((agr, agrIdx) =>
            <Row key={agr._id}>
              <h6>{getAccountTypeName(agr.accountTypeId, accountTypes)}</h6>
              <Row className="justify-content-start">
                <Col md="3">{t("Type")}</Col>
                <Col>{t("Total Rebate")}</Col>
                <Col>{t("Total Comission")}</Col>
              </Row>
              {products.map((prod, prodIdx) =>
                <>          
                  <Row key={prodIdx} className="my-1 align-items-center">
                    <Col md="2">{prod}</Col>
                    <Col>
                      <AvField
                        name={`values[${agrIdx}].accountTypeId`}
                        value={agr.accountTypeId}
                        type="hidden"
                      />
                      <AvField
                        name={`values[${agrIdx}].products.${prod}.rebate`}
                        value={agr.products[prod]?.rebate}
                        type="string"
                        errorMessage={t("Invalid value!")}
                        validate={{
                          required: { value: true },
                          min: { value: 0 }
                        }}
                        onKeyPress={(e) => validatePositiveInputs(e)}
                      />
                    </Col>
                    <Col>
                      <AvField
                        className="mt-3"
                        name={`values[${agrIdx}].products.${prod}.commission`}
                        value={agr.products[prod]?.commission}
                        type="string"
                        errorMessage={t("Invalid value!")}
                        validate={{
                          required: { value: true },
                          min: { value: 0 }
                        }}
                        onKeyPress={(e) => validatePositiveInputs(e)}
                      />
                    </Col>
                  </Row>
                </>
              )}
              <Row key={agrIdx} className="my-1 align-items-center">
                <Col md="2">
                  {t("Markup")}
                </Col>
                <Col>
                  <AvFieldSelect
                    name={`values[${agrIdx}].markup`}
                    value={agr.markup}
                    options={(markups || []).map((obj)=>{
                      return ({
                        label: `${obj}`, 
                        value: obj
                      });
                    })} 
                  />
                </Col>
              </Row>
              <hr className="my-3" />
            </Row>
          )}
          <Button type="submit" disabled={submitting}>{t("Submit")}</Button>
        </AvForm>
      </ModalBody>
    </Modal >);
};

export default EditMasterIbModal;
