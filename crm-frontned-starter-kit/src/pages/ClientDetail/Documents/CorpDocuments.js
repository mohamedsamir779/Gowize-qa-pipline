import React, {
  useEffect, useRef, useState
} from "react";
import {
  connect, useDispatch, useSelector
} from "react-redux";
import {
  Row, Col, Button, Card, CardBody, CardHeader, CardTitle, Input
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
// i18n 
import { useTranslation } from "react-i18next";
import {
  uploadDocsStart
} from "store/documents/actions";

function UploadCorpKYC(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [corpAddressDisabled, setCorpAddressDisabled] = useState(false);
  const [memorandumDisabled, setMemorandumDisabled] = useState(false);
  const [certificateDisabled, setCertificateDisabled] = useState(false);
  const { documents } = useSelector(state => state.documentsReducer);
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
      if (Object.keys(memFiles).length > 0) {
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

  const resetForm = () => {
    setMemFiles({});
    refForm.current.reset();
  };
  useEffect(() => {
    if (props.clear > 0) {
      resetForm();
    }
  }, [props.clear]);

  const [showKYC, setShowKYC] = React.useState(true);
  useEffect(() => {
    if (corpAddressDisabled && memorandumDisabled && certificateDisabled) {
      setShowKYC(false);
    }
  }, [corpAddressDisabled, memorandumDisabled, certificateDisabled]);

  useEffect(() => {
    const memorandumApproved = documents.filter((doc) => doc.status == "APPROVED" && doc.type == "MEMORANDUM");
    const certificateApproved = documents.filter((doc) => doc.status == "APPROVED" && doc.type == "CERTIFICATE_OF_INCORPORATION");
    const corpAddressApproved = documents.filter((doc) => doc.status == "APPROVED" && doc.type == "CORPORATE_ADDRESS");
    if (memorandumApproved.length > 0) setMemorandumDisabled(true);
    if (certificateApproved.length > 0) setCertificateDisabled(true);
    if (corpAddressApproved.length > 0) setCorpAddressDisabled(true);

    return () => {
      setMemorandumDisabled(false);
      setCertificateDisabled(false);
      setCorpAddressDisabled(false);
    };
  }, [documents]);

  const validateFile = (value, ctx, input, cb) => {
    const extensions = ["png", "jpg", "jpeg", "pdf"];
    const possibleExtensions = value.split(".");
    const extension = value.split(".")[possibleExtensions.length - 1];
    if (extensions.includes(extension) || !value) {
      if (!value || memFiles[input.props.name]?.size <= 2097152) {
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
              <CardTitle className="color-primary">{t("Corporate Documents")}</CardTitle>
            </div>
          </CardHeader>
          <CardBody className="d-flex justify-content-center align-items-center">
            {showKYC &&
              <Row>
                <Col md="6">
                  <AvField
                    tag={Input}
                    className="form-control"
                    name="MEMORANDUM"
                    label={t("Memorandum of Association")}
                    type="file"
                    disabled={memorandumDisabled}
                    onChange={(e) => { addFile("MEMORANDUM", e.target.files[0]) }}
                    validate={{
                      custom: validateFile
                    }}
                  />
                </Col>
                <Col md="6">
                  <AvField
                    tag={Input}
                    className="form-control"
                    name="CERTIFICATE_OF_INCORPORATION"
                    label={t("Certificate of Incorporation")}
                    type="file"
                    disabled={certificateDisabled}
                    onChange={(e) => { addFile("CERTIFICATE_OF_INCORPORATION", e.target.files[0]) }}
                    validate={{
                      custom: validateFile
                    }}
                  />
                </Col>
                <Col md="6">
                  <AvField
                    tag={Input}
                    className="form-control"
                    name="CORPORATE_ADDRESS"
                    label={t("Corporate Address")}
                    type="file"
                    disabled={corpAddressDisabled}
                    onChange={(e) => { addFile("CORPORATE_ADDRESS", e.target.files[0]) }}
                    validate={{
                      custom: validateFile
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
            {!showKYC && <h2>Documents Approved</h2>}
          </CardBody>
        </Card>
      </Row>
    </AvForm>
  </React.Fragment>);
}

function UploadAuthKYC(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [idDisabled, setIdDisabled] = useState(false);
  const [addressDisabled, setAddressDisabled] = useState(false);
  const { documents } = useSelector(state => state.documentsReducer);
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
      if (Object.keys(memFiles).length > 0) {
        var formData = new FormData();
        formData.append("ID", memFiles["ID1"]);
        if (memFiles["ID2"]) {
          formData.append("ID", memFiles["ID2"]);
        }
        formData.append("ADDRESS", memFiles["ADDRESS"]);
        formData.append("subType", "AUTHORIZED_PERSON");
        dispatch(uploadDocsStart({
          clientId: props.clientId,
          formData,
        }));
      }
    } catch (error) { }
  };
  const resetForm = () => {
    setMemFiles({});
    refForm.current.reset();
  };
  useEffect(() => {
    if (props.clear > 0) {
      resetForm();
    }
  }, [props.clear]);

  const [showKYC, setShowKYC] = React.useState(true);
  const [noPerson, setNoPerson] = React.useState(true);
  useEffect(() => {
    if ((idDisabled && addressDisabled)) {
      setShowKYC(false);
    }
  }, [idDisabled, addressDisabled]);

  useEffect(() => {
    if (!props.clientDetails.corporateInfo.authorizedPerson) {
      setNoPerson(true);
    } else {
      setNoPerson(false);
    }
  }, [props.clientDetails]);

  useEffect(() => {
    const IdApproved = documents.filter((doc) => doc.status == "APPROVED" && doc.type == "ID" && doc.subType == "AUTHORIZED_PERSON");
    if (IdApproved.length > 0)
      setIdDisabled(true);

    const addressApproved = documents.filter((doc) => doc.status == "APPROVED" && doc.type == "ADDRESS" && doc.subType == "AUTHORIZED_PERSON");
    if (addressApproved.length > 0) setAddressDisabled(true);

    return () => {
      setAddressDisabled(false);
      setIdDisabled(false);
    };
  }, [documents]);

  const validateFile = (value, ctx, input, cb) => {
    const extensions = ["png", "jpg", "jpeg", "pdf"];
    const possibleExtensions = value.split(".");
    const extension = value.split(".")[possibleExtensions.length - 1];
    if (extensions.includes(extension) || !value) {
      if (!value || memFiles[input.props.name]?.size <= 2097152) {
        cb(true);
      } else cb("2mb maximum size");
    } else cb("Only images or PDF can be uploaded");
  };

  return (
    <React.Fragment>
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
                <CardTitle className="color-primary">{t("Authorized Person Documents")}</CardTitle>
              </div>
            </CardHeader>
            <CardBody className="d-flex justify-content-center align-items-center">
              {noPerson && <h2>No Authorized Person</h2>}
              {showKYC && !noPerson &&
                <Row>
                  <Col md="6">
                    <AvField
                      tag={Input}
                      className="form-control"
                      name="ID1"
                      label={t("Proof of ID - Front Side")}
                      type="file"
                      disabled={idDisabled}
                      onChange={(e) => { addFile("ID1", e.target.files[0]) }}
                      validate={{
                        custom: validateFile
                      }}
                    />
                  </Col>
                  <Col md="6">
                    <AvField
                      tag={Input}
                      className="form-control"
                      id="Proof_of_ID_front_side"
                      name="ID2"
                      label={t("Proof of ID - Back Side")}
                      type="file"
                      disabled={idDisabled}
                      onChange={(e) => { addFile("ID2", e.target.files[0]) }}
                      validate={{
                        custom: validateFile
                      }}
                    />
                  </Col>
                  <Col md="6">
                    <AvField
                      tag={Input}
                      className="form-control"
                      id="Proof_of_ID_front_side"
                      name="ADDRESS"
                      label={t("Proof of Address")}
                      type="file"
                      disabled={addressDisabled}
                      onChange={(e) => { addFile("ADDRESS", e.target.files[0]) }}
                      validate={{
                        custom: validateFile
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
              {!showKYC && !noPerson && <h2>Documents Approved</h2>}
            </CardBody>
          </Card>
        </Row>
      </AvForm>
    </React.Fragment>);
}


function UploadShareholdersKYC(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [ApprovedShareholderIds, setApprovedShareholderIds] = useState([]);
  const [allShareholdersIdsApproved, setAllShareholdersIdsApproved] = useState(false);
  const [approvedShareholderAddresses, setApprovedShareholderAddresses] = useState([]);
  const [allShareholdersAddressesApproved, setAllShareholdersAddressesApproved] = useState(false);

  const { documents } = useSelector(state => state.documentsReducer);
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
      if (Object.keys(memFiles).length > 0) {
        const { corporateInfo } = props.clientDetails;
        const shareholders = corporateInfo?.shareholders || [];

        const uploadPromises = shareholders.map(async (shareholder) => {
          const formData = new FormData();
          const shareholderId = shareholder._id;
          formData.append("shareholderId", shareholderId);

          formData.append("ID", memFiles[`ID1_${shareholderId}`]);
          if (memFiles[`ID2_${shareholderId}`]) {
            formData.append("ID", memFiles[`ID2_${shareholderId}`]);
          }

          formData.append("ADDRESS", memFiles[`ADDRESS_${shareholderId}`]);
          formData.append("subType", "SHAREHOLDER");

          return dispatch(
            uploadDocsStart({
              clientId: props.clientId,
              formData,
            })
          );
        });

        await Promise.all(uploadPromises);
      }
    } catch (error) { }
  };

  const resetForm = () => {
    setMemFiles({});
    refForm.current.reset();
  };
  useEffect(() => {
    if (props.clear > 0) {
      resetForm();
    }
  }, [props.clear]);

  const [showKYC, setShowKYC] = React.useState(true);
  const [noPerson, setNoPerson] = React.useState(true);

  useEffect(() => {
    if (allShareholdersAddressesApproved && allShareholdersIdsApproved) {
      setShowKYC(false);
    }
  }, [allShareholdersAddressesApproved, allShareholdersIdsApproved]);

  useEffect(() => {
    if (props.clientDetails.corporateInfo.shareholders?.length > 0) {
      setNoPerson(false);
    } else {
      setNoPerson(true);
    }
  }, [props.clientDetails]);


  useEffect(() => {
    const shareholderIds = props.clientDetails?.corporateInfo?.shareholders?.map(shareholder => shareholder._id) || [];
    const shareholderIdsFound = documents
      .filter(x => x.type === "ID" && x.subType === "SHAREHOLDER" && x.status === "APPROVED" && shareholderIds.includes(x.shareholderId))
      .map(x => x.shareholderId);
    setAllShareholdersIdsApproved(shareholderIdsFound.length === shareholderIds.length);
    setApprovedShareholderIds(shareholderIdsFound);

    const shareholderAddressesApproved = documents
      .filter(x => x.type === "ADDRESS" && x.subType === "SHAREHOLDER" && x.status === "APPROVED" && shareholderIds.includes(x.shareholderId))
      .map(x => x.shareholderId);
    setAllShareholdersAddressesApproved(shareholderAddressesApproved.length === shareholderIds.length);
    setApprovedShareholderAddresses(shareholderAddressesApproved);
  }, [documents, props.clientDetails]);

  const validateFile = (value, ctx, input, cb) => {
    const extensions = ["png", "jpg", "jpeg", "pdf"];
    const possibleExtensions = value.split(".");
    const extension = value.split(".")[possibleExtensions.length - 1];
    if (extensions.includes(extension) || !value) {
      if (!value || memFiles[input.props.name]?.size <= 2097152) {
        cb(true);
      } else cb("2mb maximum size");
    } else cb("Only images or PDF can be uploaded");
  };

  return (
    <React.Fragment>
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
            <CardHeader className="d-flex gap-3">
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle className="color-primary">{t("Shareholders Documents")}</CardTitle>
              </div>
            </CardHeader>
            <CardBody className="d-flex flex-column justify-content-center align-items-center">
              {noPerson && <h2>No Shareholders</h2>}
              {showKYC && !noPerson &&
                <>
                  {props.clientDetails?.corporateInfo?.shareholders?.map((shareholder) => (
                    <React.Fragment key={shareholder._id}>
                      <Row className="align-self-start fw-bold fs-5 my-1">
                        <Col>
                          {shareholder.firstName + " " + shareholder.lastName}
                        </Col>
                      </Row>
                      <Row key={shareholder._id}>
                        <Col md="6">
                          <AvField
                            tag={Input}
                            className="form-control"
                            name={`ID1_${shareholder._id}`}
                            label={t("Proof of ID - Front Side")}
                            type="file"
                            disabled={ApprovedShareholderIds.includes(shareholder._id)}
                            onChange={(e) => { addFile(`ID1_${shareholder._id}`, e.target.files[0]) }}
                            validate={{
                              custom: validateFile
                            }}
                          />
                        </Col>
                        <Col md="6">
                          <AvField
                            tag={Input}
                            className="form-control"
                            id="Proof_of_ID_front_side"
                            name={`ID2_${shareholder._id}`}
                            label={t("Proof of ID - Back Side")}
                            type="file"
                            disabled={ApprovedShareholderIds.includes(shareholder._id)}
                            onChange={(e) => { addFile(`ID2_${shareholder._id}`, e.target.files[0]) }}
                            validate={{
                              custom: validateFile
                            }}
                          />
                        </Col>
                        <Col md="6">
                          <AvField
                            tag={Input}
                            className="form-control"
                            id="Proof_of_ID_front_side"
                            name={`ADDRESS_${shareholder._id}`}
                            label={t("Proof of Address")}
                            type="file"
                            disabled={approvedShareholderAddresses.includes(shareholder._id)}
                            onChange={(e) => { addFile(`ADDRESS_${shareholder._id}`, e.target.files[0]) }}
                            validate={{
                              custom: validateFile
                            }}
                          />
                        </Col>
                      </Row>
                    </React.Fragment>
                  ))}
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
                </>
              }
              {!showKYC && !noPerson && <h2>Documents Approved</h2>}
            </CardBody>
          </Card>
        </Row>
      </AvForm>
    </React.Fragment >);
}


function UploadAdditionalDocs(props) {
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

  useEffect(() => {
    if (props.clear > 0) {
      resetForm();
    }
  }, [props.clear]);

  const uploadDoc = async () => {
    try {
      if (Object.keys(memFiles).length > 0) {
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


  const validateFile = (value, ctx, input, cb) => {
    const extensions = ["png", "jpg", "jpeg", "pdf"];
    const possibleExtensions = value.split(".");
    const extension = value.split(".")[possibleExtensions.length - 1];
    if (extensions.includes(extension) || !value) {
      if (!value || memFiles[input.props.name]?.size <= 2097152) {
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
              <CardTitle className="color-primary">{t("Additional Documents")}</CardTitle>
            </div>
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <AvField
                  tag={Input}
                  className="form-control"
                  onChange={(e) => { addFile("ADDITIONAL_DOCUMENTS", e.target.files[0]) }}
                  name={"ADDITIONAL_DOCUMENTS"}
                  type="file"
                  validate={{
                    custom: validateFile
                  }}
                />
              </Col>
              <Col md="2">
                <Button disabled={props.uploading} type="submit" color="primary">
                  {t("Upload")}
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Row>
    </AvForm>
  </React.Fragment>);
}

function CorpDocuments(props) {

  // const [docType, setDocType] = React.useState(options[0]);

  return (
    <React.Fragment>
      <Row>
        <Col md={6}>
          <UploadCorpKYC {...props} />
        </Col>
        <Col md={6}>
          <UploadAuthKYC {...props} />
        </Col>
        <Col md={6}>
          <UploadShareholdersKYC {...props} />
        </Col>
        <Col md={6}>
          <UploadAdditionalDocs {...props} />
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

export default connect(mapStateToProps, null)(CorpDocuments);