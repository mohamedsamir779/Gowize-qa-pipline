import React, {
  useState, useEffect, useRef, Fragment
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

function DocumentCorpUpload(props) {
  const dispatch = useDispatch();
  const memorandum = useRef();
  const corpAddressRef = useRef();
  const certificateRef = useRef();
  const addressRef = useRef();
  const frontSideRef = useRef();
  const backSideRef = useRef();
  const requiredPassportRef = useRef();
  const optionalPassportRef = useRef();
  const additionalRef = useRef();
  const documentNumberRef = useRef();
  const issueDateRef = useRef();
  const expiryDateRef = useRef();
  const [memFiles, setMemFiles] = useState({});
  const [memorandumUploaded, setMemorandumUploaded] = useState(false);
  const [corpAddressUploaded, setCorpAddressUploaded] = useState(false);
  const [certificateUploaded, setCertificateUploaded] = useState(false);
  const [authAddressUploaded, setAuthAddressUploaded] = useState(false);
  const [authIdUploaded, setAuthIdUploaded] = useState(false);
  const [option, setOption] = useState([]);
  const [docType, setDocType] = useState(option[0]);
  const [secondSelect, setSecondSelect] = useState("ID");
  const [personnel, setPersonnel] = useState("");
  const [shareholderId, setShareholderId] = useState("");
  const [uploadedShareholderIds, setUploadedShareholderIds] = useState([]);
  const [allShareholdersIdsUploaded, setAllShareholdersIdsUploaded] = useState(false);
  const [uploadedShareholderAddresses, setUploadedShareholderAddresses] = useState([]);
  const [allShareholdersAddressesUploaded, setAllShareholdersAddressesUploaded] = useState(false);

  const initialValues = {
    typeOfDocument: "",
    proofOfId: "ID",
  };

  // max file size to uplaod = 5 MB
  const maxFileSize = 5;
  const acceptedExtensions = ["image/jpeg", "image/png", "application/pdf"];
  const fileSizeError = "File is too large, It has to be 5MB at most";
  const fileExtensionError = "Only accepts files with the following extensions *jpg, *png, *pdf";

  const addFile = (name, files) => {
    if ((files?.size / 1000000) <= maxFileSize) {
      setMemFiles({
        ...memFiles,
        [name]: files,
      });
    }
  };

  const validationSchema = Yup.object().shape({
    memorandum: Yup.mixed().test("fileSize", fileSizeError, (value) => {
      if (value) {
        return value && (value?.size / 1000000) <= maxFileSize;
      } else {
        return true;
      }
    }).test("fileExtension", fileExtensionError, (value) => {
      if (value) {
        return acceptedExtensions.includes(value.type);
      } else {
        return true;
      }
    }).when("typeOfDocument", {
      is: "memorandum",
      then: Yup.mixed().required("Memorandum of Association is required")
    }),

    corpAddress: Yup.mixed().test("fileSize", fileSizeError, (value) => {
      if (value) {
        return value && (value?.size / 1000000) <= maxFileSize;
      } else {
        return true;
      }
    }).test("fileExtension", fileExtensionError, (value) => {
      if (value) {
        return acceptedExtensions.includes(value.type);
      } else {
        return true;
      }
    }).when("typeOfDocument", {
      is: "corpAddress",
      then: Yup.mixed().required("Corporate Address is required")
    }),

    certificate: Yup.mixed().test("fileSize", fileSizeError, (value) => {
      if (value) {
        return value && (value?.size / 1000000) <= maxFileSize;
      } else {
        return true;
      }
    }).test("fileExtension", fileExtensionError, (value) => {
      if (value) {
        return acceptedExtensions.includes(value.type);
      } else {
        return true;
      }
    }).when("typeOfDocument", {
      is: "certificate",
      then: Yup.mixed().required("Certificate of Incorporation is required")
    }),

    frontSideId: Yup.mixed().test("fileSize", fileSizeError, (value) => {
      if (value) {
        return value && (value?.size / 1000000) <= maxFileSize;
      } else {
        return true;
      }
    }).test("fileExtension", fileExtensionError, (value) => {
      if (value) {
        return acceptedExtensions.includes(value.type);
      } else {
        return true;
      }
    }).when("typeOfDocument", {
      is: "ID",
      then: Yup.mixed().required("Front side id is required")
    }),

    backSideId: Yup.mixed().test("fileSize", fileSizeError, (value) => {
      if (value) {
        return value && (value?.size / 1000000) <= maxFileSize;
      } else {
        return true;
      }
    }).test("fileExtension", fileExtensionError, (value) => {
      if (value) {
        return acceptedExtensions.includes(value.type);
      } else {
        return true;
      }
    }).when("typeOfDocument", {
      is: "ID",
      then: Yup.mixed().required("Back side id is required")
    }),

    address: Yup.mixed().test("fileSize", fileSizeError, (value) => {
      if (value) {
        return value && (value?.size / 1000000) <= maxFileSize;
      } else {
        return true;
      }
    }).test("fileExtension", fileExtensionError, (value) => {
      if (value) {
        return acceptedExtensions.includes(value.type);
      } else {
        return true;
      }
    }).when("typeOfDocument", {
      is: "address",
      then: Yup.mixed().required("Address is required")
    }),


    proofOfPassport: Yup.mixed().test("fileSize", fileSizeError, (value) => {
      if (value) {
        return value && (value?.size / 1000000) <= maxFileSize;
      } else {
        return true;
      }
    }).test("fileExtension", fileExtensionError, (value) => {
      if (value) {
        return acceptedExtensions.includes(value.type);
      } else {
        return true;
      }
    }).when("proofOfId", {
      is: "Passport",
      then: Yup.mixed().required("Passport is required")
    }),

    proofOfPassportOptional: Yup.mixed().test("fileSize", fileSizeError, (value) => {
      if (value) {
        return value && (value?.size / 1000000) <= maxFileSize;
      } else {
        return true;
      }
    }).test("fileExtension", fileExtensionError, (value) => {
      if (value) {
        return acceptedExtensions.includes(value.type);
      } else {
        return true;
      }
    }),

    Additional: Yup.mixed().test("fileSize", fileSizeError, (value) => {
      if (value) {
        return value && (value?.size / 1000000) <= maxFileSize;
      } else {
        return true;
      }
    }).test("fileExtension", fileExtensionError, (value) => {
      if (value) {
        return acceptedExtensions.includes(value.type);
      } else {
        return true;
      }
    }).when("typeOfDocument", {
      is: "Additional",
      then: Yup.mixed().required("Additional file is required")
    }),
  });

  useEffect(() => {
    if (props.documents?.length > 0) {
      const { documents } = props;
      const memorandumFound = documents.find((x) => (x.type === "MEMORANDUM" && x.status === "APPROVED"));
      const corpAddressFound = documents.find((x) => (x.type === "CORPORATE_ADDRESS" && x.status === "APPROVED"));
      const certificateFound = documents.find((x) => (x.type === "CERTIFICATE_OF_INCORPORATION" && x.status === "APPROVED"));
      const authIdFound = documents.find((x) => (x.type === "ID" && x.subType === "AUTHORIZED_PERSON" && x.status === "APPROVED"));
      const authAddressFound = documents.find((x) => (x.type === "ADDRESS" && x.subType === "AUTHORIZED_PERSON" && x.status === "APPROVED"));
      if (memorandumFound) setMemorandumUploaded(true);
      if (corpAddressFound) setCorpAddressUploaded(true);
      if (certificateFound) setCertificateUploaded(true);
      if (authIdFound) setAuthIdUploaded(true);
      if (authAddressFound) setAuthAddressUploaded(true);
    }
  }, [props.documents, props.documents.map((item) => (item.status))]);

  useEffect(() => {
    if (props.documents?.length > 0) {
      const { documents } = props;

      const shareholderIds = props.clientData?.corporateInfo?.shareholders?.map(shareholder => shareholder._id) || [];
      const shareholderIdsFound = documents
        .filter(x => x.type === "ID" && x.subType === "SHAREHOLDER" && x.status === "APPROVED" && shareholderIds.includes(x.shareholderId))
        .map(x => x.shareholderId);
      setAllShareholdersIdsUploaded(shareholderIdsFound.length === shareholderIds.length);
      setUploadedShareholderIds(shareholderIdsFound);

      const shareholderAddresses = props.clientData?.corporateInfo?.shareholders?.map(shareholder => shareholder._id) || [];
      const shareholderAddressesFound = documents
        .filter(x => x.type === "ADDRESS" && x.subType === "SHAREHOLDER" && x.status === "APPROVED" && shareholderIds.includes(x.shareholderId))
        .map(x => x.shareholderId);
      setAllShareholdersAddressesUploaded(shareholderAddressesFound.length === shareholderAddresses.length);
      setUploadedShareholderAddresses(shareholderAddressesFound);
    }
  }, [props.documents, props.clientData]);

  const uploadDoc = async () => {
    try {
      var formData = new FormData();
      switch (docType) {
        case "memorandum":
          formData.append("type", "MEMORANDUM"); // type saved in db
          formData.append("images", memFiles["MEMORANDUM"]);
          break;
        case "corpAddress":
          formData.append("type", "CORPORATE_ADDRESS");
          formData.append("images", memFiles["CORPORATE_ADDRESS"]);
          break;
        case "certificate":
          formData.append("type", "CERTIFICATE_OF_INCORPORATION");
          formData.append("images", memFiles["CERTIFICATE"]);
          break;
        case "ID":
          formData.append("type", "ID");
          formData.append("images", memFiles["ID1"]);
          formData.append("subType", personnel);
          if (personnel === "SHAREHOLDER") {
            formData.append("shareholderId", shareholderId);
          }
          if (memFiles["ID2"]) {
            formData.append("images", memFiles["ID2"]);
          }
          break;
        case "address":
          formData.append("type", "ADDRESS");
          formData.append("subType", personnel);
          if (personnel === "SHAREHOLDER") {
            formData.append("shareholderId", shareholderId);
          }
          formData.append("images", memFiles["ADDRESS"]);
          break;
        case "Additional":
          formData.append("type", "ADDITIONAL_DOCUMENTS");
          formData.append("images", memFiles["ADDITIONAL_DOCUMENTS"]);
          break;
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
    memorandum.current ? memorandum.current.value = "" : memorandum.current = "";
    corpAddressRef.current ? corpAddressRef.current.value = "" : corpAddressRef.current = "";
    certificateRef.current ? certificateRef.current.value = "" : certificateRef.current = "";
    frontSideRef.current ? frontSideRef.current.value = "" : frontSideRef.current = "";
    backSideRef.current ? backSideRef.current.value = "" : backSideRef.current = "";
    addressRef.current ? addressRef.current.value = "" : addressRef.current = "";
    requiredPassportRef.current ? requiredPassportRef.current.value = "" : requiredPassportRef.current = "";
    optionalPassportRef.current ? optionalPassportRef.current.value = "" : optionalPassportRef.current = "";
    additionalRef.current ? additionalRef.current.value = "" : additionalRef.current = "";
    documentNumberRef.current ? documentNumberRef.current.value = "" : documentNumberRef.current = "";
    issueDateRef.current ? issueDateRef.current.value = "" : issueDateRef.current = "";
    expiryDateRef.current ? expiryDateRef.current.value = "" : expiryDateRef.current = "";
  };

  useEffect(() => {
    const testArray = [
      !memorandumUploaded && "memorandum",
      !corpAddressUploaded && "corpAddress",
      !certificateUploaded && "certificate",
      // !authIdUploaded && "ID",
      "Additional"
    ];
    const newOptions = testArray.filter((option) => option !== false);
    setOption(newOptions);
    setDocType(newOptions[0]);

  }, [authIdUploaded, corpAddressUploaded, certificateUploaded, memorandumUploaded]);

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
                  delete values.memorandum;
                  delete values.corpAddress;
                  delete values.address;
                  delete values.certificate;
                  delete values.typeOfDocument;
                  delete values.proofOfId;
                  delete values.proofOfPassport;
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
                            setDocType(e.target.value);
                            setFieldValue("typeOfDocument", e.target.value);
                            // eslint-disable-next-line
                            if (e.target.value === "Additional" || "corpAddress") {
                              setFieldValue("proofOfId", "");
                              setSecondSelect("ID");
                            }
                          }}
                          id="typeOfDocument"
                          type="select"
                          name="typeOfDocument"
                          value={docType}
                        >
                          {!memorandumUploaded && <option value="memorandum">{props.t("Memorandum of Association")}</option>}
                          {!certificateUploaded && <option value="certificate">{props.t("Certificate of Incorporation")}</option>}
                          {!corpAddressUploaded && <option value="corpAddress">{props.t("Corporate Address")}</option>}
                          {(!authIdUploaded || !allShareholdersIdsUploaded) && <option value="ID">{props.t("Proof of ID")}</option>}
                          {(!authAddressUploaded || !allShareholdersAddressesUploaded) && <option value="address">{props.t("Proof of Address")}</option>}
                          <option value="Additional">Additional</option>
                        </Input>
                      </Col>
                      {
                        docType === "memorandum" &&
                        !memorandumUploaded &&
                        <Col xs={12} lg={6}>
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="memorandum">
                              {props.t("Memorandum of Association")}
                            </Label>
                            <Input
                              type="file"
                              className="form-control form-control-lg"
                              id="memorandum"
                              onChange={(e) => {
                                addFile("MEMORANDUM", e.target.files[0]);
                                setFieldValue("memorandum", e.target.files[0]);
                              }}
                              name="memorandum"
                              innerRef={memorandum}
                              invalid={errors.memorandum && touched.memorandum}
                            />
                            {
                              errors?.memorandum &&
                              touched.memorandum &&
                              <label style={{ "color": "red" }}>{errors.memorandum}</label>
                            }
                          </div>
                        </Col>
                      }
                      {
                        docType === "corpAddress" &&
                        !corpAddressUploaded &&
                        <Col xs={12} lg={6}>
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="corpAddress">
                              {props.t("Corporate Address")}
                            </Label>
                            <Input
                              type="file"
                              className="form-control form-control-lg"
                              id="corpAddress"
                              onChange={(e) => {
                                addFile("CORPORATE_ADDRESS", e.target.files[0]);
                                setFieldValue("corpAddress", e.target.files[0]);
                              }}
                              name="corpAddress"
                              innerRef={corpAddressRef}
                              invalid={errors.corpAddress && touched.corpAddress}
                            />
                            {
                              errors?.corpAddress &&
                              touched.corpAddress &&
                              <label style={{ "color": "red" }}>{errors.corpAddress}</label>
                            }
                          </div>
                        </Col>
                      }
                      {
                        docType === "certificate" &&
                        !certificateUploaded &&
                        <Col xs={12} lg={6}>
                          <div className="mb-3">
                            <Label className="form-label" htmlFor="certificate">
                              {props.t("Certificate of Incorporation")}
                            </Label>
                            <Input
                              type="file"
                              className="form-control form-control-lg"
                              id="certificate"
                              onChange={(e) => {
                                addFile("CERTIFICATE", e.target.files[0]);
                                setFieldValue("certificate", e.target.files[0]);
                              }}
                              name="certificate"
                              innerRef={certificateRef}
                              invalid={errors.certificate && touched.certificate}
                            />
                            {
                              errors?.certificate &&
                              touched.certificate &&
                              <label style={{ "color": "red" }}>{errors.certificate}</label>
                            }
                          </div>
                        </Col>
                      }
                      {
                        docType === "ID" &&
                        (!authIdUploaded ||
                          !allShareholdersIdsUploaded) &&
                        <>
                          <Col xs={12} lg={6}>
                            <Label className="form-label" for="proofOfId">{props.t("ID Type")}</Label>
                            <Input
                              className="form-select form-select-lg"
                              required={docType === "ID"}
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
                          <Col xs={12} lg={6}>
                            <Label className="form-label" for="personnel">{props.t("Personnel")}</Label>
                            <Input
                              className="form-select form-select-lg"
                              required={docType === "ID"}
                              onChange={(e) => {
                                setPersonnel(e.target.value);
                                setFieldValue("personnel", e.target.value);
                              }}
                              id="personnel"
                              type="select"
                              name="personnel"
                              value={personnel}
                            >
                              <option disabled value="">
                                {props.t("Select a Personnel")}
                              </option>
                              {!authIdUploaded && <option value="AUTHORIZED_PERSON">{props.t("Authorized Person")}</option>}
                              {!allShareholdersIdsUploaded && <option value="SHAREHOLDER">{props.t("Shareholder")}</option>}
                            </Input>
                            {
                              errors?.personnel &&
                              <label style={{ "color": "red" }}>{errors.personnel}</label>
                            }
                          </Col>
                          {
                            personnel === "SHAREHOLDER" &&
                            <Col xs={12} lg={6}>
                              <Label className="form-label" for="shareholder">{props.t("Shareholder")}</Label>
                              <Input
                                className="form-select form-select-lg"
                                required={docType === "ID"}
                                onChange={(e) => {
                                  setShareholderId(e.target.value);
                                  setFieldValue("shareholder", e.target.value);
                                }
                                }
                                id="shareholder"
                                type="select"
                                name="shareholder"
                                value={shareholderId}
                              >
                                <option disabled value="">
                                  {props.t("Select a shareholder")}
                                </option>
                                {
                                  props.clientData?.corporateInfo?.shareholders?.map((shareholder, index) => (
                                    !uploadedShareholderIds.includes(shareholder._id) &&
                                    <option key={index} value={shareholder._id}>{shareholder.firstName} {shareholder.lastName}</option>
                                  ))
                                }
                              </Input>
                            </Col>
                          }
                        </>
                      }
                      {
                        docType === "address" &&
                        (!authAddressUploaded ||
                          !allShareholdersAddressesUploaded) &&

                        <>
                          <Col xs={12} lg={6}>
                            <Label className="form-label" for="personnel">{props.t("Personnel")}</Label>
                            <Input
                              className="form-select form-select-lg"
                              required={docType === "ID"}
                              onChange={(e) => {
                                setPersonnel(e.target.value);
                                setFieldValue("personnel", e.target.value);
                              }}
                              id="personnel"
                              type="select"
                              name="personnel"
                              value={personnel}
                            >
                              <option disabled value="">
                                {props.t("Select a Personnel")}
                              </option>
                              {!authAddressUploaded && <option value="AUTHORIZED_PERSON">{props.t("Authorized Person")}</option>}
                              <option value="SHAREHOLDER">{props.t("Shareholder")}</option>
                            </Input>
                            {
                              errors?.personnel &&
                              <label style={{ "color": "red" }}>{errors.personnel}</label>
                            }
                          </Col>
                          {
                            personnel === "SHAREHOLDER" &&
                            <Col xs={12} lg={6}>
                              <Label className="form-label" for="shareholder">{props.t("Shareholder")}</Label>
                              <Input
                                className="form-select form-select-lg"
                                required={docType === "address"}
                                onChange={(e) => {
                                  setShareholderId(e.target.value);
                                  setFieldValue("shareholder", e.target.value);
                                }
                                }
                                id="shareholder"
                                type="select"
                                name="shareholder"
                                value={shareholderId}
                              >
                                <option disabled value="">
                                  {props.t("Select a shareholder")}
                                </option>
                                {
                                  props.clientData?.corporateInfo?.shareholders?.map((shareholder, index) => (
                                    !uploadedShareholderAddresses.includes(shareholder._id) &&
                                    <option key={index} value={shareholder._id}>{shareholder.firstName} {shareholder.lastName}</option>
                                  ))
                                }
                              </Input>
                            </Col>
                          }

                          <Col xs={12} lg={6}>
                            <div className="mb-3">
                              <Label className="form-label" htmlFor="address">
                                {props.t("Corporate Address")}
                              </Label>
                              <Input
                                type="file"
                                className="form-control form-control-lg"
                                id="address"
                                onChange={(e) => {
                                  addFile("ADDRESS", e.target.files[0]);
                                  setFieldValue("address", e.target.files[0]);
                                }}
                                name="address"
                                innerRef={addressRef}
                                invalid={errors.address && touched.address}
                              />
                              {
                                errors?.address &&
                                touched.address &&
                                <label style={{ "color": "red" }}>{errors.address}</label>
                              }
                            </div>
                          </Col>
                        </>
                      }
                      {
                        docType === "Additional" &&
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
                              <label style={{ "color": "red" }}>{errors.Additional}</label>
                            }
                          </div>
                        </Col>
                      }
                      {
                        <div className="mt-4">
                          {
                            docType === "ID" &&
                            secondSelect === "ID" &&
                            // TODO: when all ids approved
                            // !authIdUploaded &&
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
                                    // disabled={authIdUploaded}
                                    />
                                    {
                                      errors?.frontSideId &&
                                      touched.frontSideId &&
                                      <label style={{ "color": "red" }}>{errors.frontSideId}</label>
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
                                    <label style={{ "color": "red" }}>{errors.backSideId}</label>
                                  }
                                </div>
                              </Col>
                            </Row>
                          }
                          {
                            docType === "ID" &&
                            secondSelect === "Passport" &&
                            !authIdUploaded &&
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
                                        style={{ "color": "red" }}>{errors.proofOfPassport}</label>
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
                                    <label style={{ "color": "red" }}>{errors.proofOfPassportOptional}</label>
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
                    <div className="text-end">
                      <Button
                        className="border-0 color-bg-btn w-lg"
                        type="submit"
                        disabled={
                          docType === "memorandum" &&
                          !memorandum.current?.value
                          ||
                          docType === "corpAddress" &&
                          !corpAddressRef.current?.value
                          ||
                          docType === "certificate" &&
                          !certificateRef.current?.value
                          ||
                          docType === "Additional" &&
                          !additionalRef.current?.value
                          ||
                          docType === "ID" &&
                          secondSelect === "ID" &&
                          !backSideRef.current?.value
                          ||
                          docType === "ID" &&
                          secondSelect === "Passport" &&
                          !requiredPassportRef.current?.value
                          ||
                          props.uploading
                        }
                      >
                        {
                          props.uploading && props.uploadClear === 0
                            ? <Spinner />
                            : props.t("Submit")
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
              <p className="fw-bold color-primary">
                {props.t("KYC Requirements")}
              </p>
              <p className="mt-2 color-primary">
                {props.t("Corporate Status")}
              </p>
              <div className="proofs-container w-100">
                <button
                  className="btn text-start py-2 w-100 border mt-1"
                  disabled={props.documents?.find((x) => (x.type === "MEMORANDUM"))}
                  onClick={() => (setDocType("memorandum"))}
                  style={{
                    boxShadow: memorandumUploaded ? "inset 0 4px 8px 0 rgb(0 0 0 / 0.1)" : "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    cursor: memorandumUploaded ? "not-allowed" : "pointer"
                  }}
                >
                  <i className="mdi mdi-file-document-multiple me-3" />
                  {props.t("Memoradum of Association")}
                </button>
                <button
                  className="btn text-start py-2 w-100 border mt-2"
                  disabled={props.documents?.find((x) => (x.type === "CERTIFICATE_OF_INCORPORATION"))}
                  onClick={() => (setDocType("corpAddress"))}
                  style={{
                    boxShadow: certificateUploaded ? "inset 0 4px 8px 0 rgb(0 0 0 / 0.1)" : "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    cursor: certificateUploaded ? "not-allowed" : "pointer"
                  }}
                >
                  <i className="mdi mdi-file-document-multiple me-3" />
                  {props.t("Certificate of Incorporation")}
                </button>
                <button
                  className="btn text-start py-2 w-100 border mt-2"
                  disabled={props.documents?.find((x) => (x.type === "CORPORATE_ADDRESS"))}
                  onClick={() => (setDocType("corpAddress"))}
                  style={{
                    boxShadow: corpAddressUploaded ? "inset 0 4px 8px 0 rgb(0 0 0 / 0.1)" : "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    cursor: corpAddressUploaded ? "not-allowed" : "pointer"
                  }}
                >
                  <i className="mdi mdi-file-document-multiple me-3" />
                  {props.t("Corporate Address")}
                </button>

                <p className="mt-2 color-primary">
                  {props.t("Corporate Personnel Status")}
                </p>
                <p className="mt-2 color-primary">{props.t("Authorized Person")}</p>
                <p>
                  {props.clientData.corporateInfo?.authorizedPerson?.firstName} {props.clientData.corporateInfo?.authorizedPerson?.lastName}
                </p>
                <button
                  className="btn text-start py-2 border-bottom w-100 border mt-1"
                  style={{
                    boxShadow: authIdUploaded ? "inset 0 4px 8px 0 rgb(0 0 0 / 0.1)" : "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    cursor: authIdUploaded ? "not-allowed" : "pointer"
                  }}
                  disabled={props.documents?.find((x) => (x.type === "ID" && x.subType === "AUTHORIZED_PERSON"))}
                  onClick={() => {
                    setDocType("ID");
                    setPersonnel("AUTHORIZED_PERSON");
                  }}
                >
                  <i className="mdi mdi-file-document-multiple me-3" />
                  {props.t("Proof of ID")}
                </button>
                <button
                  className="btn text-start py-2 border-bottom w-100 border mt-1"
                  style={{
                    boxShadow: authIdUploaded ? "inset 0 4px 8px 0 rgb(0 0 0 / 0.1)" : "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    cursor: authIdUploaded ? "not-allowed" : "pointer"
                  }}
                  disabled={props.documents?.find((x) => (x.type === "ADDRESS" && x.subType === "AUTHORIZED_PERSON"))}
                  onClick={() => {
                    setDocType("address");
                    setPersonnel("AUTHORIZED_PERSON");
                  }}
                >
                  <i className="mdi mdi-file-document-multiple me-3" />
                  {props.t("Proof of Address")}
                </button>
                <p className="mt-3 color-primary">{props.t("Shareholders")}</p>
                {props.clientData.corporateInfo.shareholders &&
                  props.clientData.corporateInfo.shareholders.map((shareholder, index) => (
                    <Fragment key={index}>
                      <p className="mt-1 mb-2">
                        {shareholder.firstName} {shareholder.lastName}
                      </p>
                      <button
                        className="btn text-start py-2 border-bottom w-100 border"
                        style={{
                          boxShadow: props.documents?.find((x) => (x.type === "ID" && x.subType === "SHAREHOLDER" && x.shareholderId === shareholder._id))
                            ? "inset 0 4px 8px 0 rgb(0 0 0 / 0.1)"
                            : "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                        }}
                        disabled={props.documents?.find((x) => (x.type === "ID" && x.subType === "SHAREHOLDER" && x.shareholderId === shareholder._id))}
                        onClick={() => {
                          setDocType("ID");
                          setPersonnel("SHAREHOLDER");
                          setShareholderId(shareholder._id);
                        }}
                      >
                        <i className="mdi mdi-file-document-multiple me-3" />
                        {props.t("Proof of ID")}
                      </button>
                      <button
                        className="btn text-start py-2 border-bottom w-100 border mt-1 mb-2"
                        style={{
                          boxShadow: uploadedShareholderAddresses.includes(shareholder._id)
                            ? "inset 0 4px 8px 0 rgb(0 0 0 / 0.1)"
                            : "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                        }}
                        disabled={props.documents?.find((x) => (x.type === "ADDRESS" && x.subType === "SHAREHOLDER" && x.shareholderId === shareholder._id))}
                        onClick={() => {
                          setDocType("address");
                          setPersonnel("SHAREHOLDER");
                          setShareholderId(shareholder._id);
                        }}
                      >
                        <i className="mdi mdi-file-document-multiple me-3" />
                        {props.t("Proof of Address")}
                      </button>
                    </Fragment>
                  ))
                }
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
  clientData: state.Profile.clientData,
  uploading: state.documents.uploading,
  uploadError: state.documents.uploadError,
  uploadSuccessMessage: state.documents.uploadSuccessMessage
});

export default connect(mapStateToProps, null)(withTranslation()(DocumentCorpUpload)); 