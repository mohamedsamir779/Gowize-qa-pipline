import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Button,
} from "reactstrap";
import {
  AvForm, AvField
} from "availity-reactstrap-validation";
import TableLoader from "components/Common/Loader";
import { useDispatch } from "react-redux";
import { showErrorNotification, showSuccessNotification } from "store/actions";
import { resetUserPass } from "apis/users";

function EditUserPassword(props) {
  const [loading, setLoading] = useState(false);
  const {
    open, toggle, user 
  } = props;
  const dispatch = useDispatch();

  const handleEditUser = (e, v) => {
    if (v.password !== v.confirm) {
      dispatch(showErrorNotification("Passwords do not match!"));
      return;
    }
    setLoading(true);
    resetUserPass({
      payload: {
        id: user?._id,
        values: v
      }
    }).then(res => {
      dispatch(showSuccessNotification("Password changed successfully!"));
    }).catch(err => {
      console.log(err);
      dispatch(showErrorNotification("Unable to change password"));
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <React.Fragment >
      <Modal isOpen={open} toggle={toggle} centered={true}>
        <ModalHeader toggle={toggle} tag="h4">
          Change Password
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
                name="password"
                label="Password "
                placeholder="Enter Password"
                type="password"
                errorMessage="Enter Password"
                validate={{ required: { value: true } }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="confirm"
                label="Confirm "
                placeholder="Confirm Password"
                type="password"
                validate={{
                  required: { value: true },
                  match: { value: "password" },
                }}
              />
            </div>
            <div className='text-center'>
              {
                loading
                  ? <TableLoader />
                  : <Button type="submit" color="primary">
                    Change
                  </Button>
              }
            </div>
          </AvForm>
          {props.editError && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.editError}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}
export default (EditUserPassword);
