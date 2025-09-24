import React, { useState, useEffect } from "react";
import { useDispatch, connect } from "react-redux";
import {
  Row, Col, Card, CardBody,
  CardTitle, CardHeader
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Link } from "react-router-dom";

// i18n
import { withTranslation } from "react-i18next";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import {
  fetchTodosStart, deleteTodosStart, fetchRemindersStart, fetchNotesStart, fetchRemarksStart
} from "store/actions";
import TodoAdd from "components/Common/TodoAdd";
import TodoEdit from "components/Common/TodoEdit";
import DeleteModal from "components/Common/DeleteModal";
import formatDate from "helpers/formatDate";
import { getNoteType } from "common/utils/getNoteType";

function Todos(props) {
  const [sizePerPage, setSizePerPage] = useState(10);
  const [data, setData] = useState([]);
  const [todoObj, setTodoObj] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const columns = [
    {
      dataField: "recordId",
      text: props.t("ID")
    },
    {
      dataField: "note",
      text: props.t("Note")
    },
    {
      dataField: "createdBy",
      text: props.t("Posted By"),
      formatter: (val) => (val.createdBy && val.createdBy.firstName ? `${val.createdBy.firstName} ${val.createdBy.lastName}` : "")
    },
    {
      dataField: "createdAt",
      text: props.t("Date Created"),
      formatter: (val) => formatDate(val.createdAt)
    },
    {
      dataField: "timeEnd",
      text: props.t("Time"),
      formatter: (val) => formatDate(val.timeEnd)
    },
    {
      dataField: "status",
      text: props.t("Status"),

    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Action"),
      formatter: (obj) => (
        <div className={props.currentUserId !== obj.createdBy._id && "d-none"}>
          <Link className="p-2 text-success" to="#">
            <i
              className={"mdi mdi-pencil font-size-18"}
              id="edittooltip"

              onClick={() => { setTodoObj(obj); setShowModal(true) }}
            ></i>
          </Link>
          <Link className="p-2 text-danger" to="#">
            <i
              className={"mdi mdi-delete font-size-18"}
              id="deletetooltip"
              onClick={() => { setTodoObj(obj); setShowDeleteModal(true) }}
            ></i>
          </Link>
        </div>
      ),
    },
  ];

  // remove status and timeEnd for notes
  if (props.type === 2 || props.type === 3) {
    columns.splice(4, 2);
  }

  const dispatch = useDispatch();
  const fetchData = async (page) => {
    const params = {
      page: page || 1,
      limit: sizePerPage,
      customerId: props.clientId,
    };
    let fetch;
    switch (props.type) {
      case 0:
        fetch = fetchTodosStart;
        break;
      case 1:
        fetch = fetchRemindersStart;
        break;
      case 2:
        fetch = fetchNotesStart;
        break;
      case 3:
        fetch = fetchRemarksStart;
        break;
    }
    dispatch(fetch(params));
  };

  useEffect(() => {
    fetchData(1);
  }, [props.deletingClearCounter, sizePerPage]);

  useEffect(() => {
    switch (props.type) {
      case 0:
        setData(props.todos);
        break;
      case 1:
        setData(props.reminders);
        break;
      case 2:
        setData(props.notes);
        break;
      case 3:
        setData(props.remarks);
        break;
    }
  }, [props.todos, props.reminders, props.notes, props.remarks]);

  const deleteRole = () => {
    dispatch(deleteTodosStart({
      id: todoObj._id,
      type: todoObj.type
    }));
  };

  useEffect(() => {
    if (props.deletingClearCounter > 0 && showDeleteModal) {
      setShowDeleteModal(false);
    }
  }, [props.deletingClearCounter]);

  return (
    <React.Fragment>
      <div className="">
        <div className="container-fluid">
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <CardTitle className="color-primary">
                    {props.t(getNoteType(props.type))}
                  </CardTitle>
                  <TodoAdd selectedClient={props.selectedClient} type={props.type} />
                  <TodoEdit
                    show={showModal}
                    data={todoObj}
                    onClose={() => { setShowModal(false) }}
                    type={props.type}
                  />
                  <DeleteModal
                    loading={props.deleteLoading}
                    onDeleteClick={deleteRole}
                    show={showDeleteModal}
                    onCloseClick={() => { setShowDeleteModal(false) }}
                  />
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
                              <Th data-priority={index} key={index}>
                                <span className="color-primary">{column.text}</span>
                              </Th>
                            )}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {props.loading && <TableLoader colSpan={4} />}
                          {!props.loading && data.length === 0 &&
                            <>
                              <Tr>
                                <Td colSpan={"100%"} className="fw-bolder text-center" st="true">
                                  <h3 className="fw-bolder text-center">No records</h3>
                                </Td>
                              </Tr>
                            </>
                          }
                          {!props.loading && data.map((row, rowIndex) =>
                            <Tr key={rowIndex}>
                              {columns.map((column, index) =>
                                <Td key={`${rowIndex}-${index}`} className="text-center">
                                  {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                                </Td>
                              )}
                            </Tr>
                          )}
                        </Tbody>

                      </Table>
                      <CustomPagination
                        {...props.pagination}
                        docs={data}
                        setSizePerPage={setSizePerPage}
                        sizePerPage={sizePerPage}
                        onChange={fetchData}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  clientDetails: state.clientReducer.clientDetails || {},
  todos: state.todosReducer?.todos?.docs || [],
  reminders: state.todosReducer?.reminders?.docs || [],
  notes: state.todosReducer?.notes?.docs || [],
  remarks: state.todosReducer?.remarks?.docs || [],
  pagination: state.todosReducer.list || {},
  loading: state.todosReducer.loading,
  selectedClient: state.clientReducer.clientDetails || {},
  deletingClearCounter: state.todosReducer.deletingClearCounter,
});

export default connect(mapStateToProps, null)(withTranslation()(Todos));
