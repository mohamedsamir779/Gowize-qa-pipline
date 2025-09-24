import { useState, useEffect } from "react";
import {
  Link
} from "react-router-dom";
import { useDispatch, connect } from "react-redux";
import {
  Modal, Button, ModalHeader, ModalBody, UncontrolledAlert, Container, Row, Col
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

// i18n
import { withTranslation } from "react-i18next";
import { languageOptions } from "constants/userEmails";
import AvFieldSelect from "components/Common/AvFieldSelect";
import {
  fetchCampaignTemplateHTML, fetchCampaignTemplates, fetchEmailConfiguration,
  getClientGroups
} from "store/actions";
import { addEmailCampaign } from "store/EmailCampaigns/actions";
import DOMPurify from "dompurify";
import SelectClientGroups from "./SelectClientGroups";

function AddTemplate(props) {
  const allCampaignTemplateTitles = props.allCampaigns.map((campaignTemplate) => (
    campaignTemplate.name.toLowerCase()
  ));
  const [duplicateTitle, setDuplicateTitle] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [language, setLanguage] = useState(languageOptions[0].value);
  const [groups, setGroups] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState();
  const dispatch = useDispatch();
  const { create } = props.emailCampaignPermissions;

  const repeatedNameCheck = (e) => {
    e.target?.value?.length > 0 &&
      setDuplicateTitle(allCampaignTemplateTitles.includes(e.target.value?.toLowerCase()?.trim()));
  };

  const titleErrorStyle = duplicateTitle ? "1px solid red" : "1px solid rgb(181, 181, 181)";

  useEffect(() => {
    dispatch(fetchCampaignTemplates());
    dispatch(fetchEmailConfiguration());
    dispatch(getClientGroups());
  }, []);

  const toggleAddModal = () => {
    setAddModal(!addModal);
    setDuplicateTitle(false);
  };
  useEffect(() => {
    if (props.clearingCounter > 0 && addModal) {
      setAddModal(false);
      setDuplicateTitle(false);
    }
  }, [props.clearingCounter]);

  useEffect(() => {
    setDuplicateTitle(false);
  }, [props.allCampaigns]);

  useEffect(() => {
    if (selectedTemplateId && language) {
      dispatch(fetchCampaignTemplateHTML({
        id: selectedTemplateId,
        lang: language
      }));
    }
  }, [selectedTemplateId, language]);

  const getSelectedGroups = (selectedGroups) => {
    setGroups(selectedGroups);
  };

  return (
    <>
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}>
        <i className="bx bx-plus me-1"></i> {props.t("New Campaign")}
      </Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true} size="lg">
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Create New Campaign")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              if (!duplicateTitle) {
                dispatch(addEmailCampaign({
                  ...v,
                  groups,
                }));
              }
            }}
          >
            <Container>
              <Row>
                <Col md={6}>
                  <AvField
                    name="name"
                    label={props.t("Name")}
                    placeholder={props.t("Enter Name")}
                    type="text"
                    errorMessage={props.t("Enter Name")}
                    validate={{ required: { value: true } }}
                    onChange={repeatedNameCheck}
                    style={{
                      border: `${titleErrorStyle}`
                    }}
                  />
                  {duplicateTitle && <span className="text-danger">This name is already in use</span>}
                </Col>
                <Col md={6}>
                  <AvField
                    type="datetime-local"
                    name="scheduleDate"
                    label={props.t("Schedule Date")}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <AvFieldSelect
                    name="templateId"
                    label={props.t("Template")}
                    options={props.templates.map((template) => ({
                      value: template.id,
                      label: template.title
                    })) || []}
                    onChange={(e) => {
                      setSelectedTemplateId(e);
                    }}
                    required
                  />
                </Col>
                <Col md={6}>
                  <AvFieldSelect
                    name="language"
                    label={props.t("Language")}
                    options={languageOptions}
                    value={language}
                    onChange={(e) => setLanguage(e)}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <AvFieldSelect
                    name="fromEmail"
                    label={props.t("From Email")}
                    options={[{
                      value: props.email[props.currentEmailProvider]?.fromEmail,
                      label: props.email[props.currentEmailProvider]?.fromEmail,
                    }]}
                    required
                  />
                </Col>
                <Col md={6}>
                  <AvFieldSelect
                    name="replyTo"
                    label={props.t("Reply To")}
                    options={[{
                      value: props.email[props.currentEmailProvider]?.fromEmail,
                      label: props.email[props.currentEmailProvider]?.fromEmail,
                    }]}
                    required
                  />
                </Col>
              </Row>
              <h6>{props.t("Groups")}</h6>
              <SelectClientGroups  groups={props.groups} getSelectedGroups={getSelectedGroups}/>
              <div className='text-center pt-3 p-2'>
                <Button
                  disabled={props.addLoading}
                  type="submit"
                  color="primary"
                >
                  {props.t("Create")}
                </Button>
              </div>
            </Container>
          </AvForm>
          {selectedTemplateId &&
            <div>
              <h6>{props.t("Preview")}</h6>
              <div className="border" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(props?.campaignPreview) }} />
            </div>
          }
          {props.addError && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.t(JSON.stringify(props.addErrorDetails))}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal >
    </>
  );
}

const mapStateToProps = (state) => ({
  addLoading: state.emailCampaigns.addLoading,
  addErrorDetails: state.emailCampaigns.addErrorDetails,
  addError: state.emailCampaigns.addError,
  clearingCounter: state.emailCampaigns.clearingCounter,
  groups: state.emailCampaigns.groups,
  campaignPreview: state.campaignTemplates.campaignTemplateHtml,
  emailCampaignPermissions: state.Profile.emailCampaignPermissions || {},
  currentEmailProvider: state.systemEmailConfigReducer.currentProvider || "",
  email: state.systemEmailConfigReducer.configs || {},
});

export default connect(mapStateToProps, null)(withTranslation()(AddTemplate));