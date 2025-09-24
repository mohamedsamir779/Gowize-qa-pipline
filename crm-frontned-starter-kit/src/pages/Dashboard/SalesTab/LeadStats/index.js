import TableLoader from "components/Common/Loader";
import {
  isEmpty,
  startCase,
  xor,
} from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Card, Row, Col, CardHeader, Button, Badge, CardTitle, CardBody
} from "reactstrap";
import { fetchLeadStagesStatsStart } from "store/actions";
import LeadStatsCardBody from "./LeadStatsCardBody";
import LeadStageEditModal from "./LeadStatsEdit";
const LeadStats = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    leadStagesStatsTotal,
    callStatus,
    dictionaryLoading,
    settings,
    profileLoading,
  } = useSelector(state => ({
    profileLoading: state.Profile.loading,
    settings: state.Profile.settings,
    leadStagesStats: state.dashboardReducer.leadStats,
    leadStagesStatsTotal: state.dashboardReducer.leadStatsTotal,
    leadStagesStatsLoading: state.dashboardReducer.leadStatsLoading,
    callStatus: state.dictionaryReducer.callStatus || [],
    defaultCallStatusColors: state.dictionaryReducer.defaultCallStatusColors || {},
    dictionaryLoading: state.dictionaryReducer.loading,
  }));
  const {
    salesDashboard,
    salesDashboardLimit,
    enableCallStatusColors,
    callStatusColors,
  } = settings;
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(async () => {
    if (!salesDashboard) return;
    dispatch(fetchLeadStagesStatsStart({
      callStatus: salesDashboard.join(","),
      limit: salesDashboardLimit || 5,
    }));
  }, [salesDashboard, salesDashboardLimit]);

  return (
    <React.Fragment>
      {(dictionaryLoading || profileLoading) && <TableLoader />}
      <Card>
        <CardBody>
          {
            !dictionaryLoading && !profileLoading && (
              <div className="d-flex justify-content-between align-items-center mb-2">
                <CardTitle className="color-primary mb-0" >{t("Lead Stats")}</CardTitle>
                <Button color="primary" className="card-animate" onClick={() => setShowEditModal(!showEditModal)}>
                  <i
                    className={`${isEmpty(xor(Object.keys(callStatus), salesDashboard)) || salesDashboard?.length === 4 ? "bx bx-edit" : "bx bx-plus"} me-1`}
                  />
                  {isEmpty(xor(Object.keys(callStatus), salesDashboard)) || salesDashboard?.length === 4 ? t("Edit Current Stages") : t("Add Another Stage")}
                </Button>
              </div>
            )
          }
          <Row className="col-card-same-height">
            {
              Object.keys(callStatus).map((stage) => (
                salesDashboard?.includes(stage) &&
                <Col key={stage} xs={12} md={3} xl={3} className="p-2">
                  <Card className="card-animate h-100 shadow-none">
                    <CardHeader>
                      <Link
                        className="d-flex align-items-center justify-content-between"
                        to={`/leads?callStatus=${stage}`}>
                        <span
                          className="d-flex align-items-center"
                          style={{
                            color: enableCallStatusColors && callStatusColors[stage] ? callStatusColors[stage] : "inherit",
                          }}>
                          <i className="mdi mdi-circle font-size-11 me-2"></i>
                          {t(startCase(stage.toLowerCase()))}
                        </span>
                        <Badge
                          pill
                          className=""
                          color="inherit"
                          style={{
                            color: "gray",
                            backgroundColor: "#e3e3e3",
                          }}
                        >
                          {(leadStagesStatsTotal && leadStagesStatsTotal[stage] && leadStagesStatsTotal[stage]) || t("No")} {t("Leads")}
                        </Badge>
                        {/* <CardTitle tag="h6">
                      {t(startCase(stage))} - ( {(leadStagesStats && leadStagesStats[stage] && leadStagesStats[stage].length) || 0} )
                    </CardTitle> */}
                      </Link>
                    </CardHeader>
                    <LeadStatsCardBody stage={stage} />
                  </Card>
                </Col>
              ))
            }
          </Row>
        </CardBody>

      </Card>
      <LeadStageEditModal
        toggle={() => setShowEditModal(!showEditModal)}
        isOpen={showEditModal}
        t={t}
      />
    </React.Fragment>
  );
};


export default (LeadStats);