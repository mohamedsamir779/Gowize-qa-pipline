import React from "react";
import { withTranslation } from "react-i18next"; 
import Summary from "./Summary";
import LiveAndDemoClients from "./LiveAndDemoClients";
// import RecentDeposits from "./RecentDeposits";
// import RecentWithdrawals from "./RecentWithdrawals";
import IBJourney from "components/Journey/IBJourney";

const IbPortalDashboard = () => {
  return (
    <div style={{
      marginBottom: "10%",
    }}>
      <IBJourney></IBJourney>
      {/* summary */}
      <div className="pt-3">
        <Summary />
      </div>
      {/* live and demo accounts */}
      <div className="pt-3">
        <LiveAndDemoClients />
      </div>
      {/* recent deposits */}
      {/* <div className="pt-3">
        <RecentDeposits />
      </div> */}
      {/* recent withdrawals */}
      {/* <div className="pt-3">
        <RecentWithdrawals />
      </div> */}
    </div>
  );
};

export default withTranslation()(IbPortalDashboard);