import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Input,
  Label,
  Row,
  Spinner
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import TableLoader from "components/Common/TableLoader";
import CustomPagination from "components/Common/CustomPagination";
import { fetchMarketsStart, changeMarketStatus } from "store/markets/actions";
import MarketForm from "./MarketAdd";
import MarketEdit from "./MarketEdit";
import { Link } from "react-router-dom";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import { MetaTags } from "react-meta-tags";
import formatDate from "helpers/formatDate";

function CurrencyPairsList(props) {
  const [selectedMarket, ] = useState();
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [sizePerPage, setSizePerPage] = useState(10);
  const dispatch = useDispatch();
  const t = props.t;

  useEffect(() => {
    loadMarkets(1, sizePerPage);
  }, [sizePerPage, 1]);

  const loadMarkets = (page, limit) => {
    dispatch(
      fetchMarketsStart({
        limit,
        page,
      })
    );
  };

  // a function to switch status of a selected system email
  const updateStatus = (event, item, index) => {
    dispatch(changeMarketStatus(item._id, index, !item.active ? "activate" : "deactivate"));
    event.preventDefault();
  };

  useEffect(() => {
    if (props.deleteModalClear && deleteModal) {
      setDeleteModal(false);
    }
  }, [props.deleteModalClear]);

  const columns = [
    {
      dataField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => formatDate(val.createdAt)
    },
    {
      dataField: "pairName",
      text: "Pair Name",
      formatter: (item) => {
        return <Link
          to={{
            pathname: `/price/${item.baseAsset}_${item.quoteAsset}`,
            state: item
          }}
        >
          {item.pairName}
        </Link >;
      }
    },
    {
      dataField: "fee",
      text: "Fee",
      formatter: (val) => `${val.fee["$numberDecimal"]}`,
    },
    {
      dataField: "minAmount",
      text: props.t("Min Amount"),
      formatter: (val) => `${val.minAmount["$numberDecimal"]}`,
    },
    {
      dataField: "baseAsset",
      text: "Base Asset",
    },
    {
      dataField: "quoteAsset",
      text: "Quote Asset",
    },
    {
      dataField: "active",
      text: props.t("Active"),
      formatter: (item, index) => (
        <div className="d-flex gap-3">
          {
            props.changeStatusLoading && props.changeStatusIndex === index
              ? 
              <React.Fragment>
                <Spinner className="ms-2" color="primary" />  
              </React.Fragment> 
              : 
              <React.Fragment>
                <Input
                  checked={item.active}
                  type="checkbox"
                  onChange={(e) => {updateStatus(e, item, index)}}
                  id={item.id}
                  switch="none"
                />
                <Label className="me-1" htmlFor={item.id} data-on-label="" data-off-label="" />
              </React.Fragment>
          }
        </div>
      ),
    },
  ];

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Currency Pairs
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>{t("Currency Pairs")}</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between  align-items-center">
                    <CardTitle className="color-primary">
                      {props.t("Currency Pairs List")} ({props.totalDocs})
                    </CardTitle>
                    <MarketForm />
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                    >
                      <Table id="tech-companies-1" className="table table-hover ">
                        <Thead className="text-center table-light" >
                          <Tr>
                            {columns.map((column, index) => (
                              <Th data-priority={index} key={index}>
                                <span className="color-primary">{column.text}</span>
                              </Th>
                            ))}
                          </Tr>
                        </Thead>
                        <Tbody className="text-center" style={{ fontSize: "13px" }}>
                          {props.loading && <TableLoader colSpan={12} />}
                          {!props.loading &&
                            props.markets.map((row, rowIndex) => (
                              <Tr key={rowIndex}>
                                {columns.map((column, index) => (
                                  <Td key={`${rowIndex}-${index}`}>
                                    {column.dataField === "checkbox" ? (
                                      <input type="checkbox" />
                                    ) : (
                                      ""
                                    )}
                                    {column.formatter
                                      ? column.formatter(row, rowIndex)
                                      : row[column.dataField]}
                                  </Td>
                                ))}
                              </Tr>
                            ))}
                        </Tbody>
                      </Table>
                      <CustomPagination
                        {...props}
                        setSizePerPage={setSizePerPage}
                        sizePerPage={sizePerPage}
                        onChange={loadMarkets}
                        docs={props.markets}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {
            <MarketEdit
              open={editModal}
              market={selectedMarket}
              onClose={() => setEditModal(false)}
            />
          }
          {/* {<DeleteModal loading={props.deleteLoading} onDeleteClick={deleteMarket} show={deleteModal}  onCloseClick={()=>setDeleteModal(false)}/>}  */}
        </div>
      </div>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  loading: state.marketsReducer.loading || false,
  markets: state.marketsReducer.markets || [],
  page: state.marketsReducer.page || 1,
  totalDocs: state.marketsReducer.totalDocs || 0,
  totalPages: state.marketsReducer.totalPages || 0,
  hasNextPage: state.marketsReducer.hasNextPage,
  hasPrevPage: state.marketsReducer.hasPrevPage,
  limit: state.marketsReducer.limit,
  nextPage: state.marketsReducer.nextPage,
  pagingCounter: state.marketsReducer.pagingCounter,
  prevPage: state.marketsReducer.prevPage,
  deleteLoading: state.marketsReducer.deleteLoading,
  deleteModalClear: state.marketsReducer.deleteModalClear,
  changeStatusIndex: state.marketsReducer.changeStatusIndex,
  changeStatusLoading: state.marketsReducer.changeStatusLoading
});
export default connect(
  mapStateToProps,
  null
)(withTranslation()(CurrencyPairsList));
