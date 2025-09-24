/* eslint-disable object-property-newline */
import React, { useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
  useParams,
} from "react-router-dom";
import {
  useDispatch,
  useSelector
} from "react-redux";
import { withTranslation } from "react-i18next";

import Layout from "./Layout";
import ClientBank from "./Bank/ClientBank";
import ClientProfile from "./Profile/ClientProfile";
// import ClientTransactions from "./Transactions/crypto/ClientTransactions";
import ClientWallets from "./Wallets/ClientWallets";
import OrderList from "./orders/OrdersList";
import Documents from "./Documents/Documents";
import ClientDetailsHeader from "./ClientDetailsHeader";
import Logs from "./Logs";
import Notes from "./Notes";
import Converts from "./Converts/Converts";
import ListAccounts from "./TradingAccounts/ListAccounts";
import Partnership from "./Partnership";
import Referral from "./Referral";
import Statement from "./Statement";

import { fetchClientDetails } from "store/client/actions";
// import { fetchDictionaryStart } from "store/dictionary/actions";
import Security from "./Security/Security";
import ClientTransactionsIndex from "./Transactions/ClientTransactionsIndex";

function ClientMainPage() {
  const pathParams = useParams();
  const dispatch = useDispatch();
  const { profileMetaInfo } = useSelector(state => state.Profile);
  const {
    clientDetails,
    clientProfileError,
    clientProfileloading,
    convertToIb,
    clearingCounter,
  } = useSelector(state => ({
    clientDetails: state.clientReducer.clientDetails,
    clientProfileloading: state.clientReducer.clientProfileloading,
    clientProfileError: state.clientReducer.clientProfileError,
    convertToIb: state.clientReducer.convertToIb,
    clearingCounter: state.clientReducer.clearingCounter,
  }));

  // const history = useHistory();
  const clientId = pathParams.id;

  // getting client details to check if client exists using their Id
  const getClientDetails = async (clientId) => {
    dispatch(fetchClientDetails(clientId));
  };

  const tabsArr = ({ clientDetails = {} }) => [
    {
      component: ClientProfile,
      url: "/clients/:clientId/profile",
      hidden: !clientDetails.profile,
    },
    {
      component: ClientBank,
      url: "/clients/:clientId/bank",
      hidden: !clientDetails.bankAccounts,
    },
    {
      component: Documents,
      url: "/clients/:clientId/documents",
      hidden: !clientDetails.documents,
    },
    {
      component: ListAccounts,
      url: "/clients/:clientId/trading-accounts",
      hidden: !clientDetails.tradingAccounts,
    },
    {
      component: ClientTransactionsIndex,
      url: "/clients/:clientId/transactions",
      hidden: !clientDetails.transactions,
    },
    {
      component: ClientWallets,
      url: "/clients/:clientId/wallets",
      // hidden: !clientDetails.wallets,
    },
    {
      component: OrderList,
      url: "/clients/:clientId/orders",
      hidden: !clientDetails.orders,
    },
    {
      component: Logs,
      url: "/clients/:clientId/logs",
      hidden: !clientDetails.logs,
    },
    {
      component: Notes,
      url: "/clients/:clientId/notes",
      hidden: !clientDetails.notes,
    },
    {
      component: Converts,
      url: "/clients/:clientId/converts",
      hidden: !clientDetails.converts,
    },
    {
      component: Security,
      url: "/clients/:clientId/security",
      hidden: !clientDetails.security,
    },
    {
      component: Partnership,
      url: "/clients/:clientId/partnership",
      hidden: !clientDetails.partnership,
    },
    {
      component: Referral,
      url: "/clients/:clientId/referral",
      hidden: !clientDetails.referral,
    },
    {
      component: Statement,
      url: "/clients/:clientId/statement",
      hidden: !clientDetails.statement,
    },
  ];

  useEffect(() => {
    getClientDetails(clientId);
  }, [clientId, convertToIb, clearingCounter]);

  return (
    <React.Fragment>
      {clientDetails && (
        <div className="page-content">
          <div className="container-fluid">
            <ClientDetailsHeader
              clientId={clientId}
            />
            <Switch>
              {!clientProfileError ? (
                <Layout
                  clientId={clientId}
                  isIb={clientDetails.fx?.isIb}
                  isLead={clientDetails.isLead}
                >
                  {tabsArr(profileMetaInfo || {}).filter(item => !item.hidden).map((obj, index) => (
                    <Route key={index} exact path={obj.url}>
                      <obj.component clientId={clientId} path={obj.url} />
                    </Route>
                  ))}
                </Layout>
              ) : (
                <Redirect to={"/dashboard"} />
              )}
            </Switch>
          </div>
        </div>
      )}
      {!clientProfileloading && !clientDetails && (
        <React.Fragment>
          <div className="page-content">
            <div className="container-fluid text-center">
              <h2>Data not found, please add your design logic here</h2>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default (withTranslation()(ClientMainPage));
