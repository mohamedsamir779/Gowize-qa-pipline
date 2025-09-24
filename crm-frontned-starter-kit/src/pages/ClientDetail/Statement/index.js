import React from "react";
import { withTranslation } from "react-i18next";
import { Container } from "react-bootstrap";
import StatementTable from "./StatementTable";

const Statement = ({ t }) => {
  return (
    <Container fluid className="gx-4">
      <StatementTable/>
    </Container >
  );
};

export default withTranslation()(Statement);
