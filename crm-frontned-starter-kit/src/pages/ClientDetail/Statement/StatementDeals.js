import React, { useEffect, useState } from "react";
import { 
  useSelector, 
  useDispatch, 
  connect,
} from "react-redux";
import { withTranslation } from "react-i18next";
import moment from "moment";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import {
  Table, Thead, Tbody, Tr, Th, Td,
} from "react-super-responsive-table";
import { 
  TabContent, TabPane, Nav, NavItem, NavLink, Col, Row, Container 
} from "reactstrap";

import { fetchStatementDeals } from "store/client/actions";
import classnames from "classnames";

const StatementDeals = (props) => {
  
  const baseStDealsColumns = [
    {
      dataField: "login",
      text: props.t("Login"),
      formatter: (val) => {
        return val?.clientDeal?.login || "-";
      }
    },
    {
      dataField: "side",
      text: props.t("Side"),
      formatter: (val) => (val?.clientDeal?.action === 0 ? "Buy" : "Sell")
    },
    {
      dataField: "clientDeal",
      text: props.t("Deal ID"),
      formatter: (val) => (val?.clientDeal?.dealId || "-")
    },
    {
      dataField: "clientDeal",
      text: props.t("Position ID"),
      formatter: (val) => (val?.clientDeal?.positionId || "-")
    },
    {
      dataField: "clientDeal",
      text: props.t("Symbol"),
      formatter: (val) => (val?.clientDeal?.symbol || "-")
    },
    {
      dataField: "clientDeal",
      text: props.t("Deal Time"),
      formatter: (val) => (moment(val?.clientDeal?.time * 1000).format("YYYY-MM-DDTHH:mm") || "-")
    },
    {
      dataField: "clientDeal",
      text: props.t("Profit"),
      formatter: (val) => (val ? parseFloat(val?.clientDeal?.profit) : "-")
    }
  ];
  const commissionColumns = [
    ...baseStDealsColumns,
    {
      dataField: "clientDeal",
      text: props.t("Volume"),
      formatter: (val) => (val ? parseFloat(val?.clientDeal?.volume) : "-")
    },
    {
      dataField: "profit",
      text: props.t("Commission"),
      formatter: (val) => (val ? parseFloat(val?.profit) : "-")
    }
  ];
  const rebateColumns = [
    ...baseStDealsColumns,
    {
      dataField: "clientDeal",
      text: props.t("Volume"),
      formatter: (val) => (val ? parseFloat(val?.clientDeal?.volumeClosed)  : "-")
    },
    {
      dataField: "profit",
      text: props.t("Rebate"),
      formatter: (val) => (val ? parseFloat(val?.profit) : "-")
    }
  ];
  
  const dispatch = useDispatch();
  const { 
    t,
    dateFrom,
    dateTo,
    currentLogin,
  } = props;

  const { 
    clientDetails, 
  } = useSelector((state) => state.clientReducer);

  const {
    _id,
    statementDeals
  } = clientDetails;

  const [sizePerPage, setSizePerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("0");

  const loadStatementDeals = (page = 1, limit = 10) => {
    _id && dispatch(fetchStatementDeals({
      platform: "CTRADER",
      customerId: _id,
      dateFrom: dateFrom,
      dateTo: dateTo,
      clientLogin: currentLogin,
      entry: parseInt(activeTab, 10),
      page,
      limit,
    }));
  };

  useEffect(() => {
    if (currentLogin) {
      loadStatementDeals(1, sizePerPage);
    }
  }, [activeTab, currentLogin, sizePerPage, 1]);

  return (
    <>
      {
        currentLogin ? (
          <div>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "0" })}
                  onClick={() => { setActiveTab("0") }}
                >
                  Commission
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "1" })}
                  onClick={() => { setActiveTab("1") }}
                >
                  Rebate
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab} className="mt-2">
              <TabPane tabId="0">
                <div className="table-rep-plugin">
                  <div
                    className="table-responsive mb-0"
                    data-pattern="priority-columns"
                  >
                    <Table
                      id="tech-companies-1"
                      className="table table-hover table-clients"
                    >
                      <Thead className="text-center table-light" >
                        <Tr>
                          {commissionColumns.map((column, index) =>
                            <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                          )}
                        </Tr>
                      </Thead>
                      
                      <Tbody className="text-center" style={{ fontSize: "13px" }}>
                        {props.stDealsLoading && <TableLoader colSpan={4} />}
                        {!props.stDealsLoading && statementDeals && statementDeals.docs.map((row, rowIndex) =>
                          <Tr key={rowIndex} >
                            {commissionColumns.map((column, index) =>
                              <Td key={`${rowIndex}-${index}`}>
                                {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                              </Td>
                            )}
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                    <CustomPagination
                      {...statementDeals}
                      setSizePerPage={setSizePerPage}
                      sizePerPage={sizePerPage}
                      onChange={loadStatementDeals}
                      docs={statementDeals && statementDeals.docs || []}
                    />
                  </div>
                </div>
              </TabPane>
              <TabPane tabId="1">
                <div className="table-rep-plugin">
                  <div
                    className="table-responsive mb-0"
                    data-pattern="priority-columns"
                  >
                    <Table
                      id="tech-companies-1"
                      className="table table-hover table-clients"
                    >
                      <Thead className="text-center table-light" >
                        <Tr>
                          {rebateColumns.map((column, index) =>
                            <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                          )}
                        </Tr>
                      </Thead>
                      
                      <Tbody className="text-center" style={{ fontSize: "13px" }}>
                        {props.stDealsLoading && <TableLoader colSpan={4} />}
                        {!props.stDealsLoading && statementDeals && statementDeals.docs.map((row, rowIndex) =>
                          <Tr key={rowIndex} >
                            {rebateColumns.map((column, index) =>
                              <Td key={`${rowIndex}-${index}`}>
                                {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                              </Td>
                            )}
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                    <CustomPagination
                      {...statementDeals}
                      setSizePerPage={setSizePerPage}
                      sizePerPage={sizePerPage}
                      onChange={loadStatementDeals}
                      docs={statementDeals && statementDeals.docs || []}
                    />
                  </div>
                </div>
              </TabPane>
            </TabContent>
          </div>
        ) : (
          <Container>
            <Row>
              <Col className="text-center" lg={12}>
                <h5>{t("Please click on the client login to view detailed statement")}</h5>
              </Col>
            </Row>
          </Container>
        )
      }
    </>
  );

};

const mapStateToProps = (state) => ({
  loading: state.clientReducer.statementLoading || false,
  stDealsLoading: state.clientReducer.statementDealsLoading || false,
  clients: state.clientReducer.clients || [],
  page: state.clientReducer.page || 1,
  totalDocs: state.clientReducer.totalDocs || 0,
  totalPages: state.clientReducer.totalPages || 0,
  hasNextPage: state.clientReducer.hasNextPage,
  hasPrevPage: state.clientReducer.hasPrevPage,
  limit: state.clientReducer.limit,
  nextPage: state.clientReducer.nextPage,
  pagingCounter: state.clientReducer.pagingCounter,
  prevPage: state.clientReducer.prevPage,
  clientPermissions: state.Profile.clientPermissions || {},
  docs:state.usersReducer.docs || []
});
export default connect(mapStateToProps, null)(withTranslation()(StatementDeals));