import React, { useState, useEffect } from "react";
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
import Loader from "components/Common/Loader";

function UsersEditModal(props) {
  const { open, user = {}, onClose, usersRoles } = props;
  const [duplicatedEmail, setDuplicatedEmail] = useState(false);
  const { _id, title } = user.roleId || "";
  const dispatch = useDispatch();
  // console.log(usersRoles);
  const handleEditUser = (e, values) => {
    dispatch(editUser({
      id: user._id,
      values
    }));
  };

  const toggleEditModal = () => {
    onClose();
    setDuplicatedEmail(false);
  };

  const emailErrorStyle = duplicatedEmail ? "1px solid red" : "1px solid rgb(200, 200, 200)";

  const repeatedEmailCheck = (e) => {
    e.target?.value?.length > 0 &&
    setDuplicatedEmail(props.allUsersEmails?.includes(e.target.value?.trim()));
  };

  useEffect(() => {
    if (props.editClearingCounter > 0 && open ) {
      onClose();
      setDuplicatedEmail(false);
    }
  }, [props.editSuccess]);

  return (
    <React.Fragment >
      {/* <Link to="#" className="btn btn-light" onClick={onClose}><i className="bx bx-plus me-1"></i> Add New</Link> */}
      <Modal isOpen={open} toggle={toggleEditModal} centered={true}>
        <ModalHeader toggle={toggleEditModal} tag="h4">
          Edit User
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
                placeholder="Enter First Name"
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
                placeholder="Enter Last Name"
                type="text"
                errorMessage="Enter Last Name"
                value={user.lastName}
                validate={{ required: { value: true } }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="email"
                label="Email"
                placeholder="Enter Email"
                type="email"
                errorMessage="Enter Valid Email"
                onChange={repeatedEmailCheck}
                validate={{
                  required: { value: true },
                  email: { value: true },
                }}
                value={user.email}
                style = {{
                  border: `${emailErrorStyle}`
                }}
              />
              {duplicatedEmail && <span className="text-danger">Account already exists</span>}
            </div>
            <div className="mb-3">
              <label >Select Role </label>
              <AvField
                type="select"
                name="roleId"
                value={_id}
              >
                <option value={_id}>{title}</option>
                {usersRoles?.map((row) => {
                  // console.log("edit modal"); 
                  return (<option key={row._id} value={row._id}>{row.title}</option>);
                })}
                {/* <option value="hkkhj">select</option>
                <option>624ec3f8a32d3c13fcedcdb8</option>
                <option>3</option> */}
              </AvField>
            </div>
            <div className='text-center'>
              {
                props.editLoading
                  ?
                  <Loader />
                  :
                  <Button type="submit" color="primary" className="" disabled={props?.editLoading}>
                    Edit
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


const mapStateToProps = (state) => ({
  editLoading: state.usersReducer.editLoading,
  addLoading: state.usersReducer.addLoading,
  editResult: state.usersReducer.editResult,
  editError: state.usersReducer.editError,
  editSuccess: state.usersReducer.editSuccess,
  editClearingCounter: state.usersReducer.editClearingCounter,
  
});
export default connect(mapStateToProps, null)(UsersEditModal);
