import React, { useEffect, useState } from "react";
import {
  useDispatch, useSelector
} from "react-redux";
import { Link } from "react-router-dom";

import {
  Row, Col, Card, CardBody, CardTitle, CardHeader, Input, Label, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import {
  fetchUsers, deleteUsers, fetchUsersRoles, editUser, disable2FA,
} from "store/users/actions";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import DeleteModal from "components/Common/DeleteModal";
import UsersAddModal from "./UsersAddModal";
import UsersEditModal from "./UsersEditModal";
import { showErrorNotification } from "store/notifications/actions";
import { MetaTags } from "react-meta-tags";
import formatDate from "helpers/formatDate";
import useModal from "hooks/useModal";
import EditTarget from "./EditTargetModal";
import EditUserPassword from "./EditPassword";
function UsersList() {

  const [editModal, setEditUserModal] = useState(false);
  const [deleteModal, setDeleteUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [showTarget, toggleTarget] = useModal();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);


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
    roles,
    userPermissions,
    addSuccess
    // editClearingCounter,
  } = useSelector((state) => ({
    loading: state.usersReducer.loading || false,
    docs: state.usersReducer.docs || [],
    page: state.usersReducer.page || 1,
    totalDocs: state.usersReducer.totalDocs || 0,
    totalPages: state.usersReducer.totalPages || 0,
    hasNextPage: state.usersReducer.hasNextPage,
    hasPrevPage: state.usersReducer.hasPrevPage,
    limit: state.usersReducer.limit,
    nextPage: state.usersReducer.nextPage,
    pagingCounter: state.usersReducer.pagingCounter,
    prevPage: state.usersReducer.prevPage,
    deleteLoading: state.usersReducer.deleteLoading,
    deleteClearingCounter: state.usersReducer.deleteClearingCounter,
    addSuccess: state.usersReducer.addSuccess,
    roles: state.usersReducer.rolesData,
    clearingCounter: state.usersReducer.clearingCounter,
    editClearingCounter: state.usersReducer.editClearingCounter,
    userPermissions: state.Profile.userPermissions || {},
  }));

  const { delete: deleteUserPermission, update } = userPermissions;

  const columns = [
    {
      text: "CreatedAt",
      dataField: "createdAt",
      sort: true,
      formatter: (val) => formatDate(val.createdAt),
    },
    {
      text: "First Name",
      dataField: "firstName",
      sort: true,
    },
    {
      text: "Last Name",
      dataField: "lastName",
      sort: true,
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
    },
    {
      text: "Role",
      dataField: "roleId.title",
      sort: true,
      formatter: (user) => (
        <>
          {user.roleId ? (
            <div className="text-center">
              {user.roleId.title}
            </div>
          ) : (
            <div className="d-flex gap-3">
              <Label className="me-1" data-on-label="roleId" data-off-label=""> </Label>
            </div>
          )}
        </>

      ),
    },
    {
      dataField: "isActive",
      text: "Status",
      sort: true,
      formatter: (user) => (
        <div className="text-center">
          <Input type="checkbox" id={user.id} switch="none" checked={user.isActive} onChange={() => { setSelectedUser(user); statusUser(user) }} />
          <Label className="me-1" htmlFor={user.id} data-on-label="" data-off-label=""></Label>
        </div>
      ),
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: "Action",
      formatter: (user) => (
        <div className="d-flex gap-3 justify-content-center">
          <Link className="text-success" to="#">
            <i
              className={`mdi mdi-pencil font-size-18 ${!update ? "d-none" : ""}`}
              id="edittooltip"
              onClick={() => { setSelectedUser(user); setEditUserModal(true) }}
            ></i>
          </Link>
          <Link className="text-danger" to="#">
            <i
              className={`mdi mdi-delete font-size-18 ${!deleteUserPermission ? "d-none" : ""}`}
              id="deletetooltip"
              onClick={() => { setSelectedUser(user); setDeleteUserModal(true) }}
            ></i>
          </Link>
          <UncontrolledDropdown>
            <DropdownToggle tag="i"
              className={`text-muted ${!update ? "d-none" : ""}`}
              style={{ cursor: "pointer" }}
              disabled={!update}
              onClick={() => {
                setSelectedUser(user);
              }}>
              <i className="mdi mdi-dots-horizontal font-size-18"
              />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem
                disabled={!update}
                onClick={togglePassword}>Change Password</DropdownItem>
              <DropdownItem
                disabled={user?.roleId?.permissions?.users?.canBeAssigned !== true}
                onClick={toggleTarget}>Change Target</DropdownItem>
              <DropdownItem onClick={() => {
                dispatch(disable2FA({ id: user._id }));
              }}>Disable 2FA</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      ),
    },
  ];
  const [sizePerPage, setSizePerPage] = useState(10);
  const [SearchInputValue, setSearchInputValue] = useState("");
  const [currentPage, setcurrentPagePage] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    loadUsers(currentPage, sizePerPage);
    loadRoles(1, 100);
  }, [sizePerPage, 1, deleteClearingCounter, addSuccess]);

  const loadUsers = (page, limit) => {
    setcurrentPagePage(page);
    if (SearchInputValue !== "") {
      dispatch(fetchUsers({
        page,
        limit,
        searchText: SearchInputValue,
      }));
    } else {
      dispatch(fetchUsers({
        page,
        limit,
      }));
    }
  };
  const numPageRows = (numOfRows) => {
    setSizePerPage(numOfRows);
  };
  const loadRoles = (page, limit) => {
    dispatch(fetchUsersRoles({
      page,
      limit,
    }));

  };
  const deleteUser = () => {
    const currentUser = JSON.parse(localStorage.getItem("authUser"));
    if (selectedUser.email == currentUser.email){
      dispatch(showErrorNotification("Cannot delete same user as you logged in right now!"));
      setDeleteUserModal(false);
    } else
      dispatch(deleteUsers(selectedUser._id));
  };

  const statusUser = (user) => {
    const values = {
      "isActive": !user.isActive
    };
    dispatch(editUser({
      id: user._id,
      values
    }));

  };
  const searchHandelEnterClik = (event) => {
    if (event.keyCode === 13) {
      loadUsers(1, sizePerPage);
    }
  };

  const allUsersEmails = docs.map((doc) => (
    doc.email
  ));

  useEffect(() => {
    if (deleteClearingCounter > 0 && deleteModal) {
      setDeleteUserModal(false);
    }
  }, [deleteClearingCounter]);

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Users
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>Users</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle className="color-primary">
                    Users List ({totalDocs})
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="d-flex flex-row align-items-center justify-content-between">
                    <div className="d-flex flex-row align-items-center">
                      <div className="app-search d-none d-lg-block">
                        <div className="position-relative">
                          <input onChange={(e) => setSearchInputValue(e.target.value)} onKeyDown={(e) => searchHandelEnterClik(e)} id="search-bar-0" type="text" aria-labelledby="search-bar-0-label" className="form-control " placeholder="Search" />
                          <button className="btn btn-primary" type="button">
                            <i onClick={() => loadUsers(1, sizePerPage)} className="bx bx-search-alt align-middle"></i></button>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex flex-row align-items-center justify-content-between">
                      <UsersAddModal usersRoles={roles} allUsersEmails={allUsersEmails} />
                    </div>
                  </div>
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
                        <Tbody className="text-center" style={{ 
                          fontSize: "13px",
                           
                        }}>
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
                        onChange={loadUsers}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {<UsersEditModal allUsersEmails={allUsersEmails} open={editModal} user={selectedUser} usersRoles={roles} onClose={() => { setEditUserModal(false) }} />}
          {<DeleteModal loading={deleteLoading} onDeleteClick={deleteUser} show={deleteModal} onCloseClick={() => { setDeleteUserModal(false) }} />}
          {<EditTarget show={showTarget} toggle={toggleTarget} user={selectedUser}/>}
          {<EditUserPassword open={showPassword} toggle={togglePassword} user={selectedUser}/>}
        </div>
      </div>
    </React.Fragment>
  );
}
export default UsersList;
