import React, { useEffect, useState } from "react";
import {
  useDispatch, useSelector
} from "react-redux";
import { Link, useParams } from "react-router-dom";

import {
  Row, Col, Card, CardBody, CardTitle, CardHeader, Label
} from "reactstrap";

import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

// import {
//   fetchOrders, deleteOrder,
// } from "store/Orders/actions";
import {
  fetchOrders, deleteOrder
} from "store/orders/actions";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import DeleteModal from "components/Common/DeleteModal";
import OrdersAddModal from "./OrdersAddModal";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import formatDate from "helpers/formatDate";

function OrderList(props) {
  const [deleteModal, setDeleteOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState();
  const { clientId } = useParams();

  const {
    loading,
    docs,
    page,
    totalDocs,
    totalPages,
    hasNextPage,
    hasPrevPage,
    limit,
    nextPage,
    pagingCounter,
    prevPage,
    deleteLoading,
    deleteClearingCounter,
    // roles,
    clearingCounter,
    // editClearingCounter,
  } = useSelector((state) => ({
    loading: state.ordersReducer.loading || false,
    docs: state.ordersReducer.docs || [],
    page: state.ordersReducer.page || 1,
    totalDocs: state.ordersReducer.totalDocs || 0,
    totalPages: state.ordersReducer.totalPages || 0,
    hasNextPage: state.ordersReducer.hasNextPage,
    hasPrevPage: state.ordersReducer.hasPrevPage,
    limit: state.ordersReducer.limit,
    nextPage: state.ordersReducer.nextPage,
    pagingCounter: state.ordersReducer.pagingCounter,
    prevPage: state.ordersReducer.prevPage,
    deleteLoading: state.ordersReducer.deleteLoading,
    deleteClearingCounter: state.ordersReducer.deleteClearingCounter,
    // roles: state.ordersReducer.rolesData,
    clearingCounter: state.ordersReducer.clearingCounter,
    // editClearingCounter: state.ordersReducer.editClearingCounter,
  }));
  const columns = [
    {
      dataField:"createdAt",
      text : "Date",
      formatter: (val) => formatDate(val.createdAt)
    },

    {
      text: "Symbol",
      dataField: "symbol",
      sort: true,
      formatter: (order) => (
        <a className=" " href={"/price/" + order?.symbol?.split("/").join("_")}>
          <Label className="me-1" data-on-label="roleId" data-off-label="">{order?.symbol}</Label>
        </a>
      ),
    },
    {
      text: "Type",
      dataField: "type",
      sort: true,
      formatter: (item) => (
        captilazeFirstLetter(item.type)
      )
    },
    {
      text: "Side",
      dataField: "side",
      sort: true,
      formatter: (item) => (
        captilazeFirstLetter(item.side)
      )
    },
    {
      text: "Amount",
      dataField: "amount",
      sort: true,
      formatter: (order) => (
        <>
          <Label className="me-1" data-on-label="roleId" data-off-label="">{order?.amount?.$numberDecimal}</Label>
        </>
      ),
    },
    {
      text: "Tp",
      dataField: "tp",
      sort: true,
      formatter: (order) => (
        <>
          <Label className="me-1" data-on-label="roleId" data-off-label="">{order?.paramsData?.tp}</Label>
        </>
      ),
    },
    {
      text: "Sl",
      dataField: "sl",
      sort: true,
      formatter: (order) => (
        <>
          <Label className="me-1" data-on-label="roleId" data-off-label="">{order?.paramsData?.sl}</Label>
        </>
      ),
    },
    {
      text: "Price",
      dataField: "price",
      sort: true,
      formatter: (order) => (
        <>
          <Label className="me-1" data-on-label="roleId" data-off-label="">{order?.price?.$numberDecimal}</Label>
        </>
      ),
    },
    {
      text: "Status",
      dataField: "status",
      sort: true,
      formatter: (item) => (
        captilazeFirstLetter(item.status)
      )
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: "Action",
      formatter: (Order) => ( 
        <div className="d-flex gap-3">
          {(Order?.status !== "canceled" && Order?.status !== "closed") ?
            <Link className="text-danger" to="#">
              <i
                className="mdi mdi-delete font-size-18"
                id="deletetooltip"
                onClick={() => { setSelectedOrder(Order); setDeleteOrderModal(true) }} ></i>
            </Link>
            : ""}
        </div>
      ),
    },
  ];
  const [sizePerPage, setSizePerPage] = useState(10);
  const [SearchInputValue, setSearchInputValue] = useState("");
  const [currentPage, setcurrentPagePage] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    loadOrders(currentPage, sizePerPage);
  }, [sizePerPage, 1, clearingCounter]);

  const loadOrders = (page, limit) => {
    setcurrentPagePage(page);
    if (SearchInputValue !== "") {
      dispatch(fetchOrders({
        page,
        limit,
        searchText: SearchInputValue,
        customerId: clientId
      }));
    } else {
      dispatch(fetchOrders({
        page,
        limit,
        customerId: clientId
      }));
    }
  };
  const numPageRows = (numOfRows) => {
    setSizePerPage(numOfRows);
  };
  const deleteOrderHandel = () => {
    dispatch(deleteOrder(selectedOrder._id));
  };

  const searchHandelEnterClik = (event) => {
    if (event.keyCode === 13) {
      loadOrders(1, sizePerPage);
    }
  };
  useEffect(() => {
    if (deleteClearingCounter > 0 && deleteModal) {
      setDeleteOrderModal(false);
    }
  }, [deleteClearingCounter]);

  return (
    <React.Fragment>
      <div className="container-fluid">
        <Row>
          <Col className="col-12">
            <Card>
              <CardHeader className="d-flex justify-content-between  align-items-center">
                <CardTitle className="color-primary">
                  Orders List ({totalDocs})
                </CardTitle>
                <OrdersAddModal clientId={clientId} />
              </CardHeader>
              <CardBody>
                <div className="search-box me-2 mb-2 d-inline-block">
                  <div className="position-relative">
                    <label htmlFor="search-bar-0" className="search-label">
                      <span id="search-bar-0-label" className="sr-only">Search this table</span>
                      <input onChange={(e) => setSearchInputValue(e.target.value)} onKeyDown={(e) => searchHandelEnterClik(e)} id="search-bar-0" type="text" aria-labelledby="search-bar-0-label" className="form-control " placeholder="Search" />
                    </label>
                    <i onClick={() => loadOrders(1, sizePerPage)} className="bx bx-search-alt search-icon" /></div>
                </div>
                <div className="table-rep-plugin">
                  <div
                    className="table-responsive mb-0"
                    data-pattern="priority-columns"
                  >
                    <Table
                      id="tech-companies-1"
                      className="table "
                    >
                      <Thead>
                        <Tr>
                          {columns.map((column, index) =>
                            <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                          )}
                        </Tr>
                      </Thead>
                      {/* if no data then show a table with a message no records
                            otherwise show data
                       */}
                      {
                        docs && docs.length === 0 
                          ? 
                          <Tbody>
                            {props.loading && <TableLoader colSpan={4} />}                            
                            {!props.loading && /*docs.length=== 0 && */
                              <>
                                <Tr>
                                  <Td colSpan={"100%"} className="fw-bolder text-center" st="true">
                                    <h3 className="fw-bolder text-center">No records</h3>
                                  </Td>
                                </Tr>
                              </>
                            }
                          </Tbody>
                          :
                          <Tbody className="text-center">
                            {loading && <TableLoader colSpan={6} />}
                            {!loading && docs.map((row, rowIndex) =>
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
                      totalPages={totalPages}
                      docs={docs}
                      sizePerPage={sizePerPage}
                      page={page}
                      totalDocs={totalDocs}
                      hasNextPage={hasNextPage}
                      hasPrevPage={hasPrevPage}
                      prevPage={prevPage}
                      nextPage={nextPage}
                      limit={limit}
                      pagingCounter={pagingCounter}
                      setSizePerPage={numPageRows}
                      onChange={loadOrders}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {<DeleteModal loading={deleteLoading} onDeleteClick={deleteOrderHandel} show={deleteModal} onCloseClick={() => { setDeleteOrderModal(false) }} />}
      </div>
    </React.Fragment>
  );
}
export default OrderList;
