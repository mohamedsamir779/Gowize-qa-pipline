import React from "react";
import CardWrapper from "../../../../components/Common/CardWrapper";
import { Badge } from "reactstrap";
import { withTranslation } from "react-i18next";

const LatestAnnoucements = (props) => {
  return (
    <CardWrapper className='announcements'>
      <div className="announcements-list">
        <div className="card__item">
          <div className="d-flex align-items-center">
            <Badge className="me-2 bg-success rounded-circle p-2">
              <i className='mdi mdi-file-document-multiple-outline fs-4'></i>
            </Badge>
            <span className='announcements-details'>{props.t("Wrapped Bitcoin is now listed on Exinitic")}</span>
          </div>
        </div>
        <div className="card__item">
          <div className="d-flex align-items-center">
            <Badge className="me-2 bg-warning rounded-circle p-2">
              <i className='mdi mdi-file-document-multiple-outline fs-4'></i>
            </Badge>
            <span className='announcements-details'>{props.t("CyberVien Token is now listed in Exinitic")}</span>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};
export default withTranslation()(LatestAnnoucements); 