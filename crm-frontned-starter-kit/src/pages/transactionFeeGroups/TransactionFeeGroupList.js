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
import TransactionFeeGroupEdit from "./TransactionFeeGroupEdit";
import TransactionFeeGroupAdd from "./TransactionFeeGroupAdd";
import { checkAllBoxes } from "common/utils/checkAllBoxes";
import { MetaTags } from "react-meta-tags";
import formatDate from "helpers/formatDate";

function TransactionFeeGroupList(props) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletedItem, setDeletedItem] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [editModal, setEditModal] = useState(false);
  const { update, delete: deletePermission } = props.transactionFeeGroupsPermissions;
  const columns = [
    {
      dataField: "checkbox",
      text: <input type="checkbox" id="check-all-fee-groups" onChange={()=>checkAllBoxes("check-all-fee-groups", ".fee-group-checkbox")}/>
    },

    {
      dataField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => formatDate(val.createdAt),
    },
    {
      dataField: "title",
      text: props.t("Title")
    },
    {
      dataField: "isPercentage",
      text: props.t("isPercentage"),
      formatter: (val) => (val.isPercentage ? "True" : "False"),
    },
    {
      dataField: "value",
      text: props.t("Value"),
      formatter: (val) => (val?.value?.$numberDecimal || ""),

    },
    {
      dataField: "maxValue",
      text: props.t("Max Value"),
      formatter: (val) => (val?.maxValue?.$numberDecimal || ""),
    },
    {
      dataField: "minValue",
      text: props.t("Min Value"),
      formatter: (val) => (val?.minValue?.$numberDecimal || ""),
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: "Action",
      formatter: (item) => (
        <div className="d-flex gap-3 justify-content-center">
          <Link className={`text-success ${!update ? "d-none" : ""}`} to="#">
            <i
              className="mdi mdi-pencil font-size-18"
              id="edittooltip"
              onClick={() => { setEditModal(!editModal); setSelectedItem(item) }}
            ></i>
          </Link>
          <Link className={`text-danger ${!deletePermission ? "d-none" : ""}`} to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => { setDeleteModal(!deleteModal); setDeletedItem(item) }}
            ></i>
          </Link>
        </div>
      ),
    },
  ];

  const [sizePerPage, setSizePerPage] = useState(10);

  const dispatch = useDispatch();


  useEffect(() => {
    loadFeeGroups(1, sizePerPage);
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
  const loadFeeGroups = (page, limit) => {
    dispatch(fetchTransactionFeeGroupStart({
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
          Transaction Fee Groups
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>{props.t("Transaction Fee Groups")}</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <CardTitle>{props.t("Transaction Fee Groups List")} ({props.totalDocs})</CardTitle>
                    <TransactionFeeGroupAdd />
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
                        className="table table-hover "
                      >
                        <Thead className="text-center table-light" >
                          <Tr>
                            {columns.map((column, index) =>
                              <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                            )}
                          </Tr>
                        </Thead>
                        <Tbody style={{
                          fontSize: "12px",
                          textAlign: "center",
                          textTransform: "capitalize"
                        }}>
                          {props.loading && <TableLoader colSpan={4} />}
                          {!props.loading && props.transactionFeeGroups.map((row, rowIndex) =>
                            <Tr key={rowIndex}>
                              {columns.map((column, index) =>
                                <Td key={`${rowIndex}-${index}`}>
                                  {column.dataField === "checkbox" ? <input className="fee-group-checkbox" type="checkbox" /> : ""}
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
                        onChange={loadFeeGroups}
                        docs={props.feeGroups}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {<TransactionFeeGroupEdit disabled={props.editButtonDisabled} open={editModal} selectedItem={selectedItem} onClose={() => setEditModal(false)} />}
          {<DeleteModal loading={props.deleteLoading} show={deleteModal} onDeleteClick={deleteFeeGroup} onCloseClick={() => setDeleteModal(false)} />}
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  loading: state.transactionFeeGroupReducer.loading || false,
  transactionFeeGroups: state.transactionFeeGroupReducer.transactionFeeGroups || [],
  page: state.transactionFeeGroupReducer.page || 1,
  totalDocs: state.transactionFeeGroupReducer.totalDocs || 0,
  totalPages: state.transactionFeeGroupReducer.totalPages || 0,
  hasNextPage: state.transactionFeeGroupReducer.hasNextPage,
  hasPrevPage: state.transactionFeeGroupReducer.hasPrevPage,
  limit: state.transactionFeeGroupReducer.limit,
  nextPage: state.transactionFeeGroupReducer.nextPage,
  pagingCounter: state.transactionFeeGroupReducer.pagingCounter,
  prevPage: state.transactionFeeGroupReducer.prevPage,
  showEditSuccessMessage: state.transactionFeeGroupReducer.showEditSuccessMessage,
  showDeleteModal: state.transactionFeeGroupReducer.showDeleteModal,
  deleteLoading: state.transactionFeeGroupReducer.deleteLoading,
  editButtonDisabled: state.transactionFeeGroupReducer.editButtonDisabled,
  transactionFeeGroupsPermissions: state.Profile.transactionFeeGroupsPermissions || {}
});

export default connect(mapStateToProps, null)(withTranslation()(TransactionFeeGroupList));
