import { 
  Container, 
  Row, 
  Col 
} from "reactstrap";
import MetaTags from "react-meta-tags";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import CardWrapper from "components/Common/CardWrapper";
import PageHeader from "components/Forex/Common/PageHeader";
import Journey from "components/Journey/Journey";
import Platform from "./Platform";
import config from "config";
import { useState } from "react";
import { startTradingJourneyAPI } from "apis/journey";
import { CLIENT_OR_IB } from "common/constants";

/* eslint-disable object-property-newline */
const PLATFORMS = config.PLATFORMS;

const Platforms = (props) => {
  const [platformDownloaded, setPlatformDownloaded] = useState(null);
  const { subPortal } = useSelector(state => state.Layout);
  const onDownload = async (platform) => {
    if (platform.downloadLink) {
      window.open(platform.downloadLink, "_blank");
      const success = await startTradingJourneyAPI();
      if (success?.status)   
        setPlatformDownloaded(true);
    }
  };
  return (
    <>
      <MetaTags>
        <title>{props.t("Platforms")}</title>
      </MetaTags>
      <Container>
        <div className="page-content mt-5">
          <PageHeader title="Platforms Download" />
          {
            subPortal === CLIENT_OR_IB.CLIENT &&
            <div className="dashboard mt-4">
              <Journey platformDownloaded={platformDownloaded} />
            </div>
          }
          <div>
            <CardWrapper className={`${subPortal === CLIENT_OR_IB.IB && "mt-3"} p-4 glass-card shadow-lg my-5`}>
              <div className="d-flex justify-content-between">
                <h3 className="color-primary">{props.t("Platforms")}</h3>
                <i className="bx bx-dots-vertical-rounded fs-3 mt-1"></i>
              </div>
              <Row className="mt-2 g-2 row">
                {PLATFORMS.slice(0, 3).map((platform, indx) => (
                  <Platform
                    key={indx}
                    image={platform.image}
                    logo={platform.logo}
                    title={platform.name}
                    subTitle={platform.subTitle}
                    isLocalImg={platform.isLocalImg}
                    onDownload={() => onDownload(platform)}
                  />
                ))
              }
              <Col xs="12" md="6" lg="3">
                  {PLATFORMS.slice(3).map((platform, indx) => (
                    <Platform
                      key={indx}
                      image={platform.image}
                      logo={platform.logo}
                      title={platform.name}
                      subTitle={platform.subTitle}
                      isLocalImg={platform.isLocalImg}
                      onDownload={() => onDownload(platform)}
                      isMobile={true}
                      style={{ height: "50%", width: "100%", marginBottom: "2px", padding: "2px" }}
                    />
                  ))}
              </Col>
            </Row>
            </CardWrapper>
          </div>
        </div>
      </Container>
    </>
  );
};

export default withTranslation()(Platforms);