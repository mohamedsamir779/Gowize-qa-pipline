import React, { useState, useEffect } from "react";
import {
  useDispatch, connect
} from "react-redux";
import {
  Row, Col,
  Modal, Button,
  ModalHeader,
  ModalBody,
  Collapse,
  UncontrolledAlert,
} from "reactstrap";
import {
  AvForm, AvField, AvInput,
} from "availity-reactstrap-validation";
import { withTranslation } from "react-i18next";
import { editMarkupStart } from "store/markups/actions";
import classnames from "classnames";

function MarkupEdit(props) {
  const { open, markup = {}, onClose } = props;
  // console.log(markup);

  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    const markestsArrayOfObj = Object.entries(markup?.markets || {}).map((e) => ({ [e[0]]: e[1] }));
    setMarkets(markestsArrayOfObj);
    // console.log(markestsArrayOfObj);
  }, [open]);
  const [col1, setcol1] = useState(false);

  const dispatch = useDispatch();

  // const handleMarkupUpdate = (e, values) => {
  //   e.preventDefault();
  //   dispatch(editMarkupStart({
  //     id: markup._id,
  //     values
  //   }));
  // };
  const handleMarkupUpdate = (event, values) => {
    // console.log(values);
    event.preventDefault();
    const { isPercentage, title, value } = values;
    let marketsObject = {};
    let val = {};
    markets?.forEach((market, i) => { 
      marketsObject = {
        ...marketsObject,
        [`${Object.keys(market)[0]}`]: {
          value: values[`value${i}`],
        } 
      };
    });
    val = {
      isPercentage,
      title,
      markets: { ...marketsObject },
      value
    }; 
    dispatch(editMarkupStart({
      id: markup._id,
      values: val
    }));
  };


  useEffect(() => {
    if (props.editClear) {
      onClose();
      setcol1(false);
    }
  }, [props.editClear]);
  const t_col1 = () => {
    setcol1(!col1);
  };
  return (
    <React.Fragment >
      {/* <Link to="#" className="btn btn-light" onClick={onClose}><i className="bx bx-plus me-1"></i> Add New</Link> */}
      <Modal  isOpen={open} toggle={onClose} centered={true}>
        <ModalHeader toggle={onClose} tag="h4">
          {props.t("Edit Markup")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleMarkupUpdate(e, v);
            }}
          >
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="title"
                    label={props.t("Title")}
                    placeholder={props.t("Title")}
                    type="text"
                    errorMessage={props.t("Enter title of the markup")}
                    value={markup.title}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="value"
                    label={props.t("Value")}
                    placeholder={props.t("Value")}
                    type="text"
                    errorMessage={props.t("Enter Value")}
                    value={markup.value?.$numberDecimal}
                    // markup.value && markup.value["$numberDecimal"] ? markup.value["$numberDecimal"] : ""}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <AvInput type="checkbox" name="isPercentage" value={markup.isPercentage} /> is it precentage?
              </Col>
              <br />
              <br />
            </Row>
            <Row>
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
                        {markets?.map((market, index) => {
                          let [key, value] = Object.entries(market)[0]; 
                          return (
                            <div key={index}>
                              <Row>
                                <Col className="d-flex flex-column justify-content-end"><h5 className="text-center"> {key}</h5></Col>
                                <Col >
                                  <AvField
                                    name={`value${index}`}
                                    label={props.t("Value")}
                                    value={value?.value}
                                    placeholder={props.t("Value")}
                                    type="number"
                                  />
                                </Col>
                              </Row>
                              <br />
                              <br />
                            </div>
                          );
                        } 
                        )}
                      </div>
                    </Collapse>
                  </div>
                </div>
              </Col>
            </Row>
            <div className='text-center pt-3 p-2'>
              <Button disabled={props.addLoading} type="submit" color="primary" className="">
                {props.t("Update Markup")}
              </Button>
            </div>
          </AvForm>
          {props.error && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.t(props.error)}
          </UncontrolledAlert>}
          {props.editDone && <UncontrolledAlert color="success">
            <i className="mdi mdi-check-all me-2"></i>
            {props.t("Markup Updated successfully !!!")}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}


const mapStateToProps = (state) => ({
  editLoading: state.markupsReducer.editLoading,
  editDone: state.markupsReducer.editDone,
  editClear: state.markupsReducer.editClear,
  error: state.markupsReducer.error
});
export default connect(mapStateToProps, null)(withTranslation()(MarkupEdit));
