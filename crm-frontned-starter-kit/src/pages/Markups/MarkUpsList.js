import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  UncontrolledAlert,
} from "reactstrap";
import { fetchMarkupsStart, deleteMarkupStart } from "store/markups/actions";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import TableLoader from "components/Common/TableLoader";
import CustomPagination from "components/Common/CustomPagination";
import { Link } from "react-router-dom";
import MarkupEdit from "./MarkupEdit";
import DeleteModal from "components/Common/DeleteModal";
import AddMarkup from "./AddMarkup";
import { MetaTags } from "react-meta-tags";
import formatDate from "helpers/formatDate";


function MarkUpsList(props) {
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [selectedMarkup, setSelectedMarkup] = useState();
  const t = props.t;
  const { update, delete:deletePermission } = props.markupsPermissions;
  const dispatch = useDispatch();


  const columns = [
    {
      dataField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => formatDate(val.createdAt)
    },
    {
      dataField: "title",
      text: props.t("Title"),
    },
    {
      dataField: "createdBy",
      text: props.t("Created By"),
      formatter: (val) => (val && val.createdBy && `${val.createdBy.firstName} ${val.createdBy.lastName}`)
    },
    {
      dataField: "value",
      text: props.t("Value"),
      formatter: (val) => (val?.value?.$numberDecimal || ""),
    },
    {
      dataField: "isActive",
      text: props.t("isActive"),
      formatter: (item) => {
        if (item.isActive)
          return <i className="mdi mdi-checkbox-marked-circle-outline font-size-22" style={{ color: "green" }}></i>;
        else
          return <i className="mdi mdi-close-circle-outline font-size-22" style={{ color: "red" }}></i>;
      },
    },
    {
      dataField: "isDefault",
      text: props.t("isDefault"),
      formatter: (item) => {
        if (item.isDefault)
          return <i className="mdi mdi-checkbox-marked-circle-outline font-size-22" style={{ color: "green" }}></i>;
        else
          return <i className="mdi mdi-close-circle-outline font-size-22" style={{ color: "red" }}></i>;
      },
    },
    {
      dataField: "isPercentage",
      text: props.t("isPercentage"),
      formatter: (item) => {
        if (item.isPercentage)
          return <i className="mdi mdi-checkbox-marked-circle-outline font-size-22" style={{ color: "green" }}></i>;
        else
          return <i className="mdi mdi-close-circle-outline font-size-22" style={{ color: "red" }}></i>;
      },
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Action"),
      formatter: (item) => (
        <div className="d-flex gap-3">
          <Link className={`text-success ${!update ? "d-none" : ""}`} to="#">
            <i
              className="mdi mdi-pencil font-size-18"
              id="edittooltip"
              onClick={() => {
                setSelectedMarkup(item);
                setEditModal(true);
              }}
            ></i>
          </Link>
          <Link className={`text-danger ${!deletePermission ? "d-none" : ""}`} to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => {
                setSelectedMarkup(item);
                setDeleteModal(true);
              }}
            ></i>
          </Link>
        </div>
      ),
    },
  ];

  useEffect(() => {
    loadMarkups(1, sizePerPage);
  }, [sizePerPage, 1, props.addMarkupSuccess, props.editR]);

  const loadMarkups = (page, limit) => {
    dispatch(
      fetchMarkupsStart({
        limit,
        page,
      })
    );
  };

  const deleteMarkup = () => {
    dispatch(deleteMarkupStart(selectedMarkup._id));
  };

  useEffect(() => {
    if (props.closeDeleteModal)
      setDeleteModal(false);
  }, [props.closeDeleteModal]);

  useEffect(() => {
    if (props.deleteModalClear && deleteModal) {
      setDeleteModal(false);
    }
  }, [props.deleteModalClear]);

  return (<>
    <React.Fragment>
      <MetaTags>
        <title>
          Markups
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>{t("Markups")}</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between  align-items-center">
                    <CardTitle>
                      {props.t("Markups List")} ({props.totalDocs})
                    </CardTitle>
                    <AddMarkup/>
                  </div>
                </CardHeader>
                <CardBody>
                  {props.error ? <>
                    <UncontrolledAlert color="danger">
                      <i className="mdi mdi-block-helper me-2"></i>
                      {props.t(props.error)}
                    </UncontrolledAlert>
                  </> : <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                    >
                      <Table
                        id="tech-companies-1"
                        className="table table-hover"
                      >
                        <Thead className="text-center table-light" >
                          <Tr>
                            {columns.map((column, index) => (
                              <Th data-priority={index} key={index}>
                                <span className="color-primary">{column.text}</span>
                              </Th>
                            ))}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {props.loading && <TableLoader colSpan={12} />}
                          {!props.loading &&
                            props.markups.map((row, rowIndex) => (
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
                        onChange={loadMarkups}
                        docs={props.markups}
                      />
                    </div>
                  </div>}

                </CardBody>
              </Card>
            </Col>
          </Row>
          <MarkupEdit
            open={editModal}
            markup={selectedMarkup}
            onClose={() => setEditModal(false)}
          />
          <DeleteModal loading={props.deleteLoading} onDeleteClick={deleteMarkup} show={deleteModal} onCloseClick={() => setDeleteModal(false)} />
        </div>
      </div>
    </React.Fragment>
  </>);
}
const mapStateToProps = (state) => ({
  loading: state.markupsReducer.loading || false,
  markups: state.markupsReducer.markups || [],
  page: state.markupsReducer.page || 1,
  totalDocs: state.markupsReducer.totalDocs || 0,
  totalPages: state.markupsReducer.totalPages || 0,
  hasNextPage: state.markupsReducer.hasNextPage,
  hasPrevPage: state.markupsReducer.hasPrevPage,
  limit: state.markupsReducer.limit,
  nextPage: state.markupsReducer.nextPage,
  pagingCounter: state.markupsReducer.pagingCounter,
  prevPage: state.markupsReducer.prevPage,
  deleteLoading: state.markupsReducer.deleteLoading,
  deleteModalClear: state.markupsReducer.deleteModalClear,
  error: state.markupsReducer.error,
  addMarkupSuccess: state.markupsReducer.addMarkupSuccess,
  editR: state.markupsReducer.editR,
  markupsPermissions : state.Profile.markupsPermissions || {}
});

export default connect(mapStateToProps, null)(withTranslation()(MarkUpsList));