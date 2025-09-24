import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AvField, AvForm } from "availity-reactstrap-validation";
import { createMasterIbAgreement } from "store/actions";

import {
  Row, Col, Button,
  Modal, ModalBody, ModalHeader,
} from "reactstrap";
import AvFieldSelect from "components/Common/AvFieldSelect";
import validatePositiveInputs from "helpers/validatePositiveInputs";
import useDeepCompareEffect from "use-deep-compare-effect";

const AddMasterIbModal = ({ show, toggle, accountTypes: allAccountTypes, products, customerId, markups }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [accountTypes, setAccountTypes] = useState([]);
  const { submitting } = useSelector((state) => state.ibAgreements);

  useEffect(() => {
    !submitting && show && toggle();
  }, [submitting]);

  useDeepCompareEffect(() => {
    if (show && allAccountTypes && allAccountTypes.length > 0) {
      const accountTypes = new Set();
      allAccountTypes.forEach((acc) => {
        // if (acc.title !== "Demo") {
        //   accountTypes.add(acc);
        // }
        if (acc?.type?.toLowerCase() !== "demo") {
          accountTypes.add(acc);
        }
      });
      setAccountTypes((preValue) => [...Array.from(accountTypes)]);
    }
  }, [allAccountTypes, show]);

  return (
    <Modal isOpen={show} toggle={toggle} centered={true} scrollable={true}>
      <ModalHeader toggle={toggle} tag="h4">
        {t("New Master IB Agreement")}
      </ModalHeader>
      <ModalBody >
        <AvForm
          onValidSubmit={(e, v) => {
            dispatch(createMasterIbAgreement({
              customerId,
              title: v.title,
              values: v.values
            }));
          }}
        >
          <AvField
            name={"title"}
            label={t("Agreement name")}
            className="mb-3"
            type="text"
            errorMessage={t("Required!")}
            validate={{ required: { value: true } }}
          />
          {accountTypes && accountTypes?.map((acc, accIdx) => console.log("accountType", acc))}
          {accountTypes?.map((acc, accIdx) =>
            <>
              <Row key={accIdx}>
                <Row className="justify-content-end mb-2 fw-bold gx-0">
                  <Col md="3" className="text-center">{acc.title}</Col>
                  <Col className="ms-1">{t("Rebate")}</Col>
                  <Col>{t("Commission")}</Col>
                </Row>
                {products.map((prod, prodIdx) =>
                  <Row key={prodIdx} className="my-1 align-items-center">
                    <Col md="3" className="text-center">
                      {prod}
                      <AvField
                        name={`values[${accIdx}].accountTypeId`}
                        value={acc._id}
                        type="hidden"
                      />
                    </Col>
                    <Col>
                      <AvField
                        name={`values[${accIdx}].products.${prod}.rebate`}
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
                        name={`values[${accIdx}].products.${prod}.commission`}
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
                )}
                <Row key={accIdx} className="my-1 align-items-center">
                  <Col md="3" className="text-center">
                    {t("Markup")}
                  </Col>
                  <Col>
                    <AvFieldSelect
                      name={`values[${accIdx}].markup`}
                      options={(markups || []).map((obj) => {
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
            </>
          )}
          <Button type="submit" disabled={submitting}>{t("Submit")}</Button>
        </AvForm>
      </ModalBody>
    </Modal >);
};

export default AddMasterIbModal;
