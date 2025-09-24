import React, {
  memo,
  useEffect, useReducer, useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  Alert
} from "reactstrap";
import { Accordion } from "react-bootstrap";
import { AvField, AvForm } from "availity-reactstrap-validation";
import { fetchIbParents } from "store/client/actions";
import { createSharedIbAgreement } from "store/actions";
import validatePositiveInputs from "helpers/validatePositiveInputs";
import useDeepCompareEffect from "use-deep-compare-effect";
import AvFieldSelect from "components/Common/AvFieldSelect";

const AddSharedIbModal = ({
  show,
  toggle,
  accountTypes: allAccountTypes,
  products,
  clientId,
  markups,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [productsModel, setProductsModel] = useState({});
  const [submissionFailure, setSubmissionFailure] = useState(false);
  const [accountTypes, setAccountTypes] = useState([]);
  const [isAgreementValid, setIsAgreementValid] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const initState = { 
    title: "",
    totals: [],
    members: [],
  };
  
  const { parents } = useSelector(
    (state) => state.clientReducer?.clientDetails
  );

  // const calculateProducts = (products, product, type, value) => {
  //   if (product) {
  //     const newProducts = products;
  //     newProducts[product][type] = value;
  //     return newProducts;
  //   } else {
  //     // change for all
  //     const newProducts = products;
  //     Object.keys(newProducts).forEach((prod) => {
  //       newProducts[prod][type] = value;
  //     }
  //     );
  //     return newProducts;
  //   }
  // };

  const [payload, dispatcher] = useReducer((state, action) => {
    switch (action.type) {
      case "RESET":
        return initState;
      case "INIT": 
        return {
          ...action.payload,
        };
      case "UPDATE_TITLE":
        return {
          ...state,
          title: action.payload,
        };
      case "INIT_TOTALS":
        return {
          ...state,
          totals: action.payload,
        };
      case "UPDATE_TOTAL_REBATE":
        return {
          ...state,
          totals: state.totals.map((total) => {
            if (total.accountTypeId === action.payload.accountTypeId) {
              return {
                ...total,
                rebate: parseInt(action.payload.rebate),
              };
            }
            return total;
          }),
        };
      case "UPDATE_TOTAL_COMMISSION":
        return {
          ...state,
          totals: state.totals.map((total) => {
            if (total.accountTypeId === action.payload.accountTypeId) {
              return {
                ...total,
                commission: parseInt(action.payload.commission),
              };
            }
            return total;
          }),
        };
      case "INIT_MEMBERS": 
        return {
          ...state,
          members: action.payload,
        };
      case "UPDATE_MEMBER_REBATE_TOTAL":
        return {
          ...state,
          members: state.members.map((member) => {
            if (member.customerId === action.payload.customerId) {
              return {
                ...member,
                values: member.values.map((val) => {
                  if (val.accountTypeId === action.payload.accountTypeId) {
                    // update the products as well to this value
                    return {
                      ...val,
                      rebate: parseInt(action.payload.rebate),
                      // products: calculateProducts(
                      //   val?.products,
                      //   null,
                      //   "rebate",
                      //   parseInt(action.payload.rebate)
                      // ),
                    };
                  }
                  return val;
                }),
              };
            }
            return member;
          }),
        };
      case "UPDATE_MEMBER_COMMISSION_TOTAL":
        return {
          ...state,
          members: state.members.map((member) => {
            if (member.customerId === action.payload.customerId) {
              return {
                ...member,
                values: member.values.map((val) => {
                  if (val.accountTypeId === action.payload.accountTypeId) {
                    return {
                      ...val,
                      commission: parseInt(action.payload.commission),
                      // products: calculateProducts(
                      //   val?.products,
                      //   null,
                      //   "commission",
                      //   parseInt(action.payload.commission)
                      // ),
                    };
                  }
                  return val;
                }),
              };
            }
            return member;
          }),
        };
      case "UPDATE_MEMBER_REBATE_PRODUCT":
        return {
          ...state,
          members: state.members.map((member) => {
            if (member.customerId === action.payload.customerId) {
              return {
                ...member,
                values: member.values.map((val) => {
                  if (val.accountTypeId === action.payload.accountTypeId) {
                    return {
                      ...val,
                      // products: calculateProducts(
                      //   val?.products,
                      //   action.payload.product,
                      //   "rebate",
                      //   parseInt(action.payload.rebate)
                      // ),
                    };
                  }
                  return val;
                }),
              };
            }
            return member;
          }),
        };
      case "UPDATE_MEMBER_COMMISSION_PRODUCT":
        return {
          ...state,
          members: state.members.map((member) => {
            if (member.customerId === action.payload.customerId) {
              return {
                ...member,
                value: member.values.map((val) => {
                  if (val.accountTypeId === action.payload.accountTypeId) {
                    return {
                      ...val,
                      // products: calculateProducts(
                      //   val?.products,
                      //   action.payload.product,
                      //   "commission",
                      //   parseInt(action.payload.commission)
                      // ),
                    };
                  }
                  return val;
                }),
              };
            }
            return member;
          }),
        };
      default: 
        return state;
    }
  }, initState);
  

  useEffect(() => {
    if (products) {
      const model = {};
      products.forEach((product) => {
        model[product] = {
          commission: null,
          rebate: null,
        };
      });
      setProductsModel(model);
    }
  }, [products]);

  useEffect(() => {
    if (accountTypes?.length > 0) {
      const totals = [];
      accountTypes.forEach((acc) => {
        totals.push({
          accountTypeId: acc?._id,
          rebate: null,
          commission: null,
        });
      });
      dispatcher({
        type: "INIT_TOTALS",
        payload: totals,
      });
    }
  }, [accountTypes]);

  useEffect(() => {
    if (parents?.length > 0) {
      const members = [];
      parents?.[0].forEach((parent) => {
        members.push({
          customerId: parent?._id,
          level: parent?.level,
          values: accountTypes?.map((acc) => ({
            accountTypeId: acc?._id,
            rebate: null,
            commission: null,
            products: {
              ...productsModel,
            }
          })),
        });
      });
      dispatcher({
        type: "INIT_MEMBERS",
        payload: members,
      });
    }
  }, [parents, accountTypes, productsModel]);


  useEffect(() => {
    clientId && dispatch(fetchIbParents({ clientId }));
  }, [clientId]);

  const { submitting } = useSelector((state) => state.ibAgreements);

  useEffect(() => {

    !submitting && show && setIsAgreementValid(false) && toggle();
  }, [submitting]);

  useEffect(() => {
    setSubmissionFailure(false);
  }, []);

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
      setAccountTypes(Array.from(accountTypes));
    }
  }, [allAccountTypes, show]);
  

  useEffect(() => {
    return () => {
      setIsAgreementValid(false);
      dispatcher({
        type: "RESET",
      });
    };
  }, []);

  const {
    title, totals, members
  } = payload;

  const validateForm = () => {
    if (!title) {
      setIsAgreementValid(false);
      setValidationErrorMessage("Please Enter Agreement Title");
      return false;
    }
    if (totals?.length > 0) {
      // Check for null fields first
      let isValid = true;
      totals.forEach((total) => {
        if (total?.commission === null || total?.rebate === null) {
          isValid = false;
        }
      });
      if (!isValid) {
        setIsAgreementValid(false);
        setValidationErrorMessage("Please Enter Commission and Rebate");
        return false;
      }
    }
    let isMemberValuesValid = true;
    let isSumValid = true;
    let totalsSum = new Map();
    if (members?.length > 0 && totals?.length > 0) {
      // 1st validation is null
      // 2nd validation is sum of members rebate and commission should be less than or equal to totals
      // 3rd validation should be for each members.value's rebate and commission should not be null and the products rebate and commission should not be null and the sum of products rebate and commission should be less than or equal to members rebate and commission
      for (let i = 0;i < totals.length;i++) {
        totalsSum.set(totals[i].accountTypeId, {
          commission: totals[i].commission,
          rebate: totals[i].rebate,
        });
      }
      for (let i = 0;i < members.length;i++) {
        const member = members[i];
        for (let j = 0; j < member.values.length; j++) {
          const value = member.values[j];
          if (value?.rebate === null || value?.commission === null) {
            isMemberValuesValid = false;
            break;
          } else {
            const total = totalsSum.get(value.accountTypeId);
            // subtract the member values from totals if total becomes less than 0 then it is invalid
            if (total) {
              const newTotal = {
                commission: total.commission - value.commission,
                rebate: total.rebate - value.rebate,
              };
              if (newTotal.commission < 0 || newTotal.rebate < 0) {
                isSumValid = false;
                break;
              } else {
                totalsSum.set(value.accountTypeId, newTotal);
              }
            }
          }
        }
        if (!isMemberValuesValid) {
          setIsAgreementValid(false);
          setValidationErrorMessage("Please Enter Commission and Rebate for each member");
          break;
        }
        if (!isSumValid) {
          setIsAgreementValid(false);
          setValidationErrorMessage("Sum of Commission and Rebate for each member should be less than or equal to totals");
          break;
        }
      }

    }
    isMemberValuesValid && isSumValid && setIsAgreementValid(true) & setValidationErrorMessage("");
    return true;
  };

  useEffect(() => {
    validateForm();
  }, [title, totals, members]);

  return (
    <Modal
      isOpen={show}
      toggle={() => {
        dispatcher({
          type: "RESET",
        });
        toggle();
      }}
      centered={true}
      scrollable={true}
      onClosed={() => {
        setSubmissionFailure(false);
      }}
    >
      <ModalHeader toggle={()=>{
        dispatcher({
          type: "RESET",
        });
        toggle();
      }} tag="h4">
        {t("New Shared IB Agreement")}
      </ModalHeader>
      <ModalBody>
        {submissionFailure ? (
          <div
            style={{
              display: "block",
              color: "white",
              marginBottom: 10,
              padding: 10,
              borderRadius: 5,
              backgroundColor: "#f65854",
            }}
            className="formValidationErrMessage"
          >
            {"Invalid values found. Please check the form again!"}
          </div>
        ) : null}
        <AvForm
          validationEvent={["onChange", "onInput", "onBlur"]}
          onValidSubmit={(e, v) => {
            console.log(v, "value");
            setSubmissionFailure(false);
            dispatch(
              createSharedIbAgreement(v)
            );
          }}
        >
          <AvField
            name={"title"}
            label={t("Agreement name")}
            className="mb-3"
            type="text"
            value={title}
            errorMessage={t("Required!")}
            validate={{ required: { value: true } }}
            onChange={(e) => {
              dispatcher({
                type: "UPDATE_TITLE",
                payload: e.target.value,
              });
            }}
          />
          <Row className="justify-content-start">
            <Col md="3">{t("Type")}</Col>
            <Col>{t("Total Rebate")}</Col>
            <Col>{t("Total Comission")}</Col>
          </Row>
          {totals?.map((type, accIdx) => (
            <Row key={type._id} className="my-1 align-items-center">
              <Col md="3">
                {allAccountTypes && allAccountTypes.find((acc) => acc._id === type.accountTypeId)?.title}
                <AvField
                  name={`totals[${accIdx}].accountTypeId`}
                  value={type.accountTypeId}
                  type="hidden"
                />
              </Col>
              <Col>
                <AvField
                  name={`totals[${accIdx}].rebate`}
                  value={accIdx.rebate}
                  bsSize="sm"
                  type="number"
                  errorMessage={t("Invalid Rebate value!")}
                  validate={{
                    required: { value: true },
                    min: { value: 0 },
                  }}
                  onChange={(e) => {
                    dispatcher({
                      type: "UPDATE_TOTAL_REBATE",
                      payload: {
                        accountTypeId: type.accountTypeId,
                        rebate: e.target.value,
                      },
                    });
                  }}
                />
              </Col>
              <Col>
                <AvField
                  className="mt-3"
                  name={`totals[${accIdx}].commission`}
                  bsSize="sm"
                  type="number"
                  value={accIdx.commission}
                  errorMessage={t("Invalid  Commission value!")}
                  validate={{
                    required: { value: true },
                    min: { value: 0 },
                  }}
                  onChange={(e) => {
                    dispatcher({
                      type: "UPDATE_TOTAL_COMMISSION",
                      payload: {
                        accountTypeId: type.accountTypeId,
                        commission: e.target.value,
                      },
                    });
                  }}
                />
              </Col>
            </Row>
          ))}
          <hr className="my-3" />
          <Accordion className="mb-3" alwaysOpen>
            {members &&
              members
                .sort((a, b) => (a.level > b.level ? 1 : -1))
                .map((member, memberIdx) => {
                  const customer = parents?.[0]?.find((p) => p._id === member.customerId);
                  return <>
                    <Accordion.Item key={member.customerId} eventKey={memberIdx}>
                      <Accordion.Header>
                        {customer?.firstName} {customer?.lastName}
                      </Accordion.Header>
                      <Accordion.Body>
                        <Accordion className="my-1" alwaysOpen>
                          {member && member?.values?.map((type, accIdx) => (
                            <Accordion.Item key={type.accountTypeId} eventKey={accIdx}>
                              <Accordion.Header>
                                <Row className="w-100 my-1 align-items-center my-0">
                                  <Col md="3">
                                    {allAccountTypes && allAccountTypes.find((acc) => acc._id === type.accountTypeId)?.title}
                                    <AvField
                                      name={`members[${memberIdx}].values[${accIdx}].accountTypeId`}
                                      value={type.accountTypeId}
                                      type="hidden"
                                    />
                                    <AvField
                                      name={`members[${memberIdx}].level`}
                                      value={String(member.level)}
                                      type="hidden"
                                    />
                                    <AvField
                                      name={`members[${memberIdx}].customerId`}
                                      value={member.customerId}
                                      type="hidden"
                                    />
                                  </Col>
                                  <Col>
                                    <AvField
                                      name={`members[${memberIdx}].values[${accIdx}].rebate`}
                                      bsSize="sm"
                                      type="number"
                                      errorMessage={t("Invalid value!")}
                                      validate={{
                                        required: { value: true },
                                        min: {
                                          value: 0,
                                          errorMessage: "Minimum is 0"
                                        }
                                      }}
                                      onKeyPress={(e) =>
                                        validatePositiveInputs(e)
                                      }
                                      onChange={(e) => {
                                        dispatcher({
                                          type: "UPDATE_MEMBER_REBATE_TOTAL",
                                          payload: {
                                            accountTypeId: type.accountTypeId,
                                            rebate: parseInt(e.target.value),
                                            customerId: member.customerId,
                                          },
                                        });
                                      }}
                                    />
                                  </Col>
                                  <Col>
                                    <AvField
                                      name={`members[${memberIdx}].values[${accIdx}].commission`}
                                      bsSize="sm"
                                      type="number"
                                      errorMessage={t("Invalid value!")}
                                      validate={{
                                        required: { value: true },
                                        min: {
                                          value: 0,
                                          errorMessage: "Minimum is 0"
                                        }
                                      }}
                                      onKeyPress={(e) =>
                                        validatePositiveInputs(e)
                                      }
                                      onChange={(e) => {
                                        dispatcher({
                                          type: "UPDATE_MEMBER_COMMISSION_TOTAL",
                                          payload: {
                                            accountTypeId: type.accountTypeId,
                                            commission: parseInt(e.target.value),
                                            customerId: member.customerId,
                                          },
                                        });
                                      }}
                                    />
                                  </Col>
                                </Row>
                              </Accordion.Header>
                              <Accordion.Body>
                                {Object.keys(type?.products ?? {})?.map((prod, prodIdx) => (
                                  <Row
                                    key={prodIdx}
                                    className="my-1 align-items-center"
                                  > 
                                    <Col md="3">{
                                      products.find((p) => p?.toLowerCase() === prod?.toLowerCase())
                                    }</Col>
                                    <Col>
                                      <AvField
                                        name={`members[${memberIdx}].values[${accIdx}].products.${prod}.rebate`}
                                        bsSize="sm"
                                        type="number"
                                        validate={{
                                          required: { value: true },
                                          min: {
                                            value: 0,
                                            errorMessage: "Minimum is 0"
                                          }
                                        }}
                                        errorMessage={t("Invalid Product Rebate value!")}
                                        value={type?.rebate}
                                        onKeyPress={(e) =>
                                          validatePositiveInputs(e)
                                        }
                                        onChange={(e) => {
                                          dispatcher({
                                            type: "UPDATE_MEMBER_REBATE_PRODUCT",
                                            payload: {
                                              accountTypeId: type.accountTypeId,
                                              rebate: parseInt(e.target.value),
                                              customerId: member.customerId,
                                              product: prod,
                                            },
                                          });
                                        }}
                                      />
                                    </Col>
                                    <Col>
                                      <AvField
                                        name={`members[${memberIdx}].values[${accIdx}].products.${prod}.commission`}
                                        bsSize="sm"
                                        type="number"
                                        errorMessage={t("Invalid Product Commission value!")}
                                        value={type?.commission}
                                        onKeyPress={(e) =>
                                          validatePositiveInputs(e)
                                        }
                                        validate={{
                                          required: { value: true },
                                          min: {
                                            value: 0,
                                            errorMessage: "Minimum is 0"
                                          }
                                        }}
                                        onChange={(e) => {
                                          dispatcher({
                                            type: "UPDATE_MEMBER_COMMISSION_PRODUCT",
                                            payload: {
                                              accountTypeId: type.accountTypeId,
                                              commission: parseInt(e.target.value),
                                              customerId: member.customerId,
                                              product: prod,
                                            },
                                          });
                                        }}
                                      />
                                    </Col>
                                  </Row>
                                ))}
                                <Row>
                                  <Col md="3">Markup</Col>
                                  <Col>
                                    <AvFieldSelect
                                      name={`members[${memberIdx}].values[${accIdx}].markup`}
                                      options={(markups || []).map((obj) => {
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
                  </>;
                })}
          </Accordion>
          {
            !isAgreementValid && validationErrorMessage && <Alert color="danger">{validationErrorMessage}</Alert>
          }
          {
            submitting ? <Spinner size="sm" color="primary" /> :
              <Button type="submit" disabled={submitting || !isAgreementValid}>
                {t("Submit")}
              </Button>
          }
        </AvForm>
      </ModalBody>
    </Modal>
  );
};

export default memo(AddSharedIbModal);
