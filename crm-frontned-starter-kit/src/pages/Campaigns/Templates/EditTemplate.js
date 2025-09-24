import { useEffect, useState } from "react";
import {
  useDispatch, connect
} from "react-redux";
import {
  Modal, Button,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

import AvFieldTextTag from "components/Common/AvFieldTextTag";
import { BASE_EMAIL_FIELDS } from "common/data/dropdowns";
import { languageOptions } from "constants/userEmails";
import Loader from "components/Common/Loader";

import { editCampaignTemplate } from "store/actions";
// i18n
import { withTranslation } from "react-i18next";
import AvFieldSelect from "components/Common/AvFieldSelect";
import {
  ContentState, EditorState, convertToRaw
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";
//import { CKEditor } from "@ckeditor/ckeditor5-react";
//import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function SystemEmailEditModal(props) {
  const { open, role = {}, onClose } = props;
  const dispatch = useDispatch();
  const [data, setData] = useState(<></>);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0].value);
  useEffect(() => {
    if (role.content && role.content[selectedLanguage]) {
      const blocksFromHTML = htmlToDraft(role.content[selectedLanguage].body);
      const { contentBlocks, entityMap } = blocksFromHTML;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [role.content, selectedLanguage]);

  const handleEditSystemEmail = (e, values) => {
    delete values.language;
    const content = {};
    languageOptions.forEach((lang) => {
      if (lang.value === selectedLanguage) {
        content[lang.value] = {
          subject: values.subject,
          body: data,
        };
        delete values.subject;
      }
    });
    console.log(role);
    console.log({
      id: role.id,
      content: {
        ...role.content,
        ...content,
      },
      ...values,
    });
    dispatch(editCampaignTemplate({
      id: role.id,
      content: {
        ...role.content,
        ...content,
      },
      ...values,
    }));
  };
  useEffect(() => {
    if (props.editClearingCounter > 0 && open) {
      onClose();
    }
  }, [props.editClearingCounter]);

  const getContent = () => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);

    // Accessing the text content
    const textContent = rawContentState.blocks.map(block => block.text).join("\n");
    setData(textContent);
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
            v.fields = v.fields && v.fields.map(obj => obj.value) || [];
            handleEditSystemEmail(e, v);
          }}
        >
          <AvField
            name="title"
            label={props.t("Title")}
            placeholder={props.t("Enter Title")}
            type="text"
            value={role.title}
            errorMessage={props.t("Enter Title")}
            validate={{ required: { value: true } }}
          />
          <AvFieldTextTag
            name="fields"
            label={props.t("Fields")}
            value={role.fields}
            type="text"
            options={BASE_EMAIL_FIELDS}
          />
          <AvFieldSelect
            name="language"
            label={props.t("Template Language")}
            errorMessage={props.t("Enter Language")}
            validate={{ required: { value: true } }}
            options={languageOptions}
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e)}
            style={{
              opacity: 0,
              height: 0,
              margin: -8
            }}
          />
          <AvField
            name="subject"
            label={props.t("Subject")}
            placeholder={props.t("Enter Subject")}
            type="text"
            value={role.content && role.content[selectedLanguage] && role.content[selectedLanguage].subject}
            errorMessage={props.t("Enter Subject")}
            required
          />
          <small>{props.t("*Customer related fields must be wrapped in")} &#123;&#123; &#125;&#125; {props.t("instead of")} _ _</small>
          <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            onChange={getContent}
          />
          {/* <button onClick={getContent}>Get Content</button> */}

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
        </AvForm>
        {props.editError && <UncontrolledAlert color="danger">
          <i className="mdi mdi-block-helper me-2"></i>
          {props.t(JSON.stringify(props.editError))}
        </UncontrolledAlert>}
      </ModalBody>
    </Modal>
  );
}


const mapStateToProps = (state) => ({
  editLoading: state.campaignTemplates.editLoading,
  addLoading: state.campaignTemplates.addLoading,
  editResult: state.campaignTemplates.editResult,
  editError: state.campaignTemplates.editError,
  editClearingCounter: state.campaignTemplates.editClearingCounter,
  actions: state.dictionaryReducer.actions || [],
});

export default connect(mapStateToProps, null)(withTranslation()(SystemEmailEditModal));