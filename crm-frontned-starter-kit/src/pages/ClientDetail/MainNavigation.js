import React from "react";
import { NavLink } from "react-router-dom";

// i18n
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { enableFX } from "config";

function MainNavigation({ clientId, isIb, isLead, t }) {
  const { profileMetaInfo } = useSelector((state) => state.Profile);

  const tabsArr = ({ clientDetails = {} }) => {
    const tabs = [
      {
        name: "Profile",
        url: `/clients/${clientId}/profile`,
        hidden: !clientDetails.profile,
      },
      {
        name: "Bank Accounts",
        url: `/clients/${clientId}/bank`,
        hidden: !clientDetails.bankAccounts || isLead,
      },
      {
        name: "Documents",
        url: `/clients/${clientId}/documents`,
        hidden: !clientDetails.documents || isLead,
      },
      {
        name: "Trading Accounts",
        url: `/clients/${clientId}/trading-accounts`,
        hidden: !clientDetails.tradingAccounts || !enableFX,
      },
      {
        name: "Transactions",
        url: `/clients/${clientId}/transactions`,
        hidden: !clientDetails.transactions || isLead,
      },
      {
        name: "Converts",
        url: `/clients/${clientId}/converts`,
        hidden: !clientDetails.converts,
      },
      {
        name: "Wallets",
        url: `/clients/${clientId}/wallets`,
        hidden: !clientDetails.wallets,
      },
      {
        name: "Orders",
        url: `/clients/${clientId}/orders`,
        hidden: !clientDetails.orders,
      },
      {
        name: "Logs",
        url: `/clients/${clientId}/logs`,
        hidden: !clientDetails.logs,
      },
      {
        name: "Notes",
        url: `/clients/${clientId}/notes`,
        hidden: !clientDetails.notes,
      },
      {
        name: "Security",
        url: `/clients/${clientId}/security`,
        hidden: !clientDetails.security,
      },
    ];

    if (isIb)
      tabs.push(
        {
          name: "Partnership",
          url: `/clients/${clientId}/partnership`,
          hidden: !clientDetails.partnership,
        },
        {
          name: "Referral",
          url: `/clients/${clientId}/referral`,
          hidden: !clientDetails.referral,
        },
        {
          name: "Statement",
          url: `/clients/${clientId}/statement`,
          hidden: !clientDetails.statement,
        }
      );

    return tabs;
  };

  return (
    <React.Fragment>
      <div className="navbar-header mb-5">
        <div className="container-fluid">
          <ul className="nav-tabs-custom nav-justified nav nav-tabs page-menues">
            {tabsArr(profileMetaInfo || {})
              .filter((item) => !item.hidden)
              .map((obj, index) => (
                <li className={"nav-item " + `item-${index}`} key={index}>
                  <NavLink
                    to={obj.url}
                    className={(isActive) =>
                      "nav-link" + (!isActive ? " unselected" : "")
                    }
                  >
                    {t(obj.name)}
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
}

export default withTranslation()(MainNavigation);
