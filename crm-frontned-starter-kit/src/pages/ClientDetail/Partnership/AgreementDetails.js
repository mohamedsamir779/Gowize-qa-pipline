import React from "react";
import { withTranslation } from "react-i18next";
import {
  Card, CardBody, CardHeader, CardTitle,
} from "reactstrap";
import Accordion from "react-bootstrap/Accordion";

import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";

const getAccountTypeName = (accountTypeId, accountTypes) => {
  return accountTypes?.find((type) => type._id === accountTypeId)?.title;
};

const AgreementDetails = ({ agreement, accountTypes, t }) => {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="color-primary">{t("Agreement Details")}</CardTitle>
      </CardHeader>
      <CardBody>
        {agreement ?
          !agreement?.isMaster &&
          <Table className="table table-hover table-borderless">
            <Thead>
              <Tr>
                <Th className="py-1">{t("Account Type")}</Th>
                <Th className="py-1">{t("Total Rebate")}</Th>
                <Th className="py-1">{t("Total Commission")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {agreement?.totals?.map((total, idx) =>
                <Tr key={idx}>
                  <Td className="py-1">{getAccountTypeName(total.accountTypeId, accountTypes)}</Td>
                  <Td className="py-1">{total.rebate}</Td>
                  <Td className="py-1">{total.commission}</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
          : <p>No Agreements for this account.</p>}
        <Accordion>
          {agreement?.members?.map((member, index) =>
            <Accordion.Item eventKey={index} key={member._id}>
              <Accordion.Header>{member.customerId.firstName} {member.customerId.lastName}</Accordion.Header>
              <Accordion.Body>
                <Accordion>
                  {member?.values.map((account, index) =>
                    <Accordion.Item eventKey={index} key={account._id}>
                      <Accordion.Header>{getAccountTypeName(account.accountTypeId, accountTypes)}</Accordion.Header>
                      <Accordion.Body>
                        <Table className="table table-hover table-borderless text-center text-capitalize">
                          <Thead>
                            <Tr>
                              <Th className="py-1">{t("Product")}</Th>
                              <Th className="py-1">{t("Rebate")}</Th>
                              <Th className="py-1">{t("Comission")}</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {Object.entries(account.products).map(([key, value]) =>
                              <Tr key={key}>
                                <Td className="py-1">{key}</Td>
                                <Td className="py-1">{value.rebate}</Td>
                                <Td className="py-1">{value.commission}</Td>
                              </Tr>
                            )}
                          </Tbody>
                        </Table>
                      </Accordion.Body>
                    </Accordion.Item>
                  )}
                </Accordion>
              </Accordion.Body>
            </Accordion.Item>
          )}
        </Accordion>
      </CardBody>
    </Card>
  );
};

export default withTranslation()(AgreementDetails);
