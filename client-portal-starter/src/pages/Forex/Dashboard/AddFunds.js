import CardWrapper from "components/Common/CardWrapper";
import { useTranslation } from "react-i18next";
import DepositTabs from "components/Forex/Deposit/DepositTabs";

function AddFunds() {
  const { t } = useTranslation();
  return ( <>
    <CardWrapper style={{ height:"100%" }} className="glass-card">
      <div className="d-flex justify-content-between heading pb-2">
        <h5>{t("Add Funds")}</h5>
        <div>
          <svg width="3" height="15" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="2" cy="2" r="2" fill="#74788D"/>
            <circle cx="2" cy="9" r="2" fill="#74788D"/>
            <circle cx="2" cy="16" r="2" fill="#74788D"/>
          </svg>
        </div>
      </div>
      <div className="mt-3">
        <div className="text-muted text-center">{t("Choose a payment to add funds into your account.")}</div>
        <DepositTabs></DepositTabs>
      </div>
    </CardWrapper>
  </> );
}

export default AddFunds;