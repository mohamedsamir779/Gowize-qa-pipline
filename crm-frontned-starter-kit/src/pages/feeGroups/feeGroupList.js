import React, { useEffect, useState } from "react";
import { 
  useDispatch,  connect 
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
import { fetchFeeGroupStart, deleteFeeGroupStart } from "store/feeGroups/actions";
import DeleteModal from "components/Common/DeleteModal";
import FeeGroupAdd from "./feeGroupAdd";
import FeeGroupEdit from "./feeGroupEdit";
import { fetchMarketsStart } from "store/markets/actions";
import { checkAllBoxes } from "common/utils/checkAllBoxes";
import { MetaTags } from "react-meta-tags";
import formatDate from "helpers/formatDate";
function FeeGroupsList(props) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletedItem, setDeletedItem] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [editModal, setEditModal ] = useState(false);
  const { update, delete:deletePermission } = props.feeGroupsPermissions;
  const columns = [
    {
      dataField:"checkbox",
      text: <input type="checkbox" id="check-all-fee-groups" onChange={()=>checkAllBoxes("check-all-fee-groups", ".fee-group-checkbox")}/>
    },
    
    {
      dataField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => formatDate(val.createdAt)
    }, 
    {
      dataField:"title",
      text : props.t("Title")
    },
    {
      dataField: "isPercentage",
      text: props.t("Is Percentage"),
      formatter: (val) => (val.isPercentage ? "TRUE" : "FALSE"),
    },
    {
      dataField: "value",
      text:props.t("Value"),
      formatter: (val) => (val.value ? val.value.$numberDecimal : "")
    },
    {
      dataField: "maxValue",
      text:props.t("Max Value"),
      formatter: (val) => (val.minValue ? val.maxValue.$numberDecimal : "")
     
    },
    {
      dataField: "minValue",
      text:props.t("Min Value"),
      formatter: (val) => (val.minValue ? val.minValue.$numberDecimal : "")
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: "Action",
      formatter: (item) => (
        <div className="d-flex gap-3">
          <Link className={`text-success ${!update ? "d-none" : ""}`} to="#">
            <i
              className="mdi mdi-pencil font-size-18"
              id="edittooltip"
              onClick={() => {setEditModal(!editModal); setSelectedItem(item)}}
            ></i>
          </Link>
          <Link className={`text-danger ${!deletePermission ? "d-none" : ""}`} to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => {setDeleteModal(!deleteModal) ; setDeletedItem(item)}}
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
  useEffect(()=>{
    dispatch(fetchMarketsStart({
      limit:1000,
      page:1
    }));
  }, []);
  useEffect(()=>{
    if (!props.showEditSuccessMessage && editModal) {
      setEditModal(false);
      
    }
  }, [props.showEditSuccessMessage]);
  useEffect(()=>{
    if (!props.showDeleteModal && deleteModal) {
      setDeleteModal(false);
      
    }
  }, [props.showDeleteModal]);
  const loadFeeGroups = (page, limit) => {
    dispatch(fetchFeeGroupStart({
      page,
      limit
    }));
  };
  const deleteFeeGroup = ()=>{
    dispatch(deleteFeeGroupStart(deletedItem._id));
  };
  

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Trading Fee Groups
        </title>
      </MetaTags>
      <div className="page-content"> 
        <div className="container-fluid">
          <h2>{props.t("Trading Fee Group")}</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between  align-items-center">
                    <CardTitle className="color-primary">{props.t("Fee Groups List")} ({props.totalDocs})</CardTitle>
                    <FeeGroupAdd/>
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
                        <Tbody style={{
                          fontSize: "12px",
                          textAlign: "center",
                          textTransform: "capitalize"
                        }}>
                          {props.loading && <TableLoader colSpan={4} />}
                          {!props.loading && props.feeGroups.map((row, rowIndex) =>
                            <Tr key={rowIndex}>
                              {columns.map((column, index) =>
                                <Td key={`${rowIndex}-${index}`}>
                                  { column.dataField === "checkbox" ? <input  className = "fee-group-checkbox" type="checkbox"/> : ""}
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
          {<FeeGroupEdit disabled= {props.editButtonDisabled} open ={editModal} selectedItem={selectedItem} onClose={()=>setEditModal(false)}/>}
          {<DeleteModal loading ={props.deleteLoading} show={deleteModal} onDeleteClick={deleteFeeGroup} onCloseClick={()=>setDeleteModal(false)}/>}
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  loading: state.feeGroupReducer.loading || false,
  feeGroups: state.feeGroupReducer.feeGroups || [],
  page: state.feeGroupReducer.page || 1,
  totalDocs: state.feeGroupReducer.totalDocs || 0,
  totalPages: state.feeGroupReducer.totalPages || 0,
  hasNextPage: state.feeGroupReducer.hasNextPage,
  hasPrevPage: state.feeGroupReducer.hasPrevPage,
  limit: state.feeGroupReducer.limit,
  nextPage: state.feeGroupReducer.nextPage,
  pagingCounter: state.feeGroupReducer.pagingCounter,
  prevPage: state.feeGroupReducer.prevPage,
  showEditSuccessMessage:state.feeGroupReducer.showEditSuccessMessage,
  showDeleteModal:state.feeGroupReducer.showDeleteModal,
  deleteLoading :state.feeGroupReducer.deleteLoading,
  editButtonDisabled: state.feeGroupReducer.editButtonDisabled,
  feeGroupsPermissions : state.Profile.feeGroupsPermissions || {},
});

export default connect(mapStateToProps, null)(withTranslation()(FeeGroupsList));
