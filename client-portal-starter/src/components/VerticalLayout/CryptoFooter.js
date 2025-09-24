import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col
} from "reactstrap";
import * as content from "content";

//i18n
import { withTranslation } from "react-i18next";

const Footer = (props) => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={6}>
              {new Date().getFullYear()} ©{props.t("Minia")}.
            </Col>
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
      <section className="float-wa-btn">
        <a
          href="#"
          target="_blank"
          rel="noreferrer"
        >
          <i className="fab fa-whatsapp fa-3x"></i>
        </a>
      </section>
    </React.Fragment>
  );
};
export default withTranslation()(Footer);
