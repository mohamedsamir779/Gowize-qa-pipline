import React, { useEffect, useState } from "react";
import {
  useDispatch, connect
} from "react-redux";
import { Link } from "react-router-dom";

import {
  Row, Col, Card, CardBody, CardTitle, CardHeader, Input, Label, Spinner,
} from "reactstrap";

import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import {
  fetchRoles, deleteRoles, changeStatus,
} from "store/roles/actions";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import DeleteModal from "components/Common/DeleteModal";
import RolesAdd from "./RolesAdd";
import RolesEdit from "./RolesEdit";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import { MetaTags } from "react-meta-tags";
import formatDate from "helpers/formatDate";

function RolesList(props){
  const [editModal, setEditUserModal] = useState(false);
  const [deleteModal, setDeleteUserModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState();
  const { update, delete:deleteRolePermission }  = props.rolesPermissions;
  const columns = [
    {
      dataField: "createdAt",
      text: "Created Date",
      formatter: (val) => formatDate(val.createdAt)
    }, 
    {
      dataField:"title",
      text:"Title",
      formatter: (item) => (
        captilazeFirstLetter(item.title)
      )
    },
    {
      dataField: "createdBy",
      text: "Created By",
      formatter: (val) => {return (val.createdBy && val.createdBy.firstName) ? `${captilazeFirstLetter(val.createdBy.firstName)} ${captilazeFirstLetter(val.createdBy.lastName)}` : ""},
    },
    {
      dataField: "isActive",
      text: "Status",
      formatter: (item, index) => (
        <div className="d-flex gap-3 justify-content-center">
          {(props.changeStatusLoading && props.changeStatusLoadingIndex === index) ? <React.Fragment>
            <Spinner className="ms-2" color="primary" />  
          </React.Fragment> : <React.Fragment>
            <Input
              checked={item.isActive}
              type="checkbox"
              onChange={(e) => {updateStatus(e, item, index)}}
              id={item.id}
              switch="none"
              // defaultChecked={item.isActive}
              // onClick={() => {}}
            />
            <Label className="me-1" htmlFor={item.id} data-on-label="" data-off-label=""></Label>
          </React.Fragment>}
        </div>
      ),
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: "Action",
      formatter: (item) => (
        <div className="d-flex gap-3 justify-content-center">
          <Link className="text-success" to="#">
            <i
              className={`mdi mdi-pencil font-size-18 ${!update ? "d-none" : ""}`}
              id="edittooltip"
              onClick={() => {setSelectedRole(item); setEditUserModal(true)}}
            ></i>
          </Link>
          <Link className="text-danger" to="#">
            <i
              className={`mdi mdi-delete font-size-18 ${!deleteRolePermission ? "d-none" : ""}`}
              id="deletetooltip"
              onClick={() => { setSelectedRole(item); setDeleteUserModal(true)}}
            ></i>
          </Link>
        </div>
      ),
    },
  ];
  const [sizePerPage, setSizePerPage] = useState(10);
  const dispatch = useDispatch();
  
  useEffect(()=>{
    loadRoles(1, sizePerPage);
  }, [sizePerPage, 1, props.editResult, props.deleteClearingCounter, props.addSuccess]);

  const loadRoles = (page, limit) => {
    dispatch(fetchRoles({
      page,
      limit,
    }));
  };

  const deleteRole = () => {
    dispatch(deleteRoles(selectedRole._id));
  };

  const updateStatus = (event, item, index) => {
    dispatch(changeStatus(item._id, !item.isActive ? "activate" : "deactivate", index));
    event.preventDefault();
  };

  useEffect(()=>{
    if (props.deleteClearingCounter > 0 && deleteModal) {
      setDeleteUserModal(false);
    }
  }, [props.deleteClearingCounter]);

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Roles
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>Roles</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle className="color-primary">Roles List ({props.totalDocs})</CardTitle>
                  <RolesAdd />
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
                        <Tbody className="text-center" style={{ fontSize: "13px" }}>
                          {props.loading && <TableLoader colSpan={4} />}
                          {!props.loading && props.docs.map((row, rowIndex) =>
                            <Tr key={rowIndex}>
                              {columns.map((column, index) =>
                                <Td key={`${rowIndex}-${index}`}>
                                  { column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
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
                        onChange={loadRoles}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {<RolesEdit open={editModal}  role={selectedRole} onClose={()=>{setEditUserModal(false)}} />}
          {<DeleteModal loading={props.deleteLoading} onDeleteClick={deleteRole} show={deleteModal } onCloseClick={()=>{setDeleteUserModal(false)}} />}
        </div>
      </div>
    </React.Fragment>
  );
}
// export default RolesList


const mapStateToProps = (state) => ({
  loading: state.rolesReducer.loading || false,
  docs: state.rolesReducer.docs || [],

  changeStatusLoading: state.rolesReducer.changeStatusLoading,
  changeStatusLoadingIndex: state.rolesReducer.changeStatusLoadingIndex,
  page: state.rolesReducer.page || 1,
  totalDocs: state.rolesReducer.totalDocs || 0,
  totalPages: state.rolesReducer.totalPages || 0,
  hasNextPage: state.rolesReducer.hasNextPage,
  hasPrevPage: state.rolesReducer.hasPrevPage,
  limit: state.rolesReducer.limit,
  nextPage: state.rolesReducer.nextPage,
  pagingCounter: state.rolesReducer.pagingCounter,
  prevPage: state.rolesReducer.prevPage,
  deleteLoading: state.rolesReducer.deleteLoading,
  deleteClearingCounter: state.rolesReducer.deleteClearingCounter,
  rolesPermissions: state.Profile.rolesPermissions || {},
  editResult: state.rolesReducer.editResult,
  addSuccess: state.rolesReducer.addSuccess
});
export default connect(mapStateToProps, null)(RolesList);
