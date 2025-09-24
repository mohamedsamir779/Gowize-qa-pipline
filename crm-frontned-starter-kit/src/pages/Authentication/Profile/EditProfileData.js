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
import { editUser } from "store/users/actions";


function EditProfileData(props) {
  const { open, user = {}, onClose } = props;

  const dispatch = useDispatch();
  const handleEditUser = (e, values) => {
    dispatch(editUser({
      id: user._id,
      values
    }));
  };
  useEffect(() => {
    if (props.editClearingCounter > 0 && open) {
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  }, [props.editSuccess]);

  return (
    <React.Fragment >
      <Modal isOpen={open} toggle={onClose} centered={true}>
        <ModalHeader toggle={onClose} tag="h4">
          Update Profile
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleEditUser(e, v);
            }}
          >
            <div className="mb-3">
              <AvField
                name="firstName"
                label="Frist Name  "
                placeholder="Frist Name"
                type="text"
                errorMessage="Enter Frist Name"
                value={user.firstName}
                validate={{ required: { value: true } }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="lastName"
                label="Last Name  "
                placeholder="Last Name"
                type="text"
                errorMessage="Enter Last Name"
                value={user.lastName}
                validate={{ required: { value: true } }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="mobile"
                label="Mobile Number"
                placeholder="Mobile Number"
                type="number"
                errorMessage="Enter Valid Mobile Number"
                value={user.mobile || " "}
              // validate={{
              //   required: {
              //     // value: true,
              //     // number: true,
              //     // min: {value: 0},
              //     pattern: {value: "^[0-9]"},
              //   }
              // }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="phone"
                label="Phone Number"
                placeholder="Phone Number"
                type="number"
                errorMessage="Enter Valid Phone Number"
                value={user.phone || ""}
              // validate={{
              //   required: {
              //     // value: true,
              //     // number: true,
              //     // min: {value: 0},
              //     pattern: {value: "^[0-9]"},
              //   }
              // }}
              />
            </div>
            <div className='text-center p-5'>
              <Button type="submit" color="primary" className="">
                Update Profile
              </Button>
            </div>
          </AvForm>
          {props.editError && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.editError}
          </UncontrolledAlert>}
          {props.editResult && <UncontrolledAlert color="success">
            <i className="mdi mdi-check-all me-2"></i>
            Update Profile successfully !!!
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
export default connect(mapStateToProps, null)(EditProfileData);
