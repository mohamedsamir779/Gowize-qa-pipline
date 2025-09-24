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

import { deleteCampaignTemplate, fetchCampaignTemplates } from "store/actions";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import formatDate from "helpers/formatDate";
import AddTemplate from "./AddTemplate";
import EditTemplate from "./EditTemplate";
import SystemEmailHTMLPreviewModal from "pages/SystemEmail/SystemEmailHTMLPreviewModal";
import DeleteModal from "components/Common/DeleteModal";

function campainTemplates(props) {
  const { t } = useTranslation();
  const [selectedTemplate, setSelectedTemplate] = useState();
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);

  const { update, delete: deletePermission } = props.emailCampaignPermissions;
  const columns = [
    {
      dataField: "createdAt",
      text: t("Creation Date"),
      formatter: (val) => formatDate(val.createdAt)
    },
    {
      dataField: "createdBy",
      text: t("Created By"),
      formatter: (val) => { return (val?.createdBy?.firstName) ? _.startCase(`${val.createdBy.firstName} ${val.createdBy.lastName}`) : " " },
    },
    {
      dataField: "title",
      text: t("Title"),
    },
    {
      dataField: "content",
      text: t("Subject"),
      formatter: (val) => { return val.content["en"] && _.startCase(val.content["en"].subject) || " " }
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: t("Preview"),
      formatter: (item) => (
        <Link className={`text ${!update ? "d-none" : ""}`} to="#">
          <i
            className="mdi mdi-eye font-size-18"
            id="preview"
            onClick={() => { setSelectedTemplate(item); setPreviewModal(true) }}
          ></i>
        </Link>
      )
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
                setSelectedTemplate(item);
                setEditModal(true);
              }}
            ></i>
          </Link>
          <Link className={`text-danger ${!deletePermission ? "d-none" : ""}`} to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => { setSelectedTemplate(item); setDeleteModal(true) }}
            ></i>
          </Link>
        </div>
      )
    }
  ];

  const [sizePerPage, setSizePerPage] = useState(10);
  const dispatch = useDispatch();
  const handleFetchCampaignTemplates = (page, limit) => {
    dispatch(fetchCampaignTemplates({
      page,
      limit
    }));
  };
  const deleteTemplateFunction = () => {
    dispatch(deleteCampaignTemplate(selectedTemplate._id));
  };
  useEffect(() => {
    handleFetchCampaignTemplates(1, sizePerPage);
  }, [sizePerPage, 1, props.deleteClearingCounter, props.editClearingCounter]);

  useEffect(() => {
    if (props.deleteClearingCounter > 0 && deleteModal) {
      setDeleteModal(false);
    }
  }, [props.deleteClearingCounter]);

  return (
    <>
      <MetaTags><title>Campaign Templates</title></MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>{t("Campaign Templates")}</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle className="color-primary">{t("Campaign Templates List")} ({props.totalDocs})</CardTitle>
                  <AddTemplate allCampaignTemplates={props.docs} />
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
                        onChange={handleFetchCampaignTemplates}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {<EditTemplate
            open={editModal}
            role={selectedTemplate}
            onClose={() => { setEditModal(false) }}
          />}
          {<DeleteModal 
            loading={props.deleteLoading} 
            onDeleteClick={deleteTemplateFunction} 
            show={deleteModal} 
            onCloseClick={()=>{setDeleteModal(false)}} 
          />}
          {selectedTemplate && <SystemEmailHTMLPreviewModal
            isCampaign={true}
            open={previewModal}
            role={selectedTemplate} 
            onClose={()=>{setPreviewModal(false)}}
          />}
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  loading: state.campaignTemplates.loading || false,
  docs: state.campaignTemplates.docs || [],
  totalDocs: state.campaignTemplates.totalDocs || 0,
  deleteLoading: state.campaignTemplates.deleteLoading,
  deleteClearingCounter: state.campaignTemplates.deleteClearingCounter,
  editClearingCounter: state.campaignTemplates.editClearingCounter,
  emailCampaignPermissions: state.Profile.emailCampaignPermissions || {},
  hasPrevPage: state.campaignTemplates.hasPrevPage || false,
  hasNextPage: state.campaignTemplates.hasNextPage || false,
  prevPage: state.campaignTemplates.prevPage || null,
  nextPage: state.campaignTemplates.nextPage || null,
  page: state.campaignTemplates.page || 1,
  totalPages: state.campaignTemplates.totalPages || 0,
});

export default connect(mapStateToProps, null)(campainTemplates);
