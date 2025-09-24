import React, { useEffect, useState } from "react";
import {
  useDispatch, connect
} from "react-redux";
import {
  Row, Col, Card, CardBody, CardTitle, CardHeader
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { fetchTransactionFeeGroupStart, deleteTransactionFeeGroupStart } from "store/transactionFeeGroups/actions";
import DeleteModal from "components/Common/DeleteModal";
import { fetchOrdersProfits } from "store/ordersProfit/actions";
import { MetaTags } from "react-meta-tags";


function OrderProfitList(props) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletedItem, setDeletedItem] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [editModal, setEditModal] = useState(false);
  const { update, delete: deletePermission } = props.transactionFeeGroupsPermissions;
  const columns = [
    // {
    //   dataField: "checkbox",
    //   text: <input type="checkbox" />
    // },
    {
      dataField: "symbol",
      text: props.t("symbol"),
    },
    {
      dataField: "status",
      text: props.t("status"),
    },
    {
      dataField: "type",
      text: props.t("type"),
    },
    {
      dataField: "side",
      text: props.t("side"),
    },
    {
      dataField: "amount",
      text: props.t("amount"),
      formatter:(val)=>(val?.amount?.$numberDecimal ? val.amount.$numberDecimal : val.amount)
    },
    {
      dataField: "profit",
      text: props.t("profit"),
      formatter:(val)=>(`${val.profit.amount} ${val.profit.currency}`)
    },
    {
      dataField: "feeProfit",
      text: props.t("fee profit"),
      formatter:(val)=>(`${val.feeProfit.amount} ${val.feeProfit.currency}`)
    },
    {
      dataField: "price",
      text: props.t("price"),
      formatter:(val)=>(`${val?.price?.$numberDecimal ? val.price.$numberDecimal : val.price}`)
    },
    {
      dataField: "mPrice",
      text: props.t("M Price"),
      formatter:(val)=>(`${val?.mPrice?.$numberDecimal ? val.mPrice.$numberDecimal : val.mPrice}`)
    },
  ];

  const [sizePerPage, setSizePerPage] = useState(10);

  const dispatch = useDispatch();


  useEffect(() => {
    loadOrdersProfits(1, sizePerPage);
  }, [sizePerPage, 1]);
  
  useEffect(() => {
    if (!props.showEditSuccessMessage && editModal) {
      setEditModal(false);

    }
  }, [props.showEditSuccessMessage]);
  useEffect(() => {
    if (!props.showDeleteModal && deleteModal) {
      setDeleteModal(false);

    }
  }, [props.showDeleteModal]);
  const loadOrdersProfits = (page, limit) => {
    dispatch(fetchOrdersProfits({
      page,
      limit
    }));
  };
  const deleteFeeGroup = () => {
    dispatch(deleteTransactionFeeGroupStart(deletedItem._id));
  };


  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Order Profit
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>{props.t("Order Profit")}</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between  align-items-center">
                    <CardTitle>{props.t("Order Profit List")} ({props.totalDocs})</CardTitle>
                  </div>
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
                        <Tbody style={{ fontSize: "13px" }}>
                          {props.loading && <TableLoader colSpan={4} />}
                          {!props.loading && props.ordersProfits.map((row, rowIndex) => <Tr key={rowIndex}>
                            {columns.map((column, index) =>
                              <Td key={`${rowIndex}-${index}`}>
                                {column.dataField === "checkbox" ? <input type="checkbox" /> : ""}
                                {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                              </Td>
                            )}
                          </Tr>
                          )}
                        </Tbody>
                      </Table>
                      <CustomPagination
                        {...props}
                        setSizePerPage={setSizePerPage}
                        sizePerPage={sizePerPage}
                        onChange={loadOrdersProfits}
                        docs={props.ordersProfits}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {<DeleteModal loading={props.deleteLoading} show={deleteModal} onDeleteClick={deleteFeeGroup} onCloseClick={() => setDeleteModal(false)} />}
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  loading: state.ordersProfitsReducer.loading || false,
  ordersProfits: state.ordersProfitsReducer.docs || [],
  page: state.ordersProfitsReducer.page || 1,
  totalDocs: state.ordersProfitsReducer.totalDocs || 0,
  totalPages: state.ordersProfitsReducer.totalPages || 0,
  hasNextPage: state.ordersProfitsReducer.hasNextPage,
  hasPrevPage: state.ordersProfitsReducer.hasPrevPage,
  limit: state.ordersProfitsReducer.limit,
  nextPage: state.ordersProfitsReducer.nextPage,
  pagingCounter: state.ordersProfitsReducer.pagingCounter,
  prevPage: state.ordersProfitsReducer.prevPage,
  showEditSuccessMessage: state.ordersProfitsReducer.showEditSuccessMessage,
  showDeleteModal: state.ordersProfitsReducer.showDeleteModal,
  deleteLoading: state.ordersProfitsReducer.deleteLoading,
  editButtonDisabled: state.ordersProfitsReducer.editButtonDisabled,
  transactionFeeGroupsPermissions: state.Profile.transactionFeeGroupsPermissions || {}
});

export default connect(mapStateToProps, null)(withTranslation()(OrderProfitList));
