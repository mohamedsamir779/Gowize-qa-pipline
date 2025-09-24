import { withTranslation } from "react-i18next";
import FxReport from "./FxReport";
import WalletReport from "./WalletReport";
import IbNotApproved from "components/Common/IbNotApproved";
import { useSelector } from "react-redux";

const Reports = () => {
  const partnershipAgreement = useSelector((state) => (state.Profile.clientData.stages?.ib?.partnershipAgreement));
  const { subPortal } = useSelector(state => state.Layout);
  const isIbPortal = subPortal === "IB";
  return (
    <>
      {isIbPortal && !partnershipAgreement && <IbNotApproved />}
      <FxReport />
      <WalletReport />
    </>
  );
};

export default withTranslation()(Reports);