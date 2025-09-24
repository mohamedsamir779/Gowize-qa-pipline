import React, { 
  useEffect, 
  useState 
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { 
  Row, 
  Col, 
  Button, 
  Modal, 
  ModalBody, 
  ModalHeader 
} from "reactstrap";
import { Accordion } from "react-bootstrap";
import { AvField, AvForm } from "availity-reactstrap-validation";
import validatePositiveInputs from "helpers/validatePositiveInputs";
import { updateSharedIbAgreement } from "store/actions";
import AvFieldSelect from "components/Common/AvFieldSelect";

const getAccountTypeName = (accountTypeId, accountTypes) => {
  return accountTypes?.find((type) => type._id === accountTypeId)?.title;
};

const EditSharedIbModal = ({
  show,
  toggle,
  accountTypes,
  products,
  agreement,
  markups,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [productsModel, setProductsModel] = useState({});
  const [ibRebateTotals, setIBRebateTotals] = useState({});
  const [submissionFailure, setSubmissionFailure] = useState(false);
  const [error, setError] = useState(null);

  const { submitting } = useSelector((state) => state.ibAgreements);

  const reloadIbRebateTitals = () => {
    (agreement?.members || []).forEach((member, memberIdx) => {
      (member?.values || []).forEach((val, valIdx) => {
        const accountTypeId = val.accountTypeId;
        const rebateId = `members-${memberIdx}#values-${valIdx}#rebate`;
        const comissionId = `members-${memberIdx}#values-${valIdx}#commission`;

        if (!ibRebateTotals[accountTypeId]) {
          ibRebateTotals[accountTypeId] = {};
        }

        ibRebateTotals[accountTypeId][rebateId] = val.rebate;
        ibRebateTotals[accountTypeId][comissionId] = val.commission;

        (products || []).forEach((prod) => {
          const prodRebateModel = `members[${memberIdx}]#values[${valIdx}]#products#${prod}#rebate`;
          const prodCommissionModel = `members[${memberIdx}]#values[${valIdx}]#products#${prod}#commission`;
          productsModel[prodRebateModel] = val.products[prod]?.rebate;
          productsModel[prodCommissionModel] = val.products[prod]?.commission;
        });
      });
    });
  };

  useEffect(() => {
    !submitting && show && toggle();
  }, [submitting]);

  useEffect(() => {
    setSubmissionFailure(false);
  }, []);

  useEffect(()=> {
    if (agreement) {
      reloadIbRebateTitals();
    }
  });

  const validateSharedAgreement = (params) => {
    const {
      title, totals, members
    } = params;
    if (!title || !totals || !members) {
      return setError("Invalid values found. Please check the form again!");
    }
    const totalsMap = new Map();
    for (let i = 0; i < totals.length; i++) {
      const total = totals[i];
      totalsMap.set(total.accountTypeId, {
        rebate: parseInt(total.rebate) || 0,
        commission: parseInt(total.commission) || 0,
      });
    }
    const membersMap = new Map();
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      let isMemberWiseTotalValid = true;
      for (let j = 0; j < member.values.length; j++) {
        const value = member.values[j];
        const key = value.accountTypeId;
        const rebate = parseInt(value.rebate) || 0;
        const commission = parseInt(value.commission) || 0;
        const products = value.products;
        // note that products is an object. So, we need to iterate over it and verify that sum of all products is equal to the rebate and commission
        let maxRebate = 0;
        let maxCommission = 0;
        for (const prod in products) {
          if (!products[prod].rebate) {
            products[prod].rebate = 0;
          }
          if (!products[prod].commission) {
            products[prod].commission = 0;
          }
          const currentRebate = parseInt(products[prod].rebate) || 0;
          const currentCommission = parseInt(products[prod].commission) || 0;
          if (currentRebate > maxRebate) {
            maxRebate = currentRebate;
          }
          if (currentCommission > maxCommission) {
            maxCommission = currentCommission;
          }
        }
        if (maxRebate > rebate || maxCommission > commission) {
          console.log("Products sum is invalid.");
          isMemberWiseTotalValid = false;
          setError("Products sum is invalid.");
          break;
        }
        membersMap.set(key, {
          rebate: (membersMap.get(key)?.rebate || 0) + rebate,
          commission: (membersMap.get(key)?.commission || 0) + commission,
        });
        if (
          totalsMap.get(key)?.rebate < membersMap.get(key)?.rebate ||
          totalsMap.get(key)?.commission < membersMap.get(key)?.commission
        ) {
          console.log("Member wise total is invalid.");
          isMemberWiseTotalValid = false;
          setError("Member wise total is invalid.");
          break;
        }
      }
      if (!isMemberWiseTotalValid) {
        return;
      }
    }
    setError(null);
    dispatch(
      updateSharedIbAgreement({
        id: agreement._id,
        title,
        totals,
        members,
      })
    );
  };


  return (
    <Modal isOpen={show} toggle={toggle} centered={true} scrollable={true} onClosed={() => {
      setSubmissionFailure(false);
      setError(null);
    }}>
      <ModalHeader toggle={toggle} tag="h4">
        {t("Edit Shared IB Agreement")}
      </ModalHeader>
      <ModalBody>
        {error && (
          <div
            style={{
              display: "block",
              color: "white",
              marginBottom: 10,
              padding: 10,
              borderRadius: 5,
              backgroundColor: "#f65854"
            }}
            className="formValidationErrMessage"
          >
            {error}
          </div>
        )}
        <AvForm
          validationEvent={["onChange", "onInput", "onBlur"]}
          onValidSubmit={(e, v) => {
            const { title, totals, members } = v;
            setSubmissionFailure(false);
            validateSharedAgreement({
              title,
              totals,
              members,
            });
          }}
          onInvalidSubmit={(e, v) => {
            setSubmissionFailure(true);
          }}
        >
          <AvField
            name={"title"}
            value={agreement.title}
            label={t("Agreement name")}
            className="mb-3"
            type="text"
            errorMessage={t("Required!")}
            validate={{ required: { value: true } }}
          />
          <Row className="justify-content-start">
            <Col md="3">{t("Type")}</Col>
            <Col>{t("Total Rebate")}</Col>
            <Col>{t("Total Commission")}</Col>
          </Row>
          {agreement.totals?.map((total, totalIdx) => (
            <Row key={total._id} className="my-1 align-items-center">
              <Col md="3">
                {getAccountTypeName(total.accountTypeId, accountTypes)}
              </Col>
              <Col>
                <AvField
                  name={`totals[${totalIdx}].accountTypeId`}
                  value={total.accountTypeId}
                  type="hidden"
                />
                <AvField
                  name={`totals[${totalIdx}].rebate`}
                  value={total.rebate}
                  bsSize="sm"
                  type="string"
                  errorMessage={t("Invalid value!")}
                  validate={{ required: { value: true } }}
                  onKeyPress={(e) => validatePositiveInputs(e)}
                />
              </Col>
              <Col>
                <AvField
                  className="mt-3"
                  name={`totals[${totalIdx}].commission`}
                  value={total.commission}
                  bsSize="sm"
                  type="string"
                  errorMessage={t("Invalid value!")}
                  validate={{ required: { value: true } }}
                  onKeyPress={(e) => validatePositiveInputs(e)}
                />
              </Col>
            </Row>
          ))}
          <hr className="my-3" />
          <Accordion className="mb-3" alwaysOpen>
            {agreement?.members
              ?.sort((a, b) => (a.level > b.level ? 1 : -1))
              .map((member, memberIdx) => (
                <Accordion.Item key={member._id} eventKey={memberIdx}>
                  <Accordion.Header>
                    {member.customerId.firstName} {member.customerId.lastName}
                  </Accordion.Header>
                  <Accordion.Body>
                    <Accordion className="my-1" alwaysOpen>
                      {member?.values?.map((val, valIdx) => (
                        <Accordion.Item key={val._id} eventKey={valIdx}>
                          <Accordion.Header>
                            <Row className="w-100 my-1 align-items-center my-0">
                              <Col md="3">
                                {getAccountTypeName(
                                  val.accountTypeId,
                                  accountTypes
                                )}
                              </Col>
                              <Col>
                                <AvField
                                  name={`members[${memberIdx}].values[${valIdx}].accountTypeId`}
                                  value={val.accountTypeId}
                                  type="hidden"
                                />
                                <AvField
                                  name={`members[${memberIdx}].level`}
                                  value={String(member.level)}
                                  type="hidden"
                                />
                                <AvField
                                  name={`members[${memberIdx}].customerId`}
                                  value={member.customerId._id}
                                  type="hidden"
                                />
                                <AvField
                                  name={`members[${memberIdx}].values[${valIdx}].rebate`}
                                  value={`${val.rebate}`}
                                  bsSize="sm"
                                  type="string"
                                  errorMessage={t("Invalid value!")}
                                  validate={{ required: { value: true } }}
                                  onChange={(e) => {
                                    const { value } = e.target;
                                    const newObj = {
                                      ...productsModel,
                                    };
                                    for (const key in productsModel) {
                                      if (
                                        key.includes(
                                          `members[${memberIdx}]#values[${valIdx}]#products#`
                                        ) && key.endsWith("#rebate")
                                      ) {
                                        newObj[key] = value;
                                      }
                                    }
                                    setProductsModel(newObj);
                                  }}
                                />
                              </Col>
                              <Col>
                                <AvField
                                  name={`members[${memberIdx}].values[${valIdx}].commission`}
                                  value={`${val.commission}`}
                                  bsSize="sm"
                                  type="string"
                                  errorMessage={t("Invalid value!")}
                                  validate={{ required: { value: true } }}
                                  onChange={(e) => {
                                    const { value } = e.target;
                                    const newObj = {
                                      ...productsModel,
                                    };
                                    for (const key in productsModel) {
                                      if (
                                        key.includes(
                                          `members[${memberIdx}]#values[${valIdx}]#products#`
                                        ) && key.endsWith("#commission")
                                      ) {
                                        newObj[key] = value;
                                      }
                                    }
                                    setProductsModel(newObj);
                                  }}
                                />
                              </Col>
                            </Row>
                          </Accordion.Header>
                          <Accordion.Body>
                            {products?.map((prod, prodIdx) => (
                              <Row
                                key={prodIdx}
                                className="my-1 align-items-center"
                              >
                                <Col md="3">{prod}</Col>
                                <Col>
                                  <AvField
                                    name={`members[${memberIdx}].values[${valIdx}].products.${prod}.rebate`}
                                    value={
                                      `${productsModel[
                                        `members[${memberIdx}]#values[${valIdx}]#products#${prod}#rebate`
                                      ]}`
                                    }
                                    bsSize="sm"
                                    type="string"
                                    errorMessage={t("Invalid value!")}
                                  />
                                </Col>
                                <Col>
                                  <AvField
                                    name={`members[${memberIdx}].values[${valIdx}].products.${prod}.commission`}
                                    value={
                                      `${(productsModel[
                                        `members[${memberIdx}]#values[${valIdx}]#products#${prod}#commission`
                                      ])}`
                                    }
                                    bsSize="sm"
                                    type="string"
                                    errorMessage={t("Invalid value!")}
                                  />
                                </Col>
                              </Row>
                            ))}
                            <Row>
                              <Col md="3">Markup</Col>
                              <Col>
                                <AvFieldSelect
                                  name={`members[${memberIdx}].values[${valIdx}].markup`}
                                  options={(markups || []).map((obj)=>{
                                    return ({
                                      label: `${obj}`, 
                                      value: obj
                                    });
                                  })} 
                                />
                              </Col>
                            </Row>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
          </Accordion>
          <Button type="submit" disabled={submitting}>
            {t("Submit")}
          </Button>
        </AvForm>
      </ModalBody>
    </Modal>
  );
};

export default EditSharedIbModal;
