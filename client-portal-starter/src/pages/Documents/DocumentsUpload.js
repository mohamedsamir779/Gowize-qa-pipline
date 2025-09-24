import React, {
  useState, useEffect, useRef
} from "react";
import { useDispatch, connect } from "react-redux";
import {
  Button,
  Col,
  Container,
  Row,
  Form as ReactStrapForm,
  Label,
  Input,
  FormGroup,
  Spinner
} from "reactstrap";
import { 
  Formik, 
  Form as FormikForm 
} from "formik";
import * as Yup from "yup";

//i18n
import { withTranslation } from "react-i18next";
import CardWrapper from "../../components/Common/CardWrapper";
import { uploadDocsStart } from "../../store/general/documents/actions";
import { COUNTRIES } from "../../helpers/countries";

function DocumentUpload(props) {
  const dispatch = useDispatch();
  const frontSideRef = useRef();
  const backSideRef = useRef();
  const requiredPassportRef = useRef();
  const optionalPassportRef = useRef();
  const additionalRef = useRef();
  const addressRef = useRef();
  const documentNumberRef = useRef();
  const issueDateRef = useRef();
  const expiryDateRef = useRef();
  const [memFiles, setMemFiles] = useState({});
  const [idUploaded, setIdUploaded] = 
  useState(props.documents?.find((x) => (x.type === "ID" && x.status === "APPROVED")) ? true : false);
  const [addressUploaded, setAddressUploaded] = 
  useState(props.documents?.find((x) => (x.type === "ADDRESS" && x.status === "APPROVED")) ? true : false);
  const [option, setOption] = useState([]);
  const [firstSelect, setFirstSelect] = useState(option[0]);
  const [secondSelect, setSecondSelect] = useState("ID");
  
  const initialValues = {
    typeOfDocument: "",
    proofOfId: "ID",
    countryOfIssue: "None"
  };

  // max file size to uplaod = 2 MB
  const maxFileSize = 5;
  const acceptedExtensions = ["image/jpeg", "image/png", "application/pdf"];
  const fileSizeError = "File is too large, It has to be 5MB at most";
  const fileExtensionError = "Only accepts files with the following extensions *jpg, *png, *pdf";

  const addFile = (name, files) => {
    if ((files?.size / 1000000) <= maxFileSize){
      setMemFiles({
        ...memFiles,
        [name]: files,
      });
    }
  };

  const validationSchema = Yup.object().shape({
    frontSideId: Yup.mixed().test("fileSize", fileSizeError, (value) => {
      if (value){
        return value && (value?.size / 1000000) <= maxFileSize;
      } else {
        return true;
      }
    }).test("fileExtension", fileExtensionError, (value) => {
      if (value){
        return acceptedExtensions.includes(value.type);
      } else {
        return true;
      }
    }).when("typeOfDocument", {
      is: "ID",
      then: Yup.mixed().required("Front side id is required")
    }),

    backSideId: Yup.mixed().test("fileSize", fileSizeError, (value) => {
      if (value){
        return value && (value?.size / 1000000) <= maxFileSize;
      } else {
        return true;
      }
    }).test("fileExtension", fileExtensionError, (value) => {
      if (value){
        return acceptedExtensions.includes(value.type);
      } else {
        return true;
      }
    }).when("typeOfDocument", {
      is: "ID",
      then: Yup.mixed().required("Back side id is required")
    }),

    proofOfPassport: Yup.mixed().test("fileSize", fileSizeError, (value) => {
      if (value){
        return value && (value?.size / 1000000) <= maxFileSize;
      } else {
        return true;
      }
    }).test("fileExtension", fileExtensionError, (value) => {
      if (value){
        return acceptedExtensions.includes(value.type);
      } else {
        return true;
      }
    }).when("proofOfId", {
      is: "Passport",
      then: Yup.mixed().required("Passport is required")
    }),

    proofOfPassportOptional: Yup.mixed().test("fileSize", fileSizeError, (value) => {      
      if (value){
        return value && (value?.size / 1000000) <= maxFileSize;
      } else {
        return true;
      }
    }).test("fileExtension", fileExtensionError, (value) => {
      if (value){
        return acceptedExtensions.includes(value.type);
      } else {
        return true;
      }
    }),

    proofOfAddress: Yup.mixed().test("fileSize", fileSizeError, (value) => {
      if (value){
        return value && (value?.size / 1000000) <= maxFileSize;
      } else {
        return true;
      }
    }).test("fileExtension", fileExtensionError, (value) => {
      if (value){
        return acceptedExtensions.includes(value.type);
      } else {
        return true;
      }
    }).when("typeOfDocument", {
      is: "Proof of address",
      then: Yup.mixed().required("Proof Of Address is required")
    }),

    Additional: Yup.mixed().test("fileSize", fileSizeError, (value) => {
      if (value){
        return value && (value?.size / 1000000) <= maxFileSize;
      } else {
        return true;
      }
    }).test("fileExtension", fileExtensionError, (value) => {
      if (value){
        return acceptedExtensions.includes(value.type);
      } else {
        return true;
      }
    }).when("typeOfDocument", {
      is: "Additional",
      then: Yup.mixed().required("Additional file is required")
    }),

    documentNumber: Yup.number().typeError("Document number must be a number"),

    dateOfIssue: Yup.date().max(new Date()),

    dateOfExpiry: Yup.date().min(Date(issueDateRef?.current?.value))
  });

  useEffect(() => {
    if (props.documents?.length > 0) {
      const { documents } = props;
      const idFound = documents.find((x) => (x.type === "ID" && x.status === "APPROVED"));
      const addressFound = documents.find((x) => (x.type === "ADDRESS" && x.status === "APPROVED"));
      if (idFound) setIdUploaded(true);
      if (addressFound) setAddressUploaded(true);
    }

  }, [props.documents, props.documents.map((item) => (item.status))]);

  const uploadDoc = async () => {
    try {
      var formData = new FormData();
      if (firstSelect === "Proof of ID") {
        formData.append("type", "ID");
        formData.append("images", memFiles["ID1"]);
        if (memFiles["ID2"]) {
          formData.append("images", memFiles["ID2"]);
        }
      } else if (firstSelect === "Proof of address") {
        formData.append("type", "ADDRESS");
        formData.append("images", memFiles["ADDRESS"]);
      } else if (firstSelect === "Additional") {
        formData.append("type", "ADDITIONAL_DOCUMENTS");
        formData.append("images", memFiles["ADDITIONAL_DOCUMENTS"]);
      }

      dispatch(uploadDocsStart(formData));
    } catch (error) {
    }
  };

  const secondSelectChangeHandler = (e) => {
    let value = e.target.value;
    setSecondSelect(value);
  };

  const resetForm = () => {
    setMemFiles({});
    addressRef.current ? addressRef.current.value = "" : addressRef.current = "";
    frontSideRef.current ? frontSideRef.current.value = "" : frontSideRef.current = "";
    backSideRef.current ? backSideRef.current.value = "" : backSideRef.current = "";
    requiredPassportRef.current ? requiredPassportRef.current.value = "" : requiredPassportRef.current = "";
    optionalPassportRef.current ? optionalPassportRef.current.value = "" : optionalPassportRef.current = "";
    additionalRef.current ? additionalRef.current.value = "" : additionalRef.current = "";
    documentNumberRef.current ? documentNumberRef.current.value = "" : documentNumberRef.current = "";
    issueDateRef.current ? issueDateRef.current.value = "" : issueDateRef.current = "";
    expiryDateRef.current ? expiryDateRef.current.value = "" : expiryDateRef.current = "";
  };

  useEffect(() => {
    const testArray = [
      !idUploaded && "Proof of ID",
      !addressUploaded && "Proof of address",
      "Additional"
    ];
    const newOptions = testArray.filter((option) => option !== false);
    setOption(newOptions);
    setFirstSelect(newOptions[0]);

  }, [idUploaded, addressUploaded]);

  return (
    <Container>
      <Row>
        <Col lg={9}>
          <CardWrapper className="h-100 glass-card shadow">
            <Container>
              <Formik
                validationSchema={validationSchema}
                initialValues={initialValues}
                onSubmit={(values) => {
                  if (values.countryOfIssue === "None") {
                    delete values.countryOfIssue;
                  }
                  delete values.typeOfDocument;
                  delete values.proofOfId;
                  delete values.proofOfPassport;
                  delete values.proofOfAddress;
                  delete values.Additional;
                  delete values.proofOfPassportOptional;
                  uploadDoc(values);
                  resetForm();
                }}
              >
                {({ errors, touched, values, setFieldValue }) => (
                  <ReactStrapForm
                    tag={FormikForm}
                  >
                    <Row>
                      <Col xs={12} lg={6}>
                        <Label 
                          className="form-label" 
                          for="typeOfDocument"
                        >
                          {props.t("Type of document")}
                        </Label>
                        <Input
                          className="form-select form-select-lg"
                          required={true}
                          onChange={(e) => {
                            setFirstSelect(e.target.value);
                            setFieldValue("typeOfDocument", e.target.value);
                            // eslint-disable-next-line
                            if (e.target.value === "Additional" || "Proof of address") {
                              setFieldValue("proofOfId", "");
                              setSecondSelect("ID");
                            }
                          }}
                          id="typeOfDocument"
                          type="select"
                          name="typeOfDocument"
                          value={firstSelect}
                        >
                          {
                            !idUploaded &&
                            <option value="Proof of ID">{props.t("Proof of ID")}</option>
                          }
                          {
                            !addressUploaded &&
                            <option value="Proof of address">{props.t("Proof of Address Front Side")}</option>
                          }
                          <option value="Additional">{props.t("Proof of Address Back Side")}</option>
                        </Input>
                      </Col>
                      {
                        firstSelect === "Proof of ID" && 
                        !idUploaded &&
                        <Col xs={12} lg={6}>
                          <Label className="form-label" for="proofOfId">{props.t("Proof of ID")}</Label>
                          <Input
                            className="form-select form-select-lg"
                            required={firstSelect === "Proof of ID" && true}
                            onChange={(e) => {
                              secondSelectChangeHandler(e);
                              setFieldValue("proofOfId", e.target.value);
                            }}
                            id="proofOfId"
                            type="select"
                            name="proofOfId"
                          >
                            <option value="ID">{props.t("ID")}</option>
                            <option value="Passport">{props.t("Passport")}</option>
                          </Input>
                        </Col>
                      }
                      {
                        firstSelect === "Proof of address" && 
                        !addressUploaded &&
                        <Col xs={12} lg={6}>
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="proofOfAddress">
                              {props.t("Proof of Address")}
                            </Label>
                            <Input
                              type="file"
                              className="form-control form-control-lg"
                              id="proofOfAddress"
                              onChange={(e) => {
                                addFile("ADDRESS", e.target.files[0]);
                                setFieldValue("proofOfAddress", e.target.files[0]);
                              }}
                              name="proofOfAddress"
                              innerRef={addressRef}
                              invalid={errors.proofOfAddress && touched.proofOfAddress}
                            />
                            {
                              errors?.proofOfAddress &&
                              touched.proofOfAddress &&
                              <label
                                style={
                                  {
                                    "color": "red",
                                  }
                                }
                              >
                                {errors.proofOfAddress}
                              </label>
                            }
                          </div>
                        </Col>
                      }
                      {
                        firstSelect === "Additional" &&
                        <Col xs={12} lg={6}>
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="Additional">
                              {props.t("Additional document")}
                            </Label>
                            <Input
                              
                              type="file"
                              className="form-control form-control-lg"
                              id="Additional"
                              onChange={(e) => {
                                addFile("ADDITIONAL_DOCUMENTS", e.target.files[0]);
                                setFieldValue("Additional", e.target.files[0]);
                              }}
                              name="Additional"
                              innerRef={additionalRef}
                              invalid={errors.Additional && touched.Additional}
                            />
                            {
                              errors?.Additional &&
                              touched.Additional &&
                              <label
                                style={
                                  {
                                    "color": "red",
                                  }
                                }
                              >
                                {errors.Additional}
                              </label>
                            }
                          </div>
                        </Col>
                      }
                      {
                        <div className="mt-4">
                          {
                            firstSelect === "Proof of ID" &&
                            secondSelect === "ID" && 
                            !idUploaded &&
                            <Row>
                              <Col xs={12} lg={6}>
                                <div className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label" htmlFor="frontSideId">{props.t("Proof of ID front side")}</Label>
                                    <Input
                                      
                                      innerRef={frontSideRef}
                                      type="file"
                                      className="form-control"
                                      id="frontSideId"
                                      onChange={(e) => {
                                        addFile("ID1", e.target.files[0]);
                                        setFieldValue("frontSideId", e.target.files[0]);
                                      }}
                                      name="frontSideId"
                                      invalid={errors.frontSideId && touched.frontSideId}
                                      disabled={idUploaded}
                                    />
                                    {
                                      errors?.frontSideId &&
                                      touched.frontSideId &&
                                      <label
                                        style={
                                          {
                                            "color": "red",
                                          }
                                        }
                                      >
                                        {errors.frontSideId}
                                      </label>
                                    }
                                  </FormGroup>
                                </div>
                              </Col>
                              <Col xs={12} lg={6}>
                                <div className="mb-3">
                                  <Label className="form-label" htmlFor="backSideId">{
                                    props.t("Proof of ID back side")}
                                  </Label>
                                  <Input
                                    
                                    innerRef={backSideRef}
                                    type="file"
                                    className="form-control"
                                    id="backSideId"
                                    onChange={(e) => {
                                      addFile("ID2", e.target.files[0]);
                                      setFieldValue("backSideId", e.target.files[0]);
                                    }}
                                    name="backSideId"
                                    invalid={errors.backSideId && touched.backSideId}
                                  />
                                  {
                                    errors?.backSideId &&
                                    touched.backSideId &&
                                    <label
                                      style={
                                        {
                                          "color": "red",
                                        }
                                      }
                                    >
                                      {errors.backSideId}
                                    </label>
                                  }
                                </div>
                              </Col>
                            </Row>
                          }
                          {
                            firstSelect === "Proof of ID" && 
                            secondSelect === "Passport" && 
                            !idUploaded &&
                            <Row>
                              <Col xs={12} lg={6}>
                                <div className="mb-3">
                                  <FormGroup>
                                    <Label className="form-label" htmlFor="proofOfPassport">
                                      {props.t("Proof of Passport")} ({props.t("Required")})
                                    </Label>
                                    <Input
                                      
                                      type="file"
                                      className="form-control"
                                      id="proofOfPassport"
                                      onChange={(e) => {
                                        addFile("ID1", e.target.files[0]);
                                        setFieldValue("proofOfPassport", e.target.files[0]);
                                      }}
                                      name="proofOfPassport"
                                      innerRef={requiredPassportRef}
                                      invalid={errors.proofOfPassport && touched.proofOfPassport}
                                    />
                                    {
                                      errors?.proofOfPassport &&  
                                      touched.proofOfPassport &&
                                      <label
                                        style={
                                          {
                                            "color": "red",
                                          }
                                        }
                                      >
                                        {errors.proofOfPassport}
                                      </label>
                                    }
                                  </FormGroup>
                                </div>
                              </Col>
                              <Col xs={12} lg={6}>
                                <div className="mb-3">
                                  <Label className="form-label" htmlFor="proofOfPassportOptional">
                                    {props.t("Proof of Passport")} ({props.t("Optional")})
                                  </Label>
                                  <Input
                                    type="file"
                                    className="form-control"
                                    id="proofOfPassportOptional"
                                    onChange={(e) => {
                                      addFile("ID2", e.target.files[0]);
                                      setFieldValue("proofOfPassportOptional", e.target.files[0]);
                                    }}
                                    name="proofOfPassportOptional"
                                    innerRef={optionalPassportRef}
                                    invalid={errors.proofOfPassportOptional && touched.proofOfPassportOptional}
                                  />
                                  {
                                    errors?.proofOfPassportOptional &&
                                    touched.proofOfPassportOptional &&
                                    <label
                                      style={
                                        {
                                          "color": "red",
                                        }
                                      }
                                    >
                                      {errors.proofOfPassportOptional}
                                    </label>
                                  }
                                </div>
                              </Col>
                            </Row>
                          }
                        </div>
                      }
                    </Row>
                    <div>
                    </div>
                    {
                      firstSelect === "Proof of ID" &&
                      <>
                        <p className="mt-3 mb-4">
                          <span className="fw-bold">
                            {props.t("Fill in your details for a seamless experience")}
                          </span> ({props.t("Optional")})
                        </p>
                        <Row>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label className="form-label" htmlFor="documentNumber">
                                {props.t("Document Number")}
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="documentNumber"
                                name="documentNumber"
                                placeholder={props.t("Enter Document Number (optional)")}
                                innerRef={documentNumberRef}
                                onKeyPress={(e) => {
                                  if (!isNaN(e.key) && e.target.value.length > 0){
                                    return true;
                                  }
                                  if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label className="form-label" htmlFor="countryOfIssue">{props.t("Country of Issue")}</Label>
                              <Input
                                type="select"
                                className="form-select"
                                id="countryOfIssue"
                                name="countryOfIssue"
                                value={values.countryOfIssue}
                                onChange={(e) => { setFieldValue("countryOfIssue", e.target.value) }}>
                                <option value="None" disabled selected hidden>{props.t("Select Country (Optional)")}</option>
                                {COUNTRIES.map((country, key) => {
                                  return <option key={key} value={country.countryEn}>{country.countryEn}</option>;
                                })}
                              </Input>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label htmlFor="dateOfIssue" className="form-label">{props.t("Date of Issue")}</Label>
                              <Input
                                className="form-control"
                                type="date"
                                defaultValue="mm/dd/yy"
                                id="dateOfIssue"
                                name="dateOfIssue"
                                innerRef={issueDateRef}
                                max={new Date().toISOString().split("T")[0]}
                                onChange={(e) => { setFieldValue("dateOfIssue", e.target.value) }}
                              />
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label htmlFor="dateOfExpiry" className="form-label">{props.t("Date Of Expiry")}</Label>
                              <Input
                                disabled={!values.dateOfIssue}
                                className="form-control"
                                type="date"
                                defaultValue="mm/dd/yy"
                                id="dateOfExpiry"
                                name="dateOfExpiry"
                                innerRef={expiryDateRef}
                                onChange={(e) => { setFieldValue("dateOfExpiry", e.target.value) }}
                                min={values.dateOfIssue}
                              />
                            </div>
                          </Col>
                        </Row>
                      </>
                    }
                    <div className="text-end">
                      <Button
                        className="border-0 color-bg-btn w-lg"
                        type="submit"
                        disabled={
                          // proof of ID + ID 
                          firstSelect === "Proof of ID" && 
                          secondSelect === "ID" &&
                          !frontSideRef.current?.value
                          ||
                          firstSelect === "Proof of ID" && 
                          secondSelect === "ID" &&
                          !backSideRef.current?.value
                          ||
                          // proof of ID + passport
                          firstSelect === "Proof of ID" && 
                          secondSelect === "Passport" &&
                          !requiredPassportRef.current?.value 
                          || 
                          // proof of address
                          firstSelect === "Proof of address" && 
                          !addressRef.current?.value
                          ||
                          // additional documents
                          firstSelect === "Additional" &&
                          !additionalRef.current?.value
                          ||
                          props.uploading
                        }
                      >
                        {
                          props.uploading && props.uploadClear === 0
                            ?
                            <Spinner />
                            :
                            props.t("Submit")
                        }
                      </Button>
                    </div>
                    <div className="text-muted">
                      ({props.t("Maximum size of document 5MB")}) {props.t("Allow File Formats")} *jpg, *png, *pdf
                    </div>
                  </ReactStrapForm>
                )}

              </Formik>
            </Container>
          </CardWrapper>
        </Col>
        <Col lg={3}>
          <CardWrapper className="h-100 glass-card shadow">
            <div className="kyc-requirements">
              <p className="text-center fw-bold color-primary">
                {props.t("KYC Requirements")}
              </p>
              <div className="mt-4 proofs-container w-100">
                <button
                  className="btn text-start py-3 border-bottom w-100 border"
                  style={{
                    boxShadow: idUploaded ? "inset 0 4px 8px 0 rgb(0 0 0 / 0.1)" : "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    cursor: idUploaded ? "not-allowed" : "pointer"
                  }} 
                  disabled={props.documents?.find((x) => (x.type === "ID")) ? true : false}
                  onClick={() => (setFirstSelect("Proof of ID"))}
                >
                  <i className="mdi mdi-file-document-multiple me-3" />
                  {props.t("Proof of ID")}
                </button>
                <button
                  className="btn text-start py-3 w-100 border mt-3" 
                  disabled={props.documents?.find((x) => (x.type === "ADDRESS")) ? true : false}
                  onClick={() => (setFirstSelect("Proof of address"))}
                  style={{
                    boxShadow: addressUploaded ? "inset 0 4px 8px 0 rgb(0 0 0 / 0.1)" : "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    cursor: addressUploaded ? "not-allowed" : "pointer"
                  }} 
                >
                  <i className="mdi mdi-file-document-multiple me-3" />
                  {props.t("Proof of Address")}
                </button>
              </div>
            </div>
          </CardWrapper>
        </Col>
      </Row>
    </Container >
  );
}

const mapStateToProps = (state) => ({
  uploadClear: state.documents.uploadClear,
  documents: state.documents.documents,
  uploading: state.documents.uploading,
  uploadError: state.documents.uploadError,
  uploadSuccessMessage: state.documents.uploadSuccessMessage
});

export default connect(mapStateToProps, null)(withTranslation()(DocumentUpload)); 