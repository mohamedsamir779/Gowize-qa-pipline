import React from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import {
  Col,
  Modal, ModalBody, ModalHeader, Row,
} from "reactstrap";

const AllAccountsModal = ({ show, toggle, accounts }) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={show} toggle={toggle} centered={true} scrollable={true}>
      <ModalHeader toggle={toggle} tag="h4">
        {t("Accounts")}
      </ModalHeader>
      <ModalBody >
        <Row className="mb-3">
          <Col>
            <h5>{t("Live Accounts")}</h5>
            <Table className="table table-hover text-center">
              <Thead>
                <Tr>
                  <Th>{t("Account ID")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {accounts?.liveAcc?.map((account, index) => (
                  <Tr key={index}>
                    <Td>{account}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <h5>{t("Demo Accounts")}</h5>
            <Table className="table table-hover text-center">
              <Thead>
                <Tr>
                  <Th>{t("Account ID")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {accounts?.demoAcc?.map((account, index) => (
                  <Tr key={index}>
                    <Td>{account}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Col>
        </Row>
      </ModalBody>
    </Modal >
  );
};

export default AllAccountsModal;
