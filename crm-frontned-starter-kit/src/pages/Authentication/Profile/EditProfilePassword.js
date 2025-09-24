import React, { useEffect } from "react";
import {
  useDispatch, connect
} from "react-redux";
import {
  Modal, Button,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
} from "reactstrap";
import {
  AvForm, AvField
} from "availity-reactstrap-validation";
import { editUserPass } from "store/users/actions";


function UsersEditModal(props) {
  const { openPass, userPass = {}, onClosePass } = props;

  const dispatch = useDispatch();
  const handleEditPassword = (e, values) => {
    dispatch(editUserPass({
      id: userPass._id,
      values
    }));
  };
  useEffect(() => {
    if (props.editClearingCounter > 0 && openPass) {
      setTimeout(() => {
        onClosePass();
      }, 1000);
    }
  }, [props.editSuccess]);

  return (
    <React.Fragment >
      {/* <Link to="#" className="btn btn-light" onClick={onClose}><i className="bx bx-plus me-1"></i> Add New</Link> */}
      <Modal isOpen={openPass} toggle={onClosePass} centered={true}>
        <ModalHeader toggle={onClosePass} tag="h4">
          Update Password
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleEditPassword(e, v);
            }}
          >
            <div className="mb-3">
              <AvField
                name="oldPassword"
                label="Current Password"
                placeholder="Current Password"
                type="password"
                errorMessage="Enter Current Password"
                validate={{ required: { value: true } }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="newPassword"
                label="New Password"
                type="password"
                placeholder="Password"
                errorMessage="Enter New password"
                validate={{ required: { value: true } }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="cnfPassword"
                label="Confirm Password"
                type="password"
                placeholder="Re-type Password"
                errorMessage="Password Not Match"
                validate={{
                  required: { value: true },
                  match: { value: "newPassword" },
                }}
              />
            </div>
            <div className='text-center p-5'>
              <Button type="submit" color="primary" className="">
                Update Password
              </Button>
            </div>
          </AvForm>
          {props.editError && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.editError}
          </UncontrolledAlert>}
          {props.editResult && <UncontrolledAlert color="success">
            <i className="mdi mdi-check-all me-2"></i>
            Update Pasword successfully !!!
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}


const mapStateToProps = (state) => ({
  addLoading: state.usersReducer.addLoading,
  editResult: state.usersReducer.editResult,
  editError: state.usersReducer.editError,
  editSuccess: state.usersReducer.editSuccess,
  editClearingCounter: state.usersReducer.editClearingCounter,
});
export default connect(mapStateToProps, null)(UsersEditModal);
