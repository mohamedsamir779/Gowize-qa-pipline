import { 
  useState, useEffect, useRef 
} from "react";
import { Link } from "react-router-dom";
import { useDispatch, connect } from "react-redux";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

// i18n
import { withTranslation } from "react-i18next";
import { addCampaignTemplate } from "store/actions";
import AvFieldTextTag from "components/Common/AvFieldTextTag";
import { BASE_EMAIL_FIELDS } from "common/data/dropdowns";
import { languageOptions } from "constants/userEmails";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import AvFieldSelect from "components/Common/AvFieldSelect";
import draftToHtml from "draftjs-to-html";
//import { CKEditor } from "@ckeditor/ckeditor5-react";
//import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function AddTemplate(props) {
  const allCampaignTemplateTitles = props.allCampaignTemplates.map(
    (campaignTemplate) => campaignTemplate.title
  );
  const [duplicateTitle, setDuplicateTitle] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [language, setLanguage] = useState(languageOptions[0].value);
  const dispatch = useDispatch();
  const { create } = props.emailCampaignPermissions;
  const [data, setData] = useState(<></>);
  const contentRef = useRef();

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const repeatedTitleCheck = (e) => {
    e.target?.value?.length > 0 &&
      setDuplicateTitle(
        allCampaignTemplateTitles.includes(e.target.value?.trim())
      );
  };

  const titleErrorStyle = duplicateTitle
    ? "1px solid red"
    : "1px solid rgb(181, 181, 181)";

  const getContent = () => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);

    // Accessing the text content
    // const textContent = rawContentState.blocks
    //   .map((block) => block.text)
    //   .join("\n");
    setData(draftToHtml(rawContentState));
  };

  const handleAddCampaignTemplate = (e, values) => {
    const content = {};
    languageOptions.forEach((lang) => {
      if (lang.value === language) {
        content[lang.value] = {
          subject: values.subject,
          body: data,
        };
      } else {
        content[lang.value] = {
          subject: "",
          body: "",
        };
      }
    });
    dispatch(
      addCampaignTemplate({
        content,
        ...values,
      })
    );
  };
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
  }, [props.allCampaignTemplates]);
  return (
    <>
      <Link
        to="#"
        className={`btn btn-primary ${!create ? "d-none" : ""}`}
        onClick={toggleAddModal}
      >
        <i className="bx bx-plus me-1"></i> {props.t("Add Template")}
      </Link>
      <Modal
        isOpen={addModal}
        toggle={toggleAddModal}
        centered={true}
        size="lg"
      >
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Campaign Template")}
        </ModalHeader>
        <ModalBody>
          <AvForm
            className="p-4"
            onValidSubmit={(e, v) => {
              delete v.language;
              if (!duplicateTitle) {
                v.fields = (v.fields && v.fields.map((obj) => obj.value)) || [];
                handleAddCampaignTemplate(e, v);
              }
            }}
          >
            <AvField
              name="title"
              label={props.t("Title")}
              placeholder={props.t("Enter Title")}
              type="text"
              errorMessage={props.t("Enter Title")}
              validate={{ required: { value: true } }}
              onChange={repeatedTitleCheck}
              style={{
                border: `${titleErrorStyle}`,
              }}
            />
            {duplicateTitle && (
              <span className="text-danger">This title is already in use</span>
            )}
            <AvFieldTextTag
              name="fields"
              label={props.t("Fields")}
              value={[]}
              type="text"
              options={BASE_EMAIL_FIELDS}
            />
            <AvFieldSelect
              name="language"
              label={props.t("Language")}
              options={languageOptions}
              value={language}
              onChange={(e) => setLanguage(e)}
              required
            />
            <AvField name="subject" label={props.t("Subject")} required />
            <small>
              {props.t("*Customer related fields must be wrapped in")}{" "}
              &#123;&#123; &#125;&#125; {props.t("instead of")} _ _
            </small>
            <Editor
              // ref={contentRef}
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
              onChange={getContent}
              // value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}

            />
            {/* <AvField
              name="content"
              id="content"
              type="text"
              errorMessage={props.t("Enter Email Content")}
              validate={{ required: { value: true } }}
              value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
              style={{
                opacity: 0,
                height: 0,
                margin: -8,
              }}
            /> */}
            <div className="text-center pt-3 p-2">
              <Button disabled={props.addLoading} type="submit" color="primary">
                {props.t("Add")}
              </Button>
            </div>
          </AvForm>
          {props.addError && (
            <UncontrolledAlert color="danger">
              <i className="mdi mdi-block-helper me-2"></i>
              {props.t(JSON.stringify(props.addErrorDetails))}
            </UncontrolledAlert>
          )}
        </ModalBody>
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => ({
  addLoading: state.campaignTemplates.addLoading,
  addErrorDetails: state.campaignTemplates.addErrorDetails,
  addError: state.campaignTemplates.addError,
  clearingCounter: state.campaignTemplates.clearingCounter,
  emailCampaignPermissions: state.Profile.emailCampaignPermissions || {},
});

export default connect(mapStateToProps, null)(withTranslation()(AddTemplate));
