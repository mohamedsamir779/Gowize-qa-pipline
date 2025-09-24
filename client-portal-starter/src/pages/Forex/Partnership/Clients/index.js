import IbNotApproved from "components/Common/IbNotApproved";
import PageHeader from "components/Forex/Common/PageHeader";
import captilize from "helpers/captalize";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MetaTags } from "react-meta-tags";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Container } from "reactstrap";
import Clients from "./Clients";
import TradingAccounts from "./TradingAccounts";
import TradingActivity from "./TradingActivity";

function IbClients() {
  const { type } = useParams();
  const history = useHistory();
  const { clientData } = useSelector(state=>state.Profile);
  const [selectedClient, setSelectedClient] = useState(undefined);
  const [selectedTradingAccount, setSelectedTradingAccount] = useState();
  const { t } = useTranslation();
  const { subPortal } = useSelector(state=>state.Layout);
  const partnershipAgreement = useSelector((state) => (state.Profile?.clientData?.stages?.ib?.partnershipAgreement));
  const isIbPortal = subPortal === "IB";

  if (clientData.fx)
    if (!clientData.fx.isIb){
      history.push("/");
    }

  const [customActiveTab, setCustomActiveTab] = useState("1");
  const toggleCustom = tab => customActiveTab !== tab && setCustomActiveTab(tab);
  
  useEffect(()=>{
    return () =>{
      setSelectedClient(undefined);
      setSelectedTradingAccount(undefined);
    };
  }, [type]);
  return ( <>
    <MetaTags>
      <title>{t(`${captilize(type)} Clients`)}</title>
    </MetaTags>
    <div className="page-content">
      <Container className="mt-5">
        { isIbPortal && !partnershipAgreement && <IbNotApproved /> }
        <PageHeader title={t(`${captilize(type)} Clients`)} />
        <div className="pt-3">
          <Clients type={type} setSelectedClient={setSelectedClient} customActiveTab={customActiveTab} toggleCustom={toggleCustom} />
        </div>
        {
          customActiveTab === "1" &&
          <>
            <div className="pt-3">
              <TradingAccounts type={type} selectedClient={selectedClient} setSelectedTradingAccount={setSelectedTradingAccount}/>
            </div>
            <div className="pt-3">
              <TradingActivity type={type} selectedTradingAccount={selectedTradingAccount}/>
            </div>
          </>
        }
      </Container>
    </div>
  </> );
}

export default IbClients;