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
function CountriesAdd(props){
  const [addModal, setAddModal] = useState(false);
  const dispatch = useDispatch();
  const { create } = props.dictionariesPermissions;
  const toggleAddModal = ()=>{
    setAddModal(preValue => !preValue);
  };
  useEffect(()=>{
    if (!props.showAddSuccessMessage && addModal){
      setAddModal(false);
    }
  }, [props.showAddSuccessMessage]);
  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}><i className="bx bx-plus me-1"></i>{props.t("Add New Country")}</Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Country")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              e.preventDefault();
              
              dispatch(addNewItem(props.id, { countries: { ...v } }));
            }}
          >
            
            
            <div className="mb-3">
              <AvField
                name="alpha2"
                label={props.t("Alpha2")}
                placeholder={props.t("Enter Alpha2")}
                type="text"
                errorMessage={props.t("Enter valid alpha2")}
                validate={{ 
                  required: { value: true },
                  pattern:{
                    value:"/^[a-z]{2}$/",
                    errorMessage: "Aplha2 should be 2 characters only"
                  }
                }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="alpha3"
                label={props.t("Alpha3")}
                placeholder={props.t("Enter Alpha3")}
                type="text"
                validate={{
                  required: { value: true }, 
                  pattern:{
                    value : "/^[a-z]{3}$/",
                    errorMessage:"Alpha3 should be 3 characters only"
                  }
                }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="callingCode"
                label={props.t("Calling Code")}
                placeholder={props.t("Enter Calling Code")}
                type="text"
                errorMessage={props.t("Enter valid calling code")}
                onKeyPress={(e) => {
                  if (!isNaN(e.key) && e.target.value.length > 0){
                    return true;
                  }
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                validate={{
                  required: { value: true },
                }}
              
              />
            </div>
            <div className="mb-3">
              <AvField
                name="ar"
                label={props.t("AR")}
                placeholder={props.t("Enter the Arabic Country name")}
                type="text"
                validate={{ 
                  required: { value: true },
                  pattern : {
                    value :"/^[\u0621-\u064A]+$/",
                    errorMessage : "This field should be all in arabic letters"
                  }
                }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="en"
                label={props.t("EN")}
                placeholder={props.t("Enter the English Country name")}
                type="text"
                validate={{ 
                  required: { value: true },
                  pattern : {
                    value: "/^[A-Za-z]+$/",
                    errorMessage : "This field should be all in english letters"
                  }
              
                }}
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
            {props.t(props.editError)}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
const mapStateToProps = (state)=>({
  loading: state.dictionaryReducer.loading || false,
  dictionary: state.dictionaryReducer.dictionary || [],
  error : state.dictionaryReducer.error,
  id :state.dictionaryReducer.id,
  showAddSuccessMessage:state.dictionaryReducer.showAddSuccessMessage,
  dictionariesPermissions :state.Profile.dictionariesPermissions || {},
  disableAddButton: state.dictionaryReducer.disableAddButton
});
export default connect(mapStateToProps, null)(withTranslation()(CountriesAdd));