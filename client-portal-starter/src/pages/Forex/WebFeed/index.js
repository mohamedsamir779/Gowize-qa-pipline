
import React, { useEffect } from "react";
import "./webtrader.scss";

const WebFeed = (props) => {

  return (
    <>
      <div className="container-iframe mt-5">
        <iframe className="responsive-iframe mt-5" src="https://app.salesforceiq.com/r?target=66fe5c81e2ecdc687d01f95c&t=AFwhZf05Pvz-5Hjl94T4_MynTKTh_LweV8NmCn4VmpnGlANBQ0NDd-nw2MIhM3A1b3DF7NC0VP7f5-G59mtkg7fdCB_hbiLYNLBfzjj-wSQ9HsIzfz6ARoe7f1guOFmdeyzj8tc540ib&url=https%3A%2F%2Fcomponent.autochartist.com%2Fnews%2Fstock-news%3Fbroker_id%3D945%26account_type%3DLIVE%26user%3DGo-Wize%26expire%3D1777500000%26token%3D9b37d229cd8a37d91cb2b77d2a872f60%26locale%3Den%26css%3Dhttps%3A%252F%252Fbroker-resources.autochartist.com%252Fcss%252Fcomponents%252F945-news-feeds-app.css"></iframe>
      </div>
    </>
  );
};

export default WebFeed;