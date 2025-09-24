import { addQuestionnaire } from "apis/forex/ib";
import { AvField, AvForm } from "availity-reactstrap-validation";
import AvFieldSelecvt from "components/Common/AvFieldSelect";
import { COUNTRIES } from "helpers/countries";
import React from "react";
import { CloseButton } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Button, CardBody, CardHeader, CardTitle, Modal 
} from "reactstrap";
import { fetchProfile } from "store/actions";
import { showErrorNotification, showSuccessNotification } from "store/general/notifications/actions";

function IbQuestionaire(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const submitQuestionnaire = async (e, v) =>{
    let targetCountries = v.countries.map((c)=>{
      return c.label;
    });
    delete v.countries;
    try {
      const result = await addQuestionnaire({
        ...v,
        targetCountries 
      });
      if (result.isSuccess){
        dispatch(showSuccessNotification("Ib Questionnaire added successfully"));
        dispatch(fetchProfile({ history }));
        props.toggle();        
      }
    } catch (error) {
      dispatch(showErrorNotification(error.message));
    }
  };
  return (<React.Fragment>
    <Modal
      isOpen={props.isOpen}
      toggle={() => props.toggle()}
      centered={true}
      className='custom-modal'
      size="xl"
    >
      <div className="p-4">
        <CardHeader className="d-flex flex-column gap-3">
          <CloseButton
            onClick={() => props.toggle()}
            style={{ 
              alignSelf: "flex-end",
              position: "absolute", 
              right: 10,
              top: 10 
            }} 
          />
          <div className="text-center">
            <CardTitle className="mb-0">{t("IB Application")}</CardTitle>
          </div>
        </CardHeader>
        <CardBody>
          <AvForm 
            onValidSubmit={(e, v)=>{
              submitQuestionnaire(e, v);
            }}
          >
            <div className="mb-2">
              <AvFieldSelecvt
                label={t("Do you have any financial market webiste / blog you intend to user for promotion?")}
                name="haveSite"
                options={[{
                  label:"Yes",
                  value:"yes" 
                },
                {
                  label:"No",
                  value:"no"
                }]}
                validate={{
                  required:{
                    value: true,
                    errorMessage: "this field is required" 
                  }
                }}
              >      
              </AvFieldSelecvt>
            </div>
            <div className="mb-2"> 
              <AvFieldSelecvt
                label={t("Have you reffered clients to other providers?")}
                name="reffer"
                options={[{
                  label:"Yes",
                  value:"yes" 
                },
                {
                  label:"No",
                  value:"no"
                }]}
                validate={{
                  required:{
                    value: true,
                    errorMessage: "this field is required" 
                  }
                }}
              >      
              </AvFieldSelecvt>
            </div> 
            <div className="mb-2">
              <AvFieldSelecvt
                label={t("How do you acquire clients?")}
                name="getClient"
                options={[{
                  label:"Wide range of personal network",
                  value:"Wide range of personal network" 
                },
                {
                  label:"Developing trading strategies and signals",
                  value:"Developing trading strategies and signals"
                },
                {
                  label:"Providing Forex education seminars",
                  value:"Providing Forex education seminars"
                },
                {
                  label:"Other",
                  value:"Other"
                }]}
                validate={{
                  required:{
                    value: true,
                    errorMessage: "this field is required" 
                  }
                }}
              >      
              </AvFieldSelecvt>
            </div>
            <div className="mb-2">
              <AvFieldSelecvt
                label={t("Countries of audience intending to acquire")}
                name="countries"
                className="basic-multi-select"
                classNamePrefix="select"
                isMulti
                options={COUNTRIES.map((country) => {
                  return {
                    label: country.countryEn,
                    value: country
                  };
                })}
                validate={{
                  required:{
                    value: true,
                    errorMessage: "this field is required" 
                  }
                }}
              >      
              </AvFieldSelecvt>
            </div>
            <div className="mb-2">
              <AvField
                label="How many clients do you expect introducting in the first 12 months?"
                name="expectedClients"
                type="number"
                validate={{
                  required:{
                    value: true,
                    message: "this field is required" 
                  } 
                }}
              >
                    
              </AvField>
            </div> 
            <div className="text-center">
              <Button type="submit" color="danger" className="w-lg waves-effect waves-light m-2">
                {t("Submit")}
              </Button>
            </div>
          </AvForm>
        </CardBody>
      </div> 
    </Modal>
  </React.Fragment>);
}

export default IbQuestionaire;