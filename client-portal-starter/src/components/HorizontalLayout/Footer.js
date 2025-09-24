import React from "react";
import { Link } from "react-router-dom";
import {
  Container, Row, Col
} from "reactstrap";
//i18n
import { withTranslation } from "react-i18next";
import * as content from "content";

const Footer = (props) => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={6}>{new Date().getFullYear()}©{props.t(content.clientName)} .</Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                {props.t("Design & Develop by")}
                <Link to="#" className="ms-1 text-decoration-underline">
                  {props.t(content.developedBy)}
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};
export default withTranslation()(Footer); 
