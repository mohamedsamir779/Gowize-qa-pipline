import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import {
  EditorState, convertToRaw, ContentState
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { AvField, AvForm } from "availity-reactstrap-validation";
import AvFieldSelect from "components/Common/AvFieldSelect";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import { showSuccessNotification, showErrorNotification } from "store/notifications/actions";
import { sendUserEmail } from "apis/users";
import useModal from "hooks/useModal";
import Loader from "components/Common/TableLoader";
import { addUserTemplate, getUserTemplates } from "apis/systemEmails";
import {
  toBase64, getBase64ContentType, removeBase64Metadata
} from "helpers/base64";
import { languageOptions, fields } from "constants/userEmails";
//import { CKEditor } from "@ckeditor/ckeditor5-react";
//import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function sendEmail({ clientData, isLead, t }) {
  const dispatch = useDispatch();
  const [show, toggle] = useModal();
  const [loading, setLoading] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [userTemplates, setUserTemplates] = useState([]);
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [subject, setSubject] = useState();
  const [attachments, setAttachments] = useState();
  const [templateTitle, setTemplateTitle] = useState();
  const [language, setLanguage] = useState(languageOptions[0].value);
  const [emails, setEmails] = useState([]);
  const { currentProvider, sendGrid, smtp } = useSelector((state) => state.Profile.emails) || {};
  const [data, setData] = useState(<></>);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };
  const getContent = () => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);

    // Accessing the text content
    const textContent = rawContentState.blocks.map(block => block.text).join("\n");
    setData(textContent);
  };

  const addTemplate = () => {
    setLoadingTemplate(true);
    const content = {};
    languageOptions.forEach((lang) => {
      if (lang.value === language) {
        content[lang.value] = {
          subject,
          body: data,
        };
      } else {
        content[lang.value] = {
          subject: "",
          body: ""
        };
      }
    });
    addUserTemplate({
      title: templateTitle,
      content,
      fields,
    }).then(() => {
      dispatch(showSuccessNotification("Template saved successfully"));
      setLoadingTemplate(false);
    }).catch(() => {
      dispatch(showErrorNotification("Error while saving template"));
      setLoadingTemplate(false);
    });
  };

  useEffect(async () => {
    // eslint-disable-next-line no-console
    setUserTemplates(await getUserTemplates().catch((err) => console.error(err)));
  }, []);

  useEffect(() => { // handle change in selected template/language
    if (useTemplate && selectedTemplateId) {
      const template = userTemplates.find((t) => t._id === selectedTemplateId);
      setSubject(template.content[language]?.subject ?? "");
      const blocksFromHTML = htmlToDraft(template.content[language]?.body ?? "");
      const { contentBlocks, entityMap } = blocksFromHTML;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [useTemplate, userTemplates, selectedTemplateId, language]);

  useEffect(() => {
    if (currentProvider === "sendGrid") {
      setEmails([sendGrid]);
    } else if (currentProvider === "smtp") {
      setEmails([smtp]);
    }
  }, [currentProvider, sendGrid, smtp]);

  return (
    <React.Fragment >
      <button
        type="button"
        disabled={isLead}
        className="btn btn-primary waves-effect waves-light w-100 me-1"
        onClick={toggle}
      >
        {t("Send Email")}
      </button>
      <Modal isOpen={show} toggle={toggle} centered={true}>
        <ModalHeader toggle={toggle}>
          {t("Send Email")}
        </ModalHeader>
        <ModalBody >
          <AvForm onValidSubmit={async (e, v) => {
            setLoading(true);
            delete v.templates;
            delete v.templateTitle;
            const attachmentsArray = [];
            if (attachments) {
              for (const attachment of attachments) {
                const base64 = await toBase64(attachment);
                attachmentsArray.push({
                  content: removeBase64Metadata(base64),
                  type: getBase64ContentType(base64),
                  filename: attachment.name,
                  disposition: "attachment",
                });
              }
            }
            sendUserEmail({
              ...v,
              fields,
              provider: currentProvider,
              clientData: {
                firstName: clientData.firstName,
                lastName: clientData.lastName,
                email: clientData.email,
              },
              body: data,
              attachments: attachmentsArray,
            }).then(() => {
              toggle();
              dispatch(showSuccessNotification("Email sent successfully"));
              setUseTemplate(false);
              setSelectedTemplateId("");
              setSubject("");
              setTemplateTitle("");
              setLanguage(languageOptions[0].value);
              setData(<></>);
              // setEditorState(EditorState.createEmpty());
              setLoading(false);
            }).catch(() => {
              dispatch(showErrorNotification("Error while sending email"));
              setLoading(false);
            });
          }} >
            <AvFieldSelect
              name="from"
              label={t("From")}
              options={emails.length > 0 && emails[0]?.fromEmail
                ? emails.map((email) => {
                  return {
                    value: email,
                    label: email?.fromEmail
                  };
                }) : ""
              }
              required
            />
            {!emails[0]?.fromEmail
              && <small className="d-flex justify-content-end">
                {t("Don't have an email?")}&nbsp;<Link to="/profile" className="fw-bold">{t("Link one")}</Link>
              </small>}
            <AvField
              name="to"
              label={t("To")}
              value={clientData.email}
              disabled={true}
            />
            <AvFieldSelect
              name="language"
              label={t("Language")}
              options={languageOptions}
              value={language}
              onChange={(e) => setLanguage(e)}
              required
            />
            <AvField
              name="subject"
              label={t("Subject")}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <label>
              <Input
                className="me-2"
                type="checkbox"
                name="useTemplate"
                value={useTemplate}
                onChange={() => setUseTemplate(!useTemplate)}
              />
              {t("Use Templates")}
            </label>
            {useTemplate && <>
              <br /><AvFieldSelect
                name="templates"
                label={t("Templates")}
                placeholder={t("Select from saved templates")}
                options={userTemplates.length > 0
                  ? userTemplates.map((template) => {
                    return {
                      value: template._id,
                      label: template.title
                    };
                  }) : ""
                }
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e)}
              />
              <AvField
                name="templateTitle"
                label={t("Template Title")}
                placeholder={t("Enter new template title")}
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
              />
            </>}
            <div>
              {fields.map((field) => (
                <span key={field} className="badge bg-secondary me-1 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(`_${field}_`);
                  }}>
                  _{field}_
                </span>
              ))}
            </div>
            <Editor
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
              onChange={getContent}
            />
            <input type="file" name="attachments" multiple onChange={(e) => setAttachments(e.target.files)} />
            <ModalFooter className="d-flex justify-content-center pb-0">
              {loadingTemplate ? <Loader />
                : useTemplate && <Button type="button" color="primary" className="me-2" onClick={addTemplate}>
                  {t("Save Template")}
                </Button>}
              {loading ? <Loader />
                : <Button type="submit" color="primary">
                  {t("Send")}
                </Button>
              }
            </ModalFooter>
          </AvForm>
        </ModalBody>
      </Modal>
    </React.Fragment >
  );
}

export default withTranslation()(sendEmail);