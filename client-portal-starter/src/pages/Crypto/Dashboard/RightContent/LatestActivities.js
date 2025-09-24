import React, { useEffect } from "react";
import CardWrapper from "../../../../components/Common/CardWrapper";
//i18n
import { withTranslation } from "react-i18next";
import { useDispatch, connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Loader from "components/Common/Loader";
import { fetchLogs } from "store/actions";
import { getHeaderStatusMessage } from "helpers/getLogMessages";

const LatestActivities = (props) => {
  const dispatch = useDispatch();
  const {
    t,
    logsLoaded,
    logs,
    loading,
  } = props;

  useEffect(()=>{
    if (!logsLoaded) {
      dispatch(fetchLogs({
        page: 1,
        limit: 10,
      }));
    }
  }, [logsLoaded]);

  const getDashboardActivityCards = () => {
    const activtites = logs && logs.length && logs.splice(0, 4);
    let rt = activtites && activtites.map((a) => {
      const {
        type,
        recordId,
        createdAt,
      } = a;
      const d = new Date(createdAt);
      const month = d.toLocaleString("default", { month: "short" });
      const year = d.getFullYear();
      const date = d.getDate();
      const {
        header,
        status,
        message,
      } = getHeaderStatusMessage(a, t);
      return (
        <div key={recordId} className="card__item">
          <div className="card__details">
            <div className="card__line">
              <div>{t(type)}</div>
            </div>
            <div className='d-flex justify-content-between activity-info'>
              <div>{header}</div>
              <div>{`${month} ${date}, ${year}`}</div>
            </div>
            <div className="card__status color-green">{status}</div>
            <div>{message}</div>
          </div>
        </div> 
      );
    });
    return rt;
    // return (
    //   <div className="card__item">
    //     <div className="card__details">
    //       <div className="card__line">
    //         <div>{t("Withdraw USDT")}</div>
    //       </div>
    //       <div className='d-flex justify-content-between activity-info'>
    //         <div>{t("Estimated best price")}</div>
    //         <div>Nov 22, 2020</div>
    //       </div>
    //       <div className="card__status color-green">{t("Complete")}</div>
    //       <div>969.06654889 USDT</div>
    //     </div>
    //   </div> 
    // );
  };

  return (
    <CardWrapper className="mb-5">
      <div className="activity-list">
        {loading && <Loader />}
        {getDashboardActivityCards()}
        <div className='text-center'>
          <button 
            type="button" 
            className="btn btn-soft-link waves-effect w-100"
            onClick={()=>{props.history.push("/activities")}}
          > 
            <i className="icofont-long-arrow-right icofont-2x"></i>
            <span style={{ verticalAlign: "super" }}>{t("View all activity")}</span>
          </button>
        </div>
      </div>
    </CardWrapper>
  );
};

const mapStateToProps = (state) => ({
  logs: state.logs.logs && state.logs.logs.docs || [],
  logsLoaded: state.logs.logsLoaded,
  loading: state.logs.loading,
});

export default connect(mapStateToProps, null)(withTranslation()(withRouter(LatestActivities)));