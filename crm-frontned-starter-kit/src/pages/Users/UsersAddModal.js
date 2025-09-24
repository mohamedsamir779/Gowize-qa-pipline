import React, { 
  useState,
  useEffect,
  useCallback,
} from "react";
import { debounce } from "lodash";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  useDispatch, connect
} from "react-redux";
import {
  Modal, Button,
  ModalHeader,
  Label,
  ModalBody,
  UncontrolledAlert,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { addUser } from "store/users/actions";
// import { sassFalse } from "sass";
import { checkUserEmailApi } from "apis/users";
import { emailCheck } from "common/utils/emailCheck";
import Loader from "components/Common/Loader";

function UsersAddModal(props) {
  const [addModal, setAddUserModal] = useState(false);
  const [submitState, setSubmitState] = useState(false);
  const dispatch = useDispatch();
  const { usersRoles } = props;
  const { create } = props.userPermissions;
  const toggleAddModal = () => {
    setAddUserModal(!addModal);
  };
  const handleAddUser = (e, values) => {
    setSubmitState(true);
    dispatch(addUser(values));
    setTimeout(() => {
      setSubmitState(false);
    }, 2500);

  };

  useEffect(() => {
    if (props.clearingCounter > 0 && addModal) {
      setAddUserModal(false);
    }
  }, [props.addSuccess]);

  const debouncedChangeHandler = useCallback(
    debounce((value, ctx, input, cb) => 
      emailCheck(value, ctx, input, cb, checkUserEmailApi), 1000
    ), []
  );

  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}><i className="bx bx-plus me-1"></i> Add New User</Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New User")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleAddUser(e, v);
            }}
          >
            <div className="mb-3">
              <AvField
                name="firstName"
                label={props.t("First Name")}
                placeholder={props.t("Enter First Name")}
                type="text"
                errorMessage={props.t("Enter First Name")}
                validate={{ required: { value: true } }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="lastName"
                label={props.t("Last Name")}
                placeholder={props.t("Enter Last Name")}
                type="text"
                errorMessage={props.t("Enter Last Name")}
                validate={{ required: { value: true } }}
              />
            </div>
            <div className="mb-3">
              <AvField
                name="email"
                label={props.t("Email")}
                placeholder={props.t("Enter Email")}
                type="text"
                errorMessage={props.t("Enter Valid Email")}
                validate={{
                  required: true,
                  email: true,
                  async: debouncedChangeHandler,
                }}
              />
            </div>
            <div className="mb-3">
              <Label>{props.t("Password")}</Label>
              <AvField
                name="password"
                type="password"
                placeholder={props.t("Password")}
                errorMessage={props.t("Enter password")}
                validate= {{
                  required: { value : true },
                  minLength: {
                    value: 6,
                    errorMessage: props.t("Your Password must be more than 6 characters")
                  },
                  pattern :{  
                    value:"^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])",
                    errorMessage : props.t("Password Must contain at least one number and Capital and special characters")
                  }
                }}
              />
            </div>
            <div className="mb-3">
              <label >Select Role </label>
              <AvField
                type="select"
                name="roleId"
                errorMessage={props.t("please select role")}
                validate={{ required: { value: true } }}
              >
                <option value="">{props.t("Select Role")}</option>
                {usersRoles?.map((row) => {
                  return (<option key={row._id} value={row._id}>{row.title}</option>);
                })}
              </AvField>
            </div>
            <div className='text-center'>
              {
                props.addLoading
                  ?
                  <Loader />
                  :
                  <Button type="submit" color="primary" className="" disabled={submitState}>
                    {props.t("Add")} 
                  </Button>
              }
            </div>
          </AvForm>
          {props.addError && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.addErrorDetails}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}


const mapStateToProps = (state) => ({
  addLoading: state.usersReducer.addLoading,
  addErrorDetails: state.usersReducer.addErrorDetails,
  addSuccess: state.usersReducer.addSuccess,
  addError: state.usersReducer.addError,
  clearingCounter: state.usersReducer.clearingCounter,
  userPermissions: state.Profile.userPermissions
});
export default connect(mapStateToProps, null)(withTranslation()(UsersAddModal));
