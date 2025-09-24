import React, { useState, useEffect } from "react";
import {
  useDispatch, connect
} from "react-redux";
import {
  Modal, ModalHeader,
  ModalBody,
  Row, Col, UncontrolledAlert, Button,
} from "reactstrap";
import {
  AvForm, AvField
} from "availity-reactstrap-validation";
import { withTranslation } from "react-i18next";
import * as userAPI from "apis/users";
import AvFieldSelect from "components/Common/AvFieldSelect";
import { addLink } from "apis/campaigns/links";
import { showErrorNotification, showSuccessNotification } from "store/actions";
import { cpUrl } from "content";

function TodoAdd(props) {
  const [addModal, setAddModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [type, setType] = useState(props.type);
  const [typeText, setTypeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState("");
  const [registerTypeOptions, setRegisterTypeOptions] = useState([]);

  const dispatch = useDispatch();

  const toggleAddModal = () => {
    setAddModal(!addModal);
    if (props.onClose) {
      props.onClose();
    }
  };

  useEffect(() => {
    setAddModal(props.show);
  }, [props.show]);

  useEffect(()=>{
    (async ()=>{
      let users = await userAPI.getAssignedUsers({
        payload:{
          page: 1,
          limit: 10,
        }
      });
      if (users && users.result && users.result && users.result.totalDocs > 10) {
        users = await userAPI.getAssignedUsers({
          payload:{
            page: 1,
            limit: users.result.totalDocs,
          }
        });
      }
      setUsers(users.result.docs);
    })();
    
  }, []);

  const onSubmit = async (e, values) =>{
    try {
      setLoading(true);
      try {
        const result = await addLink(values);
        if (result.isSuccess){
          dispatch(showSuccessNotification("Link Added Successfully"));
          toggleAddModal();
        } else {
          dispatch(showErrorNotification(result.error));
        }
      } catch (error) {
        dispatch(showErrorNotification(error.message));
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(()=>{
    switch (section) {
      case "forex":
        setRegisterTypeOptions([{
          value: "live",
          label: "LIVE"
        },
        {
          value: "ib",
          label: "IB"
        },
        {
          value:"demo",
          label:"DEMO"  
        }]);
        break;
      case "crypto":
        setRegisterTypeOptions([{
          value: "live",
          label: "LIVE"
        },
        {
          value:"demo",
          label:"DEMO"  
        }]);
        break;
      case "gold":
        setRegisterTypeOptions([{
          value: "live",
          label: "LIVE"
        }]);
        break;
      default:
        break;
    }
  }, [section]);

  return (
    <React.Fragment>
      <Button
        color="primary"
        className={"btn btn-primary"}
        onClick={toggleAddModal}>
        <i className="bx bx-plus me-1"></i>
        Add New Link
      </Button>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          New Link
        </ModalHeader>
        <ModalBody >
          <AvForm onValidSubmit={onSubmit}>
            <Row>
              <Col className="col-12 mb-3">
                <AvField
                  name="name"
                  label="Name"
                  placeholder="Type Name"
                  type="text"
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Name is required"
                    }
                  }}
                />
                <AvFieldSelect
                  name="section"
                  label="Section"
                  placeholder="Select Section"
                  options={[{
                    value: "forex",
                    label: "Forex"
                  },
                  {
                    value: "crypto",
                    label: "Crypto"
                  },
                  {
                    value: "gold",
                    label: "Gold"
                  }
                  ]}
                  onChange={(e)=>{
                    setSection(e.value);
                  }}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "section is required"
                    }
                  }}
                />
                <AvFieldSelect
                  name="type"
                  label="Register Type"
                  placeholder="Select Register Type"
                  options={[{
                    value: "live",
                    label: "LIVE"
                  },
                  {
                    value: "ib",
                    label: "IB"
                  },
                  {
                    value:"demo",
                    label:"DEMO"  
                  }]}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "register type is required"
                    }
                  }}
                />
                <AvFieldSelect
                  name="urlType"
                  label="URL Type"
                  placeholder="Select URL Type"
                  options={[{
                    value:"landing",
                    label:"Landing"
                  },
                  {
                    value:"iframe",
                    label:"Iframe"
                  }]}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "URL Type is required"
                    }
                  }}
                />
                <AvFieldSelect
                  name="user"
                  label="User"
                  placeholder="Select User"
                  options={users.map(user => ({
                    value: user._id,
                    label: `${user.firstName} ${user.lastName}`
                  }))}
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "User is required"
                    }
                  }}
                />
                <AvField
                  name="url"
                  label="Client portal domain"
                  placeholder="Type URL"
                  type="text"
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "URL is required"
                    }
                  }}
                  defaultValue={cpUrl}
                  disabled={true}
                />
                <AvField
                  name="source"
                  label="Source"
                  placeholder="Type Source"
                  type="text"
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Source is required"
                    }
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-success save-event"
                    disabled={loading}
                  >
                    {props.t("Add")}
                  </button>
                </div>
              </Col>
            </Row>
          </AvForm>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}


const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, null)(withTranslation()(TodoAdd));
