import { useEffect, useState } from "react";
import { useDispatch, connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Row, Col, Card, CardBody, CardTitle, CardHeader,
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { MetaTags } from "react-meta-tags";
import { useTranslation } from "react-i18next";
import _ from "lodash";

import { deleteEmailCampaign, fetchEmailCampaigns } from "store/actions";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import formatDate from "helpers/formatDate";
import AddCampaign from "./AddCampaign";
import EditCampaign from "./EditCampaign";
import DeleteModal from "components/Common/DeleteModal";

function campainTemplates(props) {
  const { t } = useTranslation();
  const [selectedCampaign, setSelectedCampaign] = useState();
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const { update, delete: deletePermission } = props.emailCampaignPermissions;
  const columns = [
    {
      dataField: "name",
      text: t("Name"),
    },
    {
      dataField: "scheduleDate",
      text: t("Schedule Date"),
      formatter: (val) => formatDate(val.scheduleDate),
    },
    {
      dataField: "createdBy",
      text: t("Created By"),
      formatter: (val) => { return (val?.createdBy?.firstName) ? _.startCase(`${val.createdBy.firstName} ${val.createdBy.lastName}`) : " " },
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: t("Actions"),
      formatter: (item) => (
        <div className="d-flex gap-3 justify-content-center">
          <Link className={`text-success ${!update ? "d-none" : ""}`} to="#">
            <i
              className="mdi mdi-pencil font-size-18"
              id="edittooltip"
              onClick={() => {
                setSelectedCampaign(item);
                setEditModal(true);
              }}
            ></i>
          </Link>
          <Link className={`text-danger ${!deletePermission ? "d-none" : ""}`} to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => { setSelectedCampaign(item); setDeleteModal(true) }}
            ></i>
          </Link>
        </div>
      )
    }
  ];

  const [sizePerPage, setSizePerPage] = useState(10);
  const dispatch = useDispatch();
  const getEmailCampaigns = (page, limit) => {
    dispatch(fetchEmailCampaigns({
      page,
      limit
    }));
  };

  useEffect(() => {
    getEmailCampaigns(1, sizePerPage);
  }, [sizePerPage, 1, props.deleteClearingCounter, props.editClearingCounter]);

  useEffect(() => {
    if (props.deleteClearingCounter > 0 && deleteModal) {
      setDeleteModal(false);
    }
  }, [props.deleteClearingCounter]);

  return (
    <>
      <MetaTags><title>Campaigns</title></MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>{t("Campaigns")}</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle className="color-primary">{t("Campaigns List")} ({props.totalDocs})</CardTitle>
                  <AddCampaign allCampaigns={props.docs} templates={props.templates} />
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
                        {
                          props.totalDocs === 0
                            ?
                            <Tbody>
                              {props.loading && <TableLoader colSpan={4} />}
                              {!props.loading &&
                                <>
                                  <Tr>
                                    <Td colSpan={"100%"} className="fw-bolder text-center" st>
                                      <h3 className="fw-bolder text-center">No records</h3>
                                    </Td>
                                  </Tr>
                                </>
                              }
                            </Tbody>
                            :
                            <Tbody className="text-center" style={{ fontSize: "13px" }}>
                              {props.loading && <TableLoader colSpan={4} />}
                              {!props.loading && props.docs.map((row, rowIndex) =>
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
                        {...props}
                        setSizePerPage={setSizePerPage}
                        sizePerPage={sizePerPage}
                        onChange={getEmailCampaigns}
                        docs={props.docs}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {<EditCampaign
            open={editModal}
            campaign={selectedCampaign}
            allCampaigns={props.docs}
            templates={props.templates}
            onClose={() => { setEditModal(false) }}
          />}
          {<DeleteModal 
            loading={props.deleteLoading} 
            onDeleteClick={() => dispatch(deleteEmailCampaign(selectedCampaign._id)) } 
            show={deleteModal} 
            onCloseClick={()=>{setDeleteModal(false)}} 
          />}
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  templates: state.campaignTemplates.docs || [],
  loading: state.emailCampaigns.loading || false,
  docs: state.emailCampaigns.docs || [],
  totalDocs: state.emailCampaigns.totalDocs || 0,
  deleteLoading: state.emailCampaigns.deleteLoading,
  deleteClearingCounter: state.emailCampaigns.deleteClearingCounter,
  editClearingCounter: state.emailCampaigns.editClearingCounter,
  emailCampaignPermissions: state.Profile.emailCampaignPermissions || {},
  hasPrevPage: state.emailCampaigns.hasPrevPage || false,
  hasNextPage: state.emailCampaigns.hasNextPage || false,
  prevPage: state.emailCampaigns.prevPage || null,
  nextPage: state.emailCampaigns.nextPage || null,
  page: state.emailCampaigns.page || 1,
  totalPages: state.emailCampaigns.totalPages || 0,
});

export default connect(mapStateToProps, null)(campainTemplates);
