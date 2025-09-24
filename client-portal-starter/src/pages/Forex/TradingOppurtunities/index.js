import React, { useEffect } from "react";

import "./webtrader.scss";
export const WebTradingOpportunities = (props) => {

  return (
    <>
      <div className="container-iframe mt-5">
        <iframe className="responsive-iframe mt-5" src="https://app.salesforceiq.com/r?target=66fe5c81e2ecdc687d01f95a&t=AFwhZf05Pvz-5Hjl94T4_MynTKTh_LweV8NmCn4VmpnGlANBQ0NDd-nw2MIhM3A1b3DF7NC0VP7f5-G59mtkg7fdCB_hbiLYNLBfzjj-wSQ9HsIzfz6ARoe7f1guOFmdeyzj8tc540ib&url=https%3A%2F%2Fcomponent.autochartist.com%2Fto%2F%3Fbroker_id%3D945%26token%3D9b37d229cd8a37d91cb2b77d2a872f60%26expire%3D1777500000%26user%3DGo-Wize%26locale%3Den_GB%26layout%3Dhorizontal%26account_type%3DLIVE%26trade_now%3Dy%23%2Fresults"></iframe>
      </div>
    </>
  );
};