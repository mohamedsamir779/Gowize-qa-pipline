import React, { useEffect, useState } from "react";
import {
  useDispatch, connect, useSelector 
} from "react-redux";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
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
import * as axiosHelper from "../../../apis/api_helper";
import AddLink from "./AddLink";
import formatDate from "helpers/formatDate";
import EditLink from "./EditLink";
import DeleteLink from "./DeleteLink";

  
function MarketingLinks(props) {
  const [sizePerPage, setSizePerPage] = useState(50);
  const [showModal, setShowModal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMarketingLink, setSelectedMarketingLink] = useState({});
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState({});
  const [state, setState] = useState({
    docs:[],
    totalDocs:0,
    
  });

  const { userPermissions, roles } = useSelector((state) => ({
    roles: state.usersReducer.rolesData,
    userPermissions: state.Profile.userPermissions || {},
  }));

  useEffect(() => {
    loadCampaigns(1, sizePerPage);
  }, [sizePerPage, 1]);

  const loadCampaigns = async (page, limit) => {
    setLoading(true);
    const campaignLink = await axiosHelper.get("/utm-campaign");
    setLoading(false);
    setState(campaignLink.result);
  };

  const { delete: deleteUserPermission, update } = userPermissions;
  const columns = [
    {
      dataField: "name",
      text: "Name",
    },
    {
      dataField: "source",
      text: "Source",
    },
    {
      dataField: "userId",
      text: "Assigned User",
      formatter: (val) => {
        if (val.userId){
          return `${val.userId.firstName} ${val.userId.lastName}`;
        } else return <></>;
      }
    },
    {
      dataField: "type",
      text: "Type",
    },
    {
      dataField: "urlType",
      text: "URL Type",
    },
    {
      dataField: "fullUrl",
      text: "Full URL",
      formatter: (val) => <a href={val.fullUrl}>{val.fullUrl}</a>
    },
    {
      dataField: "createdAt",
      text: "Created Date",
      formatter: (val) => formatDate(val.createdAt)
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: "Action",
      formatter: (value) => (
        <div className="d-flex gap-3 justify-content-center">
          <Link className="text-success" to="#">
            <i
              className={`mdi mdi-pencil font-size-18 ${!update ? "d-none" : ""}`}
              id="edittooltip"
              onClick={() => { 
                setSelectedMarketingLink(value);
                setEditModal(true);
              }}
            ></i>
          </Link>
          <Link className="text-danger" to="#">
            <i
              className={`mdi mdi-delete font-size-18 ${!deleteUserPermission ? "d-none" : ""}`}
              id="deletetooltip"
              onClick={() => {
                setSelectedMarketingLink(value);
                setDeleteModal(true);
              }}
            ></i>
          </Link>
        </div>
      ),
    }
  ];

  return (<React.Fragment>
    <div className="page-content">
      <div className="container-fluid">
        <h2>{props.t("Marketing Links")}</h2>
        <Row>
          <Col className="col-12">
            <Card>
              <CardHeader className="d-flex flex-column gap-3">
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <CardTitle className="color-primary">{props.t("Marketing Links")} ({state.totalDocs})</CardTitle>
                  <AddLink
                    show={showModal}
                    hidenAddButton={true}
                    onClose={()=>{
                      loadCampaigns();
                    }}
                    editModal={editModal}
                  />
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
                      className="table table-hover table-clients"
                    >
                      <Thead className="text-center table-light" >
                        <Tr>
                          {columns.map((column, index) =>
                            <Th data-priority={index} key={index}>{column.text}</Th>
                          )}
                        </Tr>
                      </Thead>
                      <Tbody className="text-center" style={{ fontSize: "13px" }}>
                        {loading && <TableLoader colSpan={4} />}
                        {!loading && state.docs.map((row, rowIndex) =>
                          <Tr key={rowIndex} style={{ overflow: "visible" }} >
                            {columns.map((column, index) =>
                              <Td key={`${rowIndex}-${index}`}
                                style={{
                                  overflow: column.dataField === "actions" && "visible",
                                  maxWidth: column.dataField === "actions" && "140px"
                                }}>
                                {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                              </Td>
                            )}
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                    <CustomPagination
                      {...state}
                      setSizePerPage={setSizePerPage}
                      sizePerPage={sizePerPage}
                      onChange={loadCampaigns}
                      docs={state.docs}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <EditLink
          open={editModal}
          link={selectedMarketingLink} 
          onClose={() => { 
            setEditModal(false);
            loadCampaigns();
          }} 
          t={props.t}
          
        />
        <DeleteLink
          link={selectedMarketingLink}
          show={deleteModal}
          onCloseClick={() => { 
            setDeleteModal(false);
            loadCampaigns();
          }}
        />
      </div>
    </div>
  </React.Fragment> );
}
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, null)(withTranslation()(MarketingLinks));