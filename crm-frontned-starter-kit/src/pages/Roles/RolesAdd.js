import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useDispatch, connect
} from "react-redux";
import {
  Modal, Button,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { addRole } from "store/roles/actions";
import Loader from "components/Common/Loader";

function RolesAdd (props) {
  const [addModal, setAddUserModal] = useState(false);
  const dispatch = useDispatch();
  const { create } = props.rolesPermissions;
  const toggleAddModal = () => {
    setAddUserModal(!addModal);
  };
  const rolesTitles = props.roles?.map((role) => (role.title?.toLowerCase()));
  const handleAddRole = (e, values) => {
    dispatch(addRole(values));
  };
  useEffect(()=>{
    if (props.clearingCounter > 0 && addModal) {
      setAddUserModal(false);
    }
  }, [props.clearingCounter]);

  const validateRoleTitle = (value, ctx, input, cb) => {
    if (rolesTitles?.includes(value?.toLowerCase()) || rolesTitles?.includes(value)){
      cb("This Role Already Exists");
    } else {
      cb(true);
    } 
  };

  return (
    <React.Fragment >
      <Link to="#"  className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}><i className="bx bx-plus me-1"></i> Add New Role</Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
            Add New Role
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleAddRole(e, v);
            }}
          >
            <div className="mb-3">
              <AvField
                name="title"
                label="Role Title"
                placeholder="Enter Role Title"
                type="text"
                errorMessage="Enter Role Title"
                validate={
                  { 
                    required: { value: true },
                    customer: validateRoleTitle 
                  }
                }
              />
            </div>
            <div className='text-center pt-3 p-2'>
              {
                props.addLoading 
                  ?
                  <Loader />
                  :
                  <Button disabled={props.addLoading} type="submit" color="primary" className="">
                    Add
                  </Button>
              }
            </div>
          </AvForm>
          {props.addError && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.addErrorDetails}
          </UncontrolledAlert>}
          {props.addSuccess && <UncontrolledAlert color="success">
            <i className="mdi mdi-check-all me-2"></i>
            Role Added successfully !!!
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}


const mapStateToProps = (state) => ({
  addLoading: state.rolesReducer.addLoading,
  addErrorDetails: state.rolesReducer.addErrorDetails,
  addSuccess: state.rolesReducer.addSuccess,
  addError: state.rolesReducer.addError,  
  clearingCounter: state.rolesReducer.clearingCounter,  
  rolesPermissions: state.Profile.rolesPermissions,
  roles: state.rolesReducer.docs
});
export default connect(mapStateToProps, null)(RolesAdd);