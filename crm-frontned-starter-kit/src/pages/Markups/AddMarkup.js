import React, { useState, useEffect } from "react";
import {
  useDispatch, connect
} from "react-redux";
import {
  Row, Col,
  Modal, Button,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Collapse,
  Label,
} from "reactstrap";
import {
  AvForm, AvField, AvInput, AvGroup
} from "availity-reactstrap-validation";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { addMarkupStart } from "../../store/markups/actions";
import classnames from "classnames";
import { fetchMarketsStart } from "store/markets/actions";

function AddMarkup(props) {

  const [addModal, setAddMarkupModal] = useState(false);
  const [isPercentage, setIsPercentage] = useState(false);
  const [col1, setcol1] = useState(false);
  const [value, setValue] = useState(0); 
  const dispatch = useDispatch();
  const { create } = props.markupsPermissions;
  const toggleAddModal = () => {
    setAddMarkupModal(!addModal);
  };
  const handleAddMarkup = (event, values) => {

    event.preventDefault();
    const { isPercentage, title, value } = values;
    let marketsObject;
    props.markets?.forEach((market, i) => {
      marketsObject = {
        ...marketsObject,
        [`${market.pairName}`]: {
          value: values[`value${i}`],
        }

      };
    });
    dispatch(addMarkupStart({
      isPercentage,
      title,
      markets: { ...marketsObject },
      value
    }));
    setValue(0);
    setcol1(false);
  };
  useEffect(() => {
    if (addModal) {
      loadMarkets(1, 100);
    }
  }, [addModal]);

  const loadMarkets = (page, limit) => {
    dispatch(fetchMarketsStart({
      limit,
      page
    }));
  };

  const t_col1 = () => {
    setcol1(!col1);
  };
  useEffect(() => {
    if (!props.addMarkupSuccessMessage && addModal) {
      setAddMarkupModal(false);
    }
  }, [props.addMarkupSuccessMessage]);

  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}><i className="bx bx-plus me-1"></i>{props.t("Add New Markup")}</Link>
      <Modal  
        isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add Markup")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleAddMarkup(e, v);
            }}
          >
            <Row>
              <Row>
                <Col  >
                  <AvField
                    name="title"
                    label={props.t("Title")}
                    placeholder={props.t("Title")}
                    type="text"
                    errorMessage={props.t("Enter Valid title")}
                    validate={{ required: { value: true } }}
                  />
                </Col>
              </Row>

              <Col>
                <br />
                <div className="mb-3">
                  <AvGroup check>
                    <AvInput type="checkbox" name="isPercentage" onClick={() => setIsPercentage(preValue => !preValue)} value={isPercentage ? "true" : "false"} />
                    <Label check for="checkItOut">Is Percentage</Label>
                  </AvGroup>
                </div>
              </Col>
              {/* </Row> */}

              <Row>


                <Col md="2" className="d-flex flex-column justify-content-end"><h6 className="text-center">Defaults:</h6></Col>
                <Col >
                  <AvField
                    name="value"
                    label={props.t("Value")}
                    placeholder={props.t("value")}
                    type="number"
                    errorMessage={props.t("Enter valid fees group value")}
                    validate={{ required: { value: true } }}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </Col>
              </Row>
            </Row>
            <br />
            <br />
            <Col >
              <div className="accordion" id="accordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className={classnames(
                        "accordion-button",
                        "fw-medium",
                        { collapsed: !col1 }
                      )}
                      type="button"
                      onClick={t_col1}
                      style={{ cursor: "pointer" }}
                    >
                      Markets
                    </button>
                  </h2>

                  <Collapse isOpen={col1} className="accordion-collapse">
                    <div className="accordion-body">
                      {props.markets?.map((market, index) =>
                        <div key={index}>
                          <Row>
                            <Col className="d-flex flex-column justify-content-end"><h5 className="text-center"> {market.pairName}</h5></Col>
                            <Col >
                              <AvField
                                name={`value${index}`}
                                label={props.t("Value")}
                                value={value}
                                placeholder={props.t("Value")}
                                type="number"
                              />
                            </Col>

                          </Row>
                          <br />
                          <br />
                        </div>
                      )}
                    </div>
                  </Collapse>
                </div>
              </div>
            </Col>
            <div className='text-center pt-3 p-2'>
              <Button disabled={props.addButtonDisabled} type="submit" color="primary" className="">
                {props.t("Add Markup")}
              </Button>
            </div>
          </AvForm>
          {
            props.error && (
              <UncontrolledAlert color="danger">
                <i className="mdi mdi-block-helper me-2" />
                {props.t(props.error)}
              </UncontrolledAlert>
            )
          }
          {
            props.addMarkupSuccessMessage && (
              <UncontrolledAlert color="success">
                <i className="mdi mdi-check-all me-2" />
                {props.t("Transaction New Fees Group is added successfully !!!")}
              </UncontrolledAlert>
            )
          }
        </ModalBody>
      </Modal>
    </React.Fragment>);
}
const mapStateToProps = (state) => ({
  error: state.markupsReducer.error,
  addMarkupSuccessMessage: state.markupsReducer.addMarkupSuccessMessage,
  markupsPermissions: state.Profile.markupsPermissions || {},
  markets: state.marketsReducer.markets || []
});
export default connect(mapStateToProps, null)(withTranslation()(AddMarkup));
