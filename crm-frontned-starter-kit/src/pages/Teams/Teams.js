import React, { useEffect, useState } from "react";
import {
  useDispatch, useSelector
} from "react-redux";
import { Link } from "react-router-dom";

import {
  Row, Col, Card, CardBody, CardTitle, CardHeader 
} from "reactstrap";

import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import {
  fetchTeams, deleteTeam,
} from "store/teams/actions";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import DeleteModal from "components/Common/DeleteModal";
import TeamsAddModal from "./TeamsAddModal";
import TeamsEditModal from "./TeamsEditModal";
import TeamsEditMembersModal from "./TeamsEditMembersModal";
import { showSuccessNotification } from "store/notifications/actions";
import { MetaTags } from "react-meta-tags";

function Teams() {

  const [editModal, setEditTeamModal] = useState(false);
  const [editMembersModal, setEditMembersModal] = useState(false);

  const [deleteModal, setDeleteTeamModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState();
  const [selectedManager, setSelectedManager] = useState({});
  const [selectedMembers, setselectedMembers] = useState([]);
  const [editLoad, setEditLoad] = useState(0);

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
    // editClearingCounter,
    teamsPermissions
  } = useSelector((state) => ({
    loading: state.teamsReducer.loading || false,
    docs: state.teamsReducer.docs || [],
    page: state.teamsReducer.page || 1,
    totalDocs: state.teamsReducer.totalDocs || 0,
    totalPages: state.teamsReducer.totalPages || 0,
    hasNextPage: state.teamsReducer.hasNextPage,
    hasPrevPage: state.teamsReducer.hasPrevPage,
    limit: state.teamsReducer.limit,
    nextPage: state.teamsReducer.nextPage,
    pagingCounter: state.teamsReducer.pagingCounter,
    prevPage: state.teamsReducer.prevPage,
    deleteLoading: state.teamsReducer.deleteLoading,
    deleteClearingCounter: state.teamsReducer.deleteClearingCounter,
    // roles: state.teamsReducer.rolesData,
    clearingCounter: state.teamsReducer.clearingCounter,
    // editClearingCounter: state.teamsReducer.editClearingCounter,
    teamsPermissions: state.Profile.teamsPermissions || {}
  }));
  const { update, delete: deletePermission } = teamsPermissions;
  const columns = [
    {
      text: "Title",
      dataField: "title",
      sort: true,
    },
    {
      text: "Manager",
      dataField: "managerId",
      sort: true,
      formatter: (team) => (
        <>
          {team.managerId ? (
            <> {team.managerId.firstName + " " + team.managerId.lastName}</>
          ) : (
            " "
          )}
        </>
      ),
    },
    {
      text: "Members",
      dataField: "members",
      sort: true,
      formatter: (team) => (
        <>
          {team.members ? (
            <>
              {team.members.length}
            </>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: "Action",
      formatter: (team) => (
        <div className="text-center">
          <Link className={`text-success ${!update ? "d-none" : ""}`} to="#">
            <i
              className="mdi mdi-pencil font-size-18"
              id="edittooltip"
              onClick={() => {
                setSelectedTeam(team);
                setEditTeamModal(true);
                setSelectedManager({
                  value: team.managerId?._id,
                  label: team.managerId?.firstName,
                });
              }}
            ></i>
          </Link>
          <Link className={`text-success ${!update ? "d-none" : ""}`} to="#">
            <i
              className="mdi mdi-plus-box font-size-18"
              id="deletetoo"
              onClick={() => {
                // console.log(team);
                setSelectedTeam(team);
                setEditMembersModal(true);
                setselectedMembers(team.members);
              }
              }
            ></i>
          </Link>
          <Link className={`text-danger ${!deletePermission ? "d-none" : ""}`} to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => { setSelectedTeam(team); setDeleteTeamModal(true) }}            ></i>
          </Link>
        </div>
      ),
    },
  ];
  const [sizePerPage, setSizePerPage] = useState(10);
  const [SearchInputValue, setSearchInputValue] = useState("");
  const [currentPage, setcurrentPagePage] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    loadTeams(currentPage, sizePerPage);
  }, [sizePerPage]);

  const loadTeams = (page, limit) => {
    setcurrentPagePage(page);
    if (SearchInputValue !== "") {
      dispatch(fetchTeams({
        page,
        limit,
        searchText: SearchInputValue,
      }));
    } else {
      dispatch(fetchTeams({
        page,
        limit,
      }));
    }
  };
  const numPageRows = (numOfRows) => {
    setSizePerPage(numOfRows);
  };
  const deleteTeamHandel = () => {
    dispatch(deleteTeam(selectedTeam._id));
    dispatch(showSuccessNotification("Team deleted Successfully"));
  };

  const searchHandelEnterClik = (event) => {
    if (event.keyCode === 13) {
      loadTeams(1, sizePerPage);
    }
  };
  useEffect(() => {
    if (deleteClearingCounter > 0 && deleteModal) {
      setDeleteTeamModal(false);
    }
  }, [deleteClearingCounter]);

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Teams
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>Teams</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle className="color-primary">
                    Teams List ({totalDocs})
                  </CardTitle>
                  <TeamsAddModal />
                </CardHeader>
                <CardBody>
                  <div className="search-box me-2 mb-2 d-inline-block">
                    <div className="position-relative">
                      <label htmlFor="search-bar-0" className="search-label">
                        <span id="search-bar-0-label" className="sr-only">Search this table</span>
                        <input onChange={(e) => setSearchInputValue(e.target.value)} onKeyDown={(e) => searchHandelEnterClik(e)} id="search-bar-0" type="text" aria-labelledby="search-bar-0-label" className="form-control " placeholder="Search" />
                      </label>
                      <i onClick={() => loadTeams(1, sizePerPage)} className="bx bx-search-alt search-icon" /></div>
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
                        onChange={loadTeams}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {<TeamsEditModal open={editModal} manager={selectedManager} team={selectedTeam} onClose={() => { setEditTeamModal(false) }} />}
          {<TeamsEditMembersModal open={editMembersModal} members={selectedMembers} team={selectedTeam} onClose={() => { setEditMembersModal(false); setEditLoad(editLoad + 1) }} />}
          {<DeleteModal loading={deleteLoading} onDeleteClick={deleteTeamHandel} show={deleteModal} onCloseClick={() => { setDeleteTeamModal(false) }} />}
        </div>
      </div>
    </React.Fragment>
  );
}
export default Teams;
