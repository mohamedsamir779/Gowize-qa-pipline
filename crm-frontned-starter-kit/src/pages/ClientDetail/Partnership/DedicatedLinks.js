import React from "react";
import { withTranslation } from "react-i18next";
import {
  Card, CardBody, CardHeader, CardTitle,
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import { Link } from "react-router-dom";

import dedicatedLinks from "./links";
import { showSuccessNotification } from "store/notifications/actions";
import { useDispatch } from "react-redux";

const DedicatedLinks = ({ parentRef, agRef, t }) => {
  const dispatch = useDispatch();
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="color-primary">{t("Dedicated Links")}</CardTitle>
      </CardHeader>
      <CardBody>
        {!agRef
          ? <div className="text-center">{t("No Agreements for this account.")}</div>
          : <Table className="table table-hover table-borderless">
            <Thead>
              <Tr>
                <Th className="py-1">{t("Type")}</Th>
                <Th className="py-1">{t("Link")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dedicatedLinks.map((link, idx) =>
                <Tr key={idx}>
                  <Td className="py-1">{t(link.type)}</Td>
                  <Td className="py-1 color-primary">
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
    </Card>
  );
};

export default withTranslation()(DedicatedLinks);
