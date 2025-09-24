import React, { useState, useEffect } from "react";
import {
  useDispatch, connect
} from "react-redux";
import {
  Modal, Button,
  ModalHeader,
  ModalBody
} from "reactstrap";
import {
  AvForm, AvField, AvInput
} from "availity-reactstrap-validation";
import Select from "react-select";
import DOMPurify from "dompurify";

// i18n
import { withTranslation } from "react-i18next";
import { fetchSystemEmailHTML } from "store/systemEmail/actions";
import { fetchCampaignTemplateHTML } from "store/actions";
import CustomSelect from "components/Common/CustomSelect";

function SystemEmailHTMLModal(props){
  const dispatch = useDispatch();
  const { open, role = {}, onClose } = props;
  const readableLanguages = {
    "en": "English",
    "ar": "Arabic"
  };
  const availableLanguageOptions = () => {
    return (
      Object.keys(role.content).map((availableLanguage) => {
        return (
          {
            value: availableLanguage,
            label: readableLanguages[availableLanguage]
          }
        );
      })
    );
  };
  const languageInitialValue = props.role && availableLanguageOptions().find((item) => (
    item.value === "en"
  ));
  const [selectedLanguage, setSelectedLanguage] = useState(languageInitialValue);  
  const languageChangeHanlder = (selectedLanguageVar) => {
    setSelectedLanguage(selectedLanguageVar);
  };
  
  const handlefetchHTMLPreview = () => {
    const obj = {
      id: role.id,
      lang: selectedLanguage.value
    };
    dispatch(props.isCampaign ? fetchCampaignTemplateHTML(obj) : fetchSystemEmailHTML(obj));
  };
  useEffect(()=>{
    if (props.fetchHTMLClearingCounter > 0 && open) {
      onClose();
    }
  }, [props.fetchHTMLClearingCounter]);

  useEffect(() => {
    setSelectedLanguage(languageInitialValue);
  }, [role]);

  useEffect(() => {
    handlefetchHTMLPreview();
  }, [selectedLanguage, role]);

  return (
    <React.Fragment >
      <Modal 
        isOpen={open} 
        toggle={onClose} 
        centered={true} 
        size="lg" 
        style={
          {
            maxWidth: "900px", 
            width: "100%"
          }
        }>
        <ModalHeader toggle={onClose} tag="h4">
          {props.t("System email preview")}
        </ModalHeader>
        <ModalBody>
          <AvForm>
            <div className="mb-3">
              <label>{props.t("Available languages")}</label>
              {
                props.role &&
                <>
                  <CustomSelect
                    defaultValue={selectedLanguage}
                    options={availableLanguageOptions()} 
                    onChange={languageChangeHanlder}
                  />
                  <AvField
                    name="language"
                    id="Available languages"
                    type="text"
                    errorMessage={props.t("Language is required")}
                    validate={{ required: { value: true } }}
                    value={selectedLanguage.value}
                    style={{
                      opacity: 0,
                      height: 0,
                      margin: -8 
                    }}
                  />
                </>
              }
            </div>

            <div className="mb-3">
              <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(props.isCampaign ? props?.campaignTemplateHtml : props?.systemEmailHtml) }}
              />  
            </div>
            {role.permissions && Object.keys(role.permissions).map((permKey, permInd) =>
              <div className="mb-3" key={permInd}>
                <h6 className="text-capitalize">{permKey}</h6>
                {role.permissions[permKey] && Object.keys(role.permissions[permKey]).map((permission, permissionInd) =>
                  <React.Fragment key={permissionInd}>
                    <AvInput type="checkbox" name={`permissions.${permKey}.${permission}`} value={role.permissions[permKey][permission]} />
                    <span className="p-2" >{permission}</span>
                  </React.Fragment>
                )}                     
              </div>
            )}
            {/* close button */}
            <div className='text-center pt-3 p-2'>
              <Button 
                type="submit" 
                color="primary"
                onClick={() => {props.onClose()}}
              >
                {props.t("Close")}
              </Button>
            </div>
          </AvForm>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  systemEmailHtml: state.systemEmailsReducer.systemEmailHtml,
  htmlFailDetails: state.systemEmailsReducer.htmlFailDetails,
  fetchHTMLClearingCounter: state.systemEmailsReducer.fetchHTMLClearingCounter,
  campaignTemplateHtml: state.campaignTemplates.campaignTemplateHtml,
});

export default connect(mapStateToProps, null)(withTranslation()(SystemEmailHTMLModal));