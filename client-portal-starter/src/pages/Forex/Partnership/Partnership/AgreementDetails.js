import React from "react";
import { withTranslation } from "react-i18next";
import CardWrapper from "components/Common/CardWrapper";
import {
  CardBody, CardHeader, CardTitle,
} from "reactstrap";
import Accordion from "react-bootstrap/Accordion";

import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";

const getAccountTypeName = (accountTypeId, accountTypes) => {
  return accountTypes.find((type) => type._id === accountTypeId)?.title;
};

const AgreementDetails = ({ agreement, accountTypes, t }) => {
  return (
    <CardWrapper className="mt-4 shadow glass-card">
      <CardHeader className="mb-2">
        <CardTitle className="mb-0 color-primary">{t("Agreement Details")}</CardTitle>
      </CardHeader>
      <CardBody>
        {agreement ?
          !agreement?.isMaster &&
          <Table className="table table-hover table-borderless">
            <Thead>
              <Tr>
                <Th className="py-0">{t("Account Type")}</Th>
                <Th className="py-0">{t("Total Rebate")}</Th>
                <Th className="py-0">{t("Total Commission")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {agreement?.totals?.map((total, idx) =>
                <Tr key={idx}>
                  <Td className="py-0">{getAccountTypeName(total.accountTypeId, accountTypes)}</Td>
                  <Td className="py-0">{total.rebate}</Td>
                  <Td className="py-0">{total.commission}</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
          : <p className="text-center">No Agreements for this account.</p>}
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
                        <Table className="table table-hover table-borderless text-center text-capitalize mb-0">
                          <Thead>
                            <Tr>
                              <Th className="py-0">{t("Product")}</Th>
                              <Th className="py-0">{t("Rebate")}</Th>
                              <Th className="py-0">{t("Comission")}</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {Object.entries(account.products).map(([key, value]) =>
                              <Tr key={key}>
                                <Td className="py-0">{key}</Td>
                                <Td className="py-0">{value.rebate}</Td>
                                <Td className="py-0">{value.commission}</Td>
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
    </CardWrapper>
  );
};

export default withTranslation()(AgreementDetails);
