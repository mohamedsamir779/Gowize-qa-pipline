import { useDispatch, connect } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { addNewItem } from "store/dictionary/actions";

function CallStatusAdd(props) {
  const [addModal, setAddModal] = useState(false);
  const dispatch = useDispatch();
  const { create } = props.dictionariesPermissions;
  const toggleAddModal = () => {
    setAddModal(preValue => !preValue);
  };
  useEffect(() => {
    if (!props.showAddSuccessMessage && addModal) {
      setAddModal(false);
    }
  }, [props.showAddSuccessMessage]);
  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}><i className="bx bx-plus me-1"></i>{props.t("Add New Call Status")}</Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          Add New Call Status
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              e.preventDefault();
              dispatch(addNewItem(props.id, v));
            }}
          >
            <div className="mb-3">
              <AvField
                name="callStatus"
                label={props.t("Call Status")}
                placeholder={props.t("Enter Call Status")}
                type="text"
                validate={{ required: { value: true } }}
              />
              <AvField
                type="color"
                name="color"
                label={props.t("Color")}
                validate={{ required: { value: true } }}
              />
            </div>
            <div className='text-center pt-3 p-2'>
              <Button disabled={props.disableAddButton} type="submit" color="primary">
                {props.t("Add")}
              </Button>
            </div>
          </AvForm>
          {props.error && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.t(props.error)}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  dictionary: state.dictionaryReducer.dictionary || [],
  error: state.dictionaryReducer.error,
  id: state.dictionaryReducer.id,
  showAddSuccessMessage: state.dictionaryReducer.showAddSuccessMessage,
  dictionariesPermissions: state.Profile.dictionariesPermissions || {},
  disableAddButton: state.dictionaryReducer.disableAddButton
});
export default connect(mapStateToProps, null)(withTranslation()(CallStatusAdd));