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
function ActionsAdd(props){
  const [addModal, setAddModal] = useState(false);
  const dispatch = useDispatch();
  const toggleAddModal = ()=>{
    setAddModal(preValue => !preValue);
  };
  const { create } = props.dictionariesPermissions;
  useEffect(()=>{
    if (!props.showAddSuccessMessage && addModal){
      setAddModal(false);
    }
  }, [props.showAddSuccessMessage]);
  return (
    <React.Fragment >
      <Link to="#"  className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}><i className="bx bx-plus me-1"></i>{props.t("Add New Action")}</Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Action")}
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
                name="actions"
                label={props.t("Actions")}
                placeholder={props.t("Enter Action")}
                type="text"
                errorMessage={props.t("Enter valid action")}
                validate={{ required: { value: true } }}
              />
            </div>
              
            
            <div className='text-center pt-3 p-2'>
              <Button disabled = {props.disableAddButton} type="submit" color="primary" className="">
                {props.t("Add")}
              </Button>
            </div>
          </AvForm>
          {props.error && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.editError}
          </UncontrolledAlert>}
          
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state)=>({
  id :state.dictionaryReducer.id,
  error:state.dictionaryReducer.error,
  showAddSuccessMessage: state.dictionaryReducer.showAddSuccessMessage,
  dictionariesPermissions : state.Profile.dictionariesPermissions || {},
  disableAddButton : state.dictionaryReducer.disableAddButton
});
export default connect(mapStateToProps, null)(withTranslation()(ActionsAdd));