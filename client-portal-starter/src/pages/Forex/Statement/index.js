import IbNotApproved from "components/Common/IbNotApproved";
import PageHeader2 from "components/Forex/Common/pageHeader2";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  Container,
} from "reactstrap";
import Filteration from "./Filteration";
import ListDeals from "./ListDeals";

const Statment = () => {
  const { t } = useTranslation();
  const { subPortal } = useSelector(state=>state.Layout);
  const partnershipAgreement = useSelector((state) => (state.Profile.clientData.stages?.ib?.partnershipAgreement));

  const isIbPortal = (subPortal === "IB");
  const [currentLogin, setCurrentLogin] = useState(null);
  const handleLoginSelect = (e) => {
    setCurrentLogin(e);
  };

  return (
    <div className="page-content">
      <Container className="mt-5">
        { isIbPortal && !partnershipAgreement && <IbNotApproved /> }
        <PageHeader2 title={t("Statement")} />
        <Filteration onLoginSelect={handleLoginSelect} />
        <ListDeals clientLogin={currentLogin} />
      </Container>
    </div>
  );
};

export default Statment;