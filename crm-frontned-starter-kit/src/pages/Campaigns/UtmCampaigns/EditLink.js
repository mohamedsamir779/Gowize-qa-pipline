import React, { useState, useEffect } from "react";
import {
  useDispatch, connect
} from "react-redux";
import {
  Modal, Button,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Row,
  Col,
} from "reactstrap";
import {
  AvForm, AvField
} from "availity-reactstrap-validation";
import Loader from "components/Common/Loader";
import AvFieldSelect from "components/Common/AvFieldSelect";
import * as userAPI from "apis/users";
import * as linksAPI from "apis/campaigns/links";
import { showErrorNotification, showSuccessNotification } from "store/actions";
import { cpUrl } from "content";

function EditLink(props) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  
  const { open, selectedLink = {}, onClose, usersRoles, link } = props;
  const campaignToken = link?.fullUrl?.split("utm-campaign=")[1].split("&")[0];

  const toggleEditModal = () => {
    onClose();
  };

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

  const onSubmit = async (e, values) => {
    setLoading(true);
    try {
      values.campaignToken = campaignToken;
      const result = await linksAPI.editLink(values);
      if (result.isSuccess){
        dispatch(showSuccessNotification("Link Edited Successfully"));
        onClose();
      } else {
        dispatch(showErrorNotification(result.error));
      }
    } catch (error) {
      dispatch(showErrorNotification(error.message));
      setLoading(false);

    }
    setLoading(false);
  }; 
  return (<React.Fragment >
    <Modal isOpen={open} toggle={toggleEditModal} centered={true}>
      <ModalHeader toggle={toggleEditModal} tag="h4">
        Edit Link
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
                defaultValue={link.name}
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
                validate={{
                  required: {
                    value: true,
                    errorMessage: "section is required"
                  }
                }}
                value={link.section}
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
                value={link.type}
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
                value={link.urlType}
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
                value={link?.userId?._id}
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
                defaultValue={link.url || cpUrl}
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
                defaultValue={link.source}
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
  </React.Fragment>);
}

export default EditLink;