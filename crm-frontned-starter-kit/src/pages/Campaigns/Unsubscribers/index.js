import { useEffect, useState } from "react";
import { useDispatch, connect } from "react-redux";
import {
  Row, Col, Card, CardBody, CardTitle, CardHeader,
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { MetaTags } from "react-meta-tags";
import { useTranslation } from "react-i18next";
import _ from "lodash";

import { fetchCampaignUnsubscribers } from "store/actions";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import formatDate from "helpers/formatDate";

function Unsubscribers(props) {
  const { t } = useTranslation();

  const columns = [
    {
      dataField: "customerId",
      text: t("Name"),
      formatter: (val) => { return (val?.customerId?.firstName) ? _.startCase(`${val.customerId.firstName} ${val.customerId.lastName}`) : " " },
    },
    {
      dataField: "customerId",
      text: t("Email"),
      formatter: (val) => val?.customerId?.email,
    },
    {
      dataField: "createdAt",
      text: t("Unsubscription Date"),
      formatter: (val) => formatDate(val.createdAt)
    },
  ];

  const [sizePerPage, setSizePerPage] = useState(10);
  const dispatch = useDispatch();
  const handleFetchCampaignUnsubscribers = (page, limit) => {
    dispatch(fetchCampaignUnsubscribers({
      page,
      limit
    }));
  };
  useEffect(() => {
    handleFetchCampaignUnsubscribers(1, sizePerPage);
  }, [sizePerPage, 1, props.deleteClearingCounter, props.editClearingCounter]);


  return (
    <>
      <MetaTags><title>Campaign Unsubscribers</title></MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>{t("Campaign Unsubscribers")}</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle className="color-primary">{t("Campaign Unsubscribers List")} ({props.totalDocs})</CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                    >
                      <Table
                        id="tech-companies-1"
                        className="table  table-hover "
                      >
                        <Thead className="text-center table-light" >
                          <Tr>
                            {columns.map((column, index) =>
                              <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                            )}
                          </Tr>
                        </Thead>
                        {
                          props.totalDocs === 0
                            ?
                            <Tbody>
                              {props.loading && <TableLoader colSpan={4} />}
                              {!props.loading &&
                                <>
                                  <Tr>
                                    <Td colSpan={"100%"} className="fw-bolder text-center" st>
                                      <h3 className="fw-bolder text-center">No records</h3>
                                    </Td>
                                  </Tr>
                                </>
                              }
                            </Tbody>
                            :
                            <Tbody className="text-center" style={{ fontSize: "13px" }}>
                              {props.loading && <TableLoader colSpan={4} />}
                              {!props.loading && props.docs.map((row, rowIndex) =>
                                <Tr key={rowIndex}>
                                  {columns.map((column, index) =>
                                    <Td key={`${rowIndex}-${index}`}>
                                      {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                                    </Td>
                                  )}
                                </Tr>
                              )}
                            </Tbody>
                        }
                      </Table>
                      <CustomPagination
                        {...props}
                        setSizePerPage={setSizePerPage}
                        sizePerPage={sizePerPage}
                        onChange={handleFetchCampaignUnsubscribers}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  loading: state.campaignUnsubscribers.loading || false,
  docs: state.campaignUnsubscribers.docs || [],
  totalDocs: state.campaignUnsubscribers.totalDocs || 0,
  emailCampaignPermissions: state.Profile.emailCampaignPermissions || {},
  hasPrevPage: state.campaignUnsubscribers.hasPrevPage || false,
  hasNextPage: state.campaignUnsubscribers.hasNextPage || false,
  prevPage: state.campaignUnsubscribers.prevPage || null,
  nextPage: state.campaignUnsubscribers.nextPage || null,
  page: state.campaignUnsubscribers.page || 1,
  totalPages: state.campaignUnsubscribers.totalPages || 0,
});

export default connect(mapStateToProps, null)(Unsubscribers);
