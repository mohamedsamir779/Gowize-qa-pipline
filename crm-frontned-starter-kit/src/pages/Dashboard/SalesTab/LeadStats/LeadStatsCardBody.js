import React from "react";
import {
  CardBody,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import TableLoader from "components/Common/Loader";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const LeadStatsCardBody = ({ stage }) => {

  const { t } = useTranslation();
  const {
    leadStagesStats,
    leadStagesStatsLoading,
    profileLoading,
    dictionaryLoading,
  } = useSelector(
    (state) => ({
      leadStagesStats: state.dashboardReducer.leadStats,
      leadStagesStatsLoading: state.dashboardReducer.leadStatsLoading,
      profileLoading: state.Profile.loading,
      dictionaryLoading: state.dictionaryReducer.loading,
    })
  );
  const loading = profileLoading || dictionaryLoading || leadStagesStatsLoading;
  const notLoading = !profileLoading && !dictionaryLoading && !leadStagesStatsLoading;
  return (
    <CardBody className="d-flex flex-column justify-content-between">
      {loading && <TableLoader />}
      {(notLoading && (!leadStagesStats[stage] || leadStagesStats[stage]?.length === 0)) && (
        <div className="align-items-center">
          {t("No leads in this stage")}
        </div>
      )}
      <div>
        {notLoading && leadStagesStats[stage]?.length !== 0 && (
          leadStagesStats[stage]?.map((lead) => (
            <div className="note-row py-2 px-3" key={lead._id}>
              <div className="align-items-center">
                <b className="text-truncate">
                  <Link to={`/clients/${lead?._id}/profile`}>
                    {`${lead?.firstName} ${lead?.lastName}`}
                  </Link>
                </b>
              </div>
              <p className="mb-0">
                <i className="mdi mdi-email me-2"></i>
                {`${lead.email || t("Not Available")}`}
              </p>
              <p className="mb-0">
                <i className="mdi mdi-phone me-2"></i>
                {`${lead.phone || lead.mobile || t("Not Available")}`}
              </p>
              <p className="mb-0">
                <i className="mdi mdi-face-agent me-2"></i>
                {lead.agent ? `${lead?.agent?.firstName} ${lead?.agent?.lastName}` : t(" Unassigned")}
              </p>
              <small>{new Date(lead?.createdAt).toUTCString()}</small>
            </div>
          ))
        )}
      </div>
      {
        (notLoading && (!leadStagesStats[stage] || leadStagesStats[stage]?.length === 0)) && (
          <div className="text-center mt-2">
            <Link to={`/leads?callStatus=${stage}`}>
              <h6 className="text-decoration-underline">More</h6>
            </Link>
          </div>
        )
      }
    </CardBody>
  );
};

export default LeadStatsCardBody;