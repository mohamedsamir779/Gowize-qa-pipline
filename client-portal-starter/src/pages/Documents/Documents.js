import React from "react";
import {
  Button, Col, Container, Form, Input, Label, Row
} from "reactstrap";
import CardWrapper from "../../components/Common/CardWrapper";
import DocumnetsList from "./DocumnetsList";

//i18n
import { withTranslation } from "react-i18next";

function Documents(props) {
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container>
          <div className="profile">
            <h1 className="mb-4 color-primary">
              {props.t("My Documents")}
            </h1>
            <CardWrapper className='mb-5 my-document'>
              <div className="d-flex align-items-center justify-content-center">
                {props.t("No document uploaded")}
              </div>
            </CardWrapper>
            <h1 className="mb-4">
              {props.t("Upload New Document")}
            </h1>
            <div className="upload-document mb-5">
              <Row>
                <Col lg={9} className='mb-5'>
                  <CardWrapper className="h-100">
                    <Container>
                      <Form>
                        <Row>
                          <Col xs={12} lg={6}>
                            <Label className="form-label">{props.t("Select")}</Label>
                            <select className="form-select form-select-lg">
                              <option>{props.t("Select")}</option>
                              <option>{props.t("Large select")}</option>
                              <option>{props.t("Small select")}</option>
                            </select>
                          </Col>
                          <Col xs={12} lg={6}>
                            <Label className="form-label">{props.t("Select")}</Label>
                            <select className="form-select form-select-lg">
                              <option>{props.t("Select")}</option>
                              <option>{props.t("Large select")}</option>
                              <option>{props.t("Small select")}</option>
                            </select>
                          </Col>
                        </Row>


                        <div className="button-container">
                          <Button className="btn btn-danger w-lg btn-sm waves-effect waves-light">
                            {props.t("Front Side")}
                          </Button>
                          <Button className="btn btn-success w-lg btn-sm waves-effect waves-light">
                            {props.t("Back Side")}
                          </Button>
                        </div>
                        <div className="upload-button-container">
                          <button type="button" className="btn btn-outline-light waves-effect">{props.t("Upload")}</button>
                          <button type="button" className="btn btn-outline-light waves-effect">{props.t("Upload")}</button>
                        </div>
                        <p className="mt-3 mb-4">
                          <span className="fw-bold">{props.t("Fill in your details for a seamless experience")}</span> ({props.t("Optional")})
                        </p>
                        <div className="inputs-group"></div>
                        <div className="inputs-group"></div>
                        <Row>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label className="form-label" htmlFor="formrow-email-input">{props.t("Document Number")}</Label>
                              <Input type="email" className="form-control" id="formrow-email-input" />
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label className="form-label">{props.t("Country of Issue")}</Label>
                              <select className="form-select">
                                <option>{props.t("Select")}</option>
                                <option>{props.t("Large select")}</option>
                                <option>{props.t("Small select")}</option>
                              </select>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label htmlFor="example-date-input" className="form-label">{props.t("Date of Issue")}</Label>
                              <Input className="form-control" type="date" defaultValue="mm/dd/yy" id="example-date-input" />
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label htmlFor="example-date-input" className="form-label">{props.t("Date Of Expiry")}</Label>
                              <Input className="form-control" type="date" defaultValue="mm/dd/yy" id="example-date-input" />
                            </div>
                          </Col>
                        </Row>
                        <div className="text-end">
                          <Button className="blue-gradient-color w-lg">{props.t("Submit")}</Button>
                        </div>
                        <div className="text-muted">
                        ({props.t("Maximum size of document 5MB) Allow File Formats ")}*jpg, *png, *pdf
                        </div>
                      </Form>
                    </Container>
                  </CardWrapper>
                </Col>
                <Col lg={3}>
                  <CardWrapper className="h-100">
                    <div className="kyc-requirements">
                      <p className="text-center fw-bold">
                        {props.t("KYC Requirements")}
                      </p>
                      <div className="mt-4 proofs-container">
                        <div className="py-3 border-bottom">
                          <i className="mdi mdi-file-document-multiple me-3" />
                          {props.t("Proof of ID")}
                        </div>
                        <div className="py-3">
                          <i className="mdi mdi-file-document-multiple me-3" />
                          {props.t("Proof of Address")}
                        </div>
                      </div>
                    </div>
                  </CardWrapper>
                </Col>
              </Row>
            </div>
            <h1 className="mb-4">
              {props.t("Uploaded Document")}
            </h1>
            <CardWrapper className="mb-5">
              <DocumnetsList />
            </CardWrapper>
          </div>
        </Container>
      </div >
    </React.Fragment>
  );
}
export default withTranslation()(Documents); 