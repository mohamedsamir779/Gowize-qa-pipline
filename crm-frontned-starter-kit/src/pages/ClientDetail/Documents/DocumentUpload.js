import React, {
  useEffect, useRef, useState 
} from "react";
import {
  connect, useDispatch, useSelector 
} from "react-redux";
import {
  Row, Col, Button, Card,  CardBody, CardHeader, CardTitle, Input
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
// i18n 
import { useTranslation } from "react-i18next";
import {
  uploadDocsStart
} from "store/documents/actions";
function UploadKYC (props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [idDisabled, setIdDisabled] = useState(false);
  const [addressDisabled, setAddressDisabled] = useState(false);
  const { documents } = useSelector(state=>state.documentsReducer);
  const { userData, clientDetails } = useSelector((state) => ({
    userData: state.Profile.userData,
    clientDetails: state.clientReducer.clientDetails,
  }));
  const refForm = useRef();
  const [memFiles, setMemFiles] = React.useState({});
  const addFile = (name, files) => {
    setMemFiles({
      ...memFiles,
      [name]: files,
    });
  };
  const uploadDoc = async () => {
    try {
      if (Object.keys(memFiles).length > 0)
      { 
        var formData = new FormData();
        formData.append("ID", memFiles["ID1"]);
        if (memFiles["ID2"]) {
          formData.append("ID", memFiles["ID2"]);
        }
        formData.append("ADDRESS", memFiles["ADDRESS"]);
        dispatch(uploadDocsStart({
          clientId: props.clientId,
          formData,
        }));
      }
      // const tmp = await uploadDocuments(props.clientId, formData);
      // console.log("result ", tmp);
    } catch (error) {
    }
  };

  const resetForm = () => {
    setMemFiles({});
    refForm.current.reset();
  };
  useEffect(()=> {
    if (props.clear > 0) {
      resetForm();
    }
  }, [props.clear]);

  const [showKYC, setShowKYC] = React.useState(true);
  useEffect(()=>{
    if (props.clientDetails && props.clientDetails.stages) {
      if (props.clientDetails.stages.kycApproved) {
        setShowKYC(false);
      }
    }
  }, [props.clientDetails]);

  useEffect(()=>{
    const IdApproved = documents.filter((doc)=>doc.status == "APPROVED" && doc.type == "ID");
    if (IdApproved.length > 0)
      setIdDisabled(true);
    const addressApproved = documents.filter((doc)=>doc.status == "APPROVED" && doc.type == "ADDRESS");
    if (addressApproved.length > 0)
      setAddressDisabled(true);
    return () => {
      setAddressDisabled(false);
      setIdDisabled(false);
    };
  }, [documents]);

  const validateFile = (value, ctx, input, cb)=> {
    const extensions = ["png", "jpg", "jpeg", "pdf"];
    const possibleExtensions = value.split(".");
    const extension = value.split(".")[possibleExtensions.length - 1];
    if (extensions.includes(extension) || !value){
      if (!value || memFiles[input.props.name]?.size <= 2097152){
        cb(true);
      } else cb("2mb maximum size");
    } else cb("Only images or PDF can be uploaded");    
  };

  return (<React.Fragment>
    <AvForm
      style={{ height: "100%" }}
      ref={refForm}
      className='p-4'
      onValidSubmit={(e, v) => {
        uploadDoc(e, v);
      }}
    >
      <Row style={{ height: "100%" }}>
        <Card>
          <CardHeader className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center">
              <CardTitle className="color-primary">{t("KYC Documents")}</CardTitle>
            </div>
          </CardHeader>
          <CardBody className="d-flex justify-content-center align-items-center">
            {showKYC && 
              <Row>
                <Col md="6" className="mb-3">           
                  <AvField
                    tag={Input}
                    className="form-control"
                    name="ID1"
                    label={t("Proof of ID - Front Side")}
                    type="file"
                    disabled={idDisabled}
                    onChange={(e)=>{addFile("ID1", e.target.files[0])}}
                    validate={{
                      custom:validateFile
                    }}
                  />
                </Col>
                <Col md="6" className="mb-3">
                  <AvField
                    tag={Input}
                    className="form-control"
                    id="Proof_of_ID_front_side"
                    name="ID2"
                    label={t("Proof of ID - Back Side")}
                    type="file"
                    disabled={idDisabled}
                    onChange={(e)=>{addFile("ID2", e.target.files[0])}}
                    validate={{
                      custom:validateFile
                    }}
                  />
                </Col>
                <Col md="6" className="mb-3">
                  <AvField
                    tag={Input}
                    className="form-control"
                    id="Proof_of_ID_front_side"
                    name="ADDRESS"
                    label={t("Proof of Address")}
                    type="file"
                    disabled={addressDisabled}
                    onChange={(e)=>{addFile("ADDRESS", e.target.files[0])}}
                    validate={{
                      custom:validateFile
                    }}
                  />
                </Col>
                <Col md="12" className='text-center pt-3 p-2'>
                  <Row className="spacing">
                    <Col sm={6} xs={6}></Col>
                    <Col sm={6} xs={12} className="d-flex justify-content-between">
                      <Button disabled={props.uploading} type="button" className="w-md mb-2" onClick={resetForm} color="danger">
                        {t("Reset Form")}
                      </Button>
                      <Button disabled={props.uploading} type="submit" className="w-md mb-2" color="primary">
                        {t("Upload")}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            }
            {/* {!showKYC && <h2 className="color-primary">KYC documents Uploaded</h2>} */}
            {!showKYC && clientDetails?.stages.sumsubId && <Button type="button"  color="primary" onClick={()=> window.open(
              `https://cockpit.sumsub.com/checkus#/applicant/${clientDetails?.stages.sumsubId}/client/basicInfo`

            )}>KYC documents Uploaded (Visit Sumsub) </Button>}
          </CardBody>
        </Card>
      </Row>
    </AvForm>
  </React.Fragment>);
}

function UploadAdditionalDocs (props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const refForm = useRef();

  const [memFiles, setMemFiles] = React.useState({});
  const addFile = (name, files) => {
    setMemFiles({
      ...memFiles,
      [name]: files,
    });
  };

  const resetForm = () => {
    setMemFiles({});
    refForm.current.reset();
  };

  useEffect(()=> {
    if (props.clear > 0) {
      resetForm();
    }
  }, [props.clear]);

  const uploadDoc = async () => {
    try {
      if (Object.keys(memFiles).length > 0)
      { 
        var formData = new FormData();
        Object.keys(memFiles).forEach((key) => {
          const file = memFiles[key];
          formData.append(key, file);
        });
        dispatch(uploadDocsStart({
          clientId: props.clientId,
          formData,
        }));
      }
    } catch (error) {
    }
  };
  const options = [{
    label: "Agreement",
    value: "AGREEMENT"
  }, {
    label: "World Check",
    value: "WORLD_CHECK"
  }, {
    label: "Source of Funds",
    value: "SOURCE_OF_FUNDS"
  }, {
    label: "Additional Documents",
    value: "ADDITIONAL_DOCUMENTS"
  }];

  const validateFile = (value, ctx, input, cb)=> {
    const extensions = ["png", "jpg", "jpeg", "pdf"];
    const possibleExtensions = value.split(".");
    const extension = value.split(".")[possibleExtensions.length - 1];
    if (extensions.includes(extension) || !value){
      if (!value || memFiles[input.props.name]?.size <= 2097152){    
        cb(true);
        return;
      } else cb("2mb maximum size");
    } else cb("Only images or PDF can be uploaded");    
  };

  return (<React.Fragment>
    <AvForm
      ref={refForm}
      className='p-4'
      onValidSubmit={(e, v) => {
        uploadDoc(e, v);
      }}
    >
      <Row>
        <Card>
          <CardHeader className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center">
              <CardTitle className="color-primary">{t("Other Documents")}</CardTitle>
            </div>
          </CardHeader>
          <CardBody>
            <Row>
              {options.map((obj, index) => <React.Fragment key={index}>
                <Col md={6} className="mb-3">
                  <AvField
                    tag={Input}
                    className="form-control"
                    id="Proof_of_ID_front_side"
                    onChange={(e) => { addFile(obj.value, e.target.files[0]) }}
                    name={obj.value}
                    label={t(obj.label)}
                    type="file"
                    validate={{
                      custom:validateFile
                    }}
                  />
                </Col>
              </React.Fragment>)}
              <Col md="12" className='text-center pt-3 p-2'>   
                <Row className="spacing">
                  <Col sm={6} xs={6}></Col>
                  <Col sm={6} xs={12} className="d-flex justify-content-between">
                    <Button disabled={props.uploading} type="button" className="w-md mb-2" onClick={resetForm} color="danger">
                      {t("Reset Form")}
                    </Button>
                    <Button disabled={props.uploading} type="submit" className="w-md mb-2" color="primary">
                      {t("Upload")}
                    </Button>
                  </Col>
                </Row>
              </Col>
                  
            </Row>
          </CardBody>
        </Card>
      </Row>
    </AvForm>
  </React.Fragment>);
}

function ClientDetails(props) {

  // const [docType, setDocType] = React.useState(options[0]);

  return (
    <React.Fragment>
      <Row>
        <Col md={6}>
          <UploadKYC {...props} documents={props.documents} />
        </Col>
        <Col md={6}>
          <UploadAdditionalDocs {...props} documents={props.documents} />
        </Col>
      </Row>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  uploading: state.documentsReducer.uploading,
  documents: state.documentsReducer.documents,
  clear: state.documentsReducer.clear,
  clientDetails: state.clientReducer.clientDetails,
});

export default connect(mapStateToProps, null)(ClientDetails);