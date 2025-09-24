import React from "react";
import { useDispatch } from "react-redux";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  CardBody, CardHeader, CardTitle,
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";

import { showSuccessNotification } from "store/general/notifications/actions";
import dedicatedLinks from "./links";
import CardWrapper from "components/Common/CardWrapper";

const DedicatedLinks = ({ parentRef, agRef, t }) => {
  const dispatch = useDispatch();
  return (
    <CardWrapper className="dedicated-links mt-4 glass-card shadow">
      <CardHeader className="mb-2">
        <CardTitle className="mb-0 color-primary">{t("Dedicated Links")}</CardTitle>
      </CardHeader>
      <CardBody>
        {!agRef
          ? <p colSpan="100%" className="text-center">{t("No Agreements for this account.")}</p>
          :
          <Table className="table table-hover table-borderless">
            <Thead>
              <Tr>
                <Th className="py-0">{t("Type")}</Th>
                <Th className="py-0">{t("Link")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dedicatedLinks.map((link, idx) =>
                <Tr key={idx}>
                  <Td className="py-0">{t(link.type)}</Td>
                  <Td className="py-0">
                    <Link to="#"
                      className="mdi mdi-clipboard-check-multiple-outline font-size-20 me-2"
                      onClick={() => {
                        navigator.clipboard.writeText(`${link.url}?parentRef=${parentRef}${!link.url.includes("ib") ? `&agRef=${agRef}` : ""}`);
                        dispatch(showSuccessNotification("Link copied to clipboard"));
                      }}
                    ></Link>
                    {`${link.url}?parentRef=${parentRef}${!link.url.includes("ib") ? `&agRef=${agRef}` : ""}`}
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>}
      </CardBody>
    </CardWrapper>
  );
};

export default withTranslation()(DedicatedLinks);
