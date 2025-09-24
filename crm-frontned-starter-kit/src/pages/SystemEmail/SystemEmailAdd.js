import React, { useState, useEffect } from "react";
import {
  Link
} from "react-router-dom";
import { useDispatch, connect } from "react-redux";
import {
  Modal, Button, ModalHeader, ModalBody, UncontrolledAlert 
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

// i18n
import { withTranslation } from "react-i18next";
import {  addSystemEmail } from "store/systemEmail/actions";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import AvFieldSelect from "components/Common/AvFieldSelect";
import { capitalToReadable } from "common/utils/manipulateString";
import AvFieldTextTag from "components/Common/AvFieldTextTag";
import { EMAIL_FIELDS } from "common/data/dropdowns";

function SystemEmailAdd(props){
  const allSystemEmailsTitles = props.allSystemEmails.map((systemEmail) => (
    systemEmail.title
  ));
  const [duplicateTitle, setDuplicateTitle] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const dispatch = useDispatch();
  const { create } = props.systemEmailsPermissions;

  const repeatedTitleCheck = (e) => {
    e.target?.value?.length > 0 &&
    setDuplicateTitle(allSystemEmailsTitles.includes(e.target.value?.trim()));
  };

  const titleErrorStyle = duplicateTitle ? "1px solid red" : "1px solid rgb(181, 181, 181)";

  const handleAddSystemEmail = (e, values) => {
    dispatch(addSystemEmail(values));
  };
  const toggleAddModal = () => {
    setAddModal(!addModal);
    setDuplicateTitle(false);
  };
  useEffect(()=>{
    if (props.clearingCounter > 0 && addModal) {
      setAddModal(false);
      setDuplicateTitle(false);
    }
  }, [props.clearingCounter]);

  useEffect(() => {
    setDuplicateTitle(false);
    
  }, [props.allSystemEmails]);
  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}>
        <i className="bx bx-plus me-1"></i> {props.t("Add New Email")} 
      </Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add new system email")} 
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              if (!duplicateTitle){
                v.fields = v.fields && v.fields.map(obj => obj.value) || [];
                handleAddSystemEmail(e, v);
              }
            }}
          >
            <div className="mb-3">
              <AvField
                name="title"
                label={props.t("Title")}
                placeholder={props.t("Enter Title")}
                type="text"
                errorMessage={props.t("Enter Title")}
                validate={{ required: { value: true } }}
                onChange={repeatedTitleCheck}
                style={{
                  border: `${titleErrorStyle}`
                }}
              />
              {duplicateTitle && <span className="text-danger">This title is already in use</span>}
            </div>
            <div className="mb-3">
              <AvFieldSelect 
                name="action"
                label={props.t("Action")}
                placeholder={props.t("Please Select Action")}
                value=""
                type="text"
                errorMessage={props.t("Enter Action")}
                validate={{ required: { value: true } }}
                options={props.actions.filter(n => !props.actionsUsed.includes(n)).map((action)=>{
                  return ({
                    label: capitalToReadable(action),
                    value: action
                  });
                })}
              />
            </div>
            <div className="mb-3">
              <AvFieldTextTag
                name="fields"
                label={props.t("Fields")}
                value={[]}
                type="text"
                options={EMAIL_FIELDS}

              />
            </div>
            <div className='text-center pt-3 p-2'>
              <Button 
                disabled={props.addSuccess} 
                type="submit" 
                color="primary"
              >
                {props.t("Add")}
              </Button>
            </div>
          </AvForm>
          {props.addError && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {/* TODO this needs to be handled in translation */}
            {props.t(JSON.stringify(props.addErrorDetails))}
          </UncontrolledAlert>}
          
          {/* after adding new system email successfully it will 
              redirect the user to the edit page */}
          {props.systemEmail && props.clearingCounter > 0 && 
            <Redirect to={"/system-emails/" + props.systemEmail._id} />
          }
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  addLoading: state.systemEmailsReducer.addLoading,
  addErrorDetails: state.systemEmailsReducer.addErrorDetails,
  addSuccess: state.systemEmailsReducer.addSuccess,
  addError: state.systemEmailsReducer.addError,  
  clearingCounter: state.systemEmailsReducer.clearingCounter,
  activeComponentProp: state.systemEmailsReducer.activeComponentProp,
  systemEmail: state.systemEmailsReducer.systemEmail,
  systemEmailsPermissions: state.Profile.systemEmailsPermissions || {},
  actions :state.dictionaryReducer.actions || [],
  actionsUsed :state.systemEmailsReducer.actionsUsed || [],
});

export default connect(mapStateToProps, null)(withTranslation()(SystemEmailAdd));