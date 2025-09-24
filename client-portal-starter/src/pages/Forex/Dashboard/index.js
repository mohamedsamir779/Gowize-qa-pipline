import React from "react";
import { MetaTags } from "react-meta-tags";
import { Container } from "reactstrap";
import { useSelector } from "react-redux";
import { withTranslation, useTranslation } from "react-i18next";
import PageHeader from "components/Forex/Common/PageHeader";
import IbPortalDashboard from "./IbPortal";
import ClientPortalDashboard from "./clientPortal/ClientPortalDashboard";
import { CUSTOMER_SUB_PORTALS } from "common/constants";
import Loader from "components/Common/Loader";

const Dashboard = () => {
  const { t } = useTranslation();
  const { subPortal } = useSelector((state) => ({
    subPortal: state.Layout.subPortal
  }));

  const { clientData } = useSelector((state) => (state.Profile));

  return (
    <>
      <MetaTags>
        <title>{t("Dashboard")}</title>
      </MetaTags>
      <div className="dashboard forex-dashboard page-content">
        <Container className="mt-5">
          <PageHeader title="Dashboard"></PageHeader>
          {/* waiting for profile fetching */}
          {!clientData?.fx?.isIb && !(clientData?.fx?.isClient || clientData?.fx?.isDemo) && <Loader />}
          {
            (subPortal === CUSTOMER_SUB_PORTALS.IB && clientData?.fx?.isIb && <IbPortalDashboard />) ||
            (subPortal === CUSTOMER_SUB_PORTALS.LIVE && (clientData?.fx?.isClient || clientData?.fx?.isDemo) && <ClientPortalDashboard />)
          }
        </Container>
      </div>
    </>
  );
};

export default withTranslation()(Dashboard);