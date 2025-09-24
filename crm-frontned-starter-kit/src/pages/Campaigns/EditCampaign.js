import { useEffect, useState } from "react";
import {
  useDispatch, connect
} from "react-redux";
import {
  Modal, Button,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Container, Row, Col,
} from "reactstrap";

import { AvForm, AvField } from "availity-reactstrap-validation";
import DOMPurify from "dompurify";

import { languageOptions } from "constants/userEmails";
import Loader from "components/Common/Loader";
import formatDate from "helpers/formatDate";

import {
  editEmailCampaign, fetchCampaignTemplateHTML, getClientGroups
} from "store/actions";
// i18n
import { withTranslation } from "react-i18next";
import AvFieldSelect from "components/Common/AvFieldSelect";
import SelectClientGroups from "./SelectClientGroups";

function EditEmailCampaign(props) {
  const { open, campaign = {}, onClose } = props;
  const dispatch = useDispatch();

  const [duplicateTitle, setDuplicateTitle] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState();
  const [language, setLanguage] = useState();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    setSelectedTemplateId(campaign.templateId);
    setLanguage(campaign.language);
  }, [campaign]);

  useEffect(() => {
    dispatch(getClientGroups());
  }, []);

  const allCampaignTemplateTitles = props.allCampaigns.map((campaignTemplate) => (
    campaignTemplate.name.toLowerCase()
  ));
  const repeatedNameCheck = (e) => {
    e.target?.value?.length > 0 &&
      setDuplicateTitle(allCampaignTemplateTitles.includes(e.target.value?.toLowerCase()?.trim()));
  };

  const titleErrorStyle = duplicateTitle ? "1px solid red" : "1px solid rgb(181, 181, 181)";

  useEffect(() => {
    if (props.editClearingCounter > 0 && open) {
      onClose();
    }
  }, [props.editClearingCounter]);

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
    <Modal isOpen={open} toggle={onClose} centered={true} size="lg">
      <ModalHeader toggle={onClose} tag="h4">
        {props.t("Edit Campaign Template")}
      </ModalHeader>
      <ModalBody >
        <AvForm
          className='p-4'
          onValidSubmit={(e, v) => {
            if (!duplicateTitle) {
              dispatch(editEmailCampaign({
                id: campaign.id,
                jobId: campaign.jobId,
                groups,
                ...v,
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
                  value={campaign.name}
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
                  value={formatDate(campaign?.scheduleDate, "YYYY-MM-DDTHH:mm")}
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
                  value={campaign.templateId}
                  required
                />
              </Col>
              <Col md={6}>
                <AvFieldSelect
                  name="language"
                  label={props.t("Language")}
                  options={languageOptions}
                  value={campaign.language}
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
                  value={campaign.fromEmail}
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
                  value={campaign.replyTo}
                  required
                />
              </Col>
            </Row>
            <h6>{props.t("Groups")}</h6>
            <SelectClientGroups groups={props.groups} selectedGroups={props.campaign?.groups} getSelectedGroups={getSelectedGroups} />

            {
              props.editLoading
                ?
                <Loader />
                :
                <div className='text-center pt-3 p-2'>
                  <Button
                    disabled={props.editResult}
                    type="submit"
                    color="primary"
                  >
                    {props.t("Edit")}
                  </Button>
                </div>
            }
          </Container>
        </AvForm>
        {selectedTemplateId &&
          <div>
            <h6>{props.t("Preview")}</h6>
            <div className="border" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(props?.campaignPreview) }} />
          </div>
        }
        {props.editError && <UncontrolledAlert color="danger">
          <i className="mdi mdi-block-helper me-2"></i>
          {props.t(JSON.stringify(props.editError))}
        </UncontrolledAlert>}
      </ModalBody>
    </Modal>
  );
}


const mapStateToProps = (state) => ({
  editLoading: state.emailCampaigns.editLoading,
  addLoading: state.emailCampaigns.addLoading,
  editResult: state.emailCampaigns.editResult,
  editError: state.emailCampaigns.editError,
  editClearingCounter: state.emailCampaigns.editClearingCounter,
  groups: state.emailCampaigns.groups,
  campaignPreview: state.campaignTemplates.campaignTemplateHtml,
  actions: state.dictionaryReducer.actions || [],
  currentEmailProvider: state.systemEmailConfigReducer.currentProvider || "",
  email: state.systemEmailConfigReducer.configs || {},
});

export default connect(mapStateToProps, null)(withTranslation()(EditEmailCampaign));