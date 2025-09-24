import { CUSTOMER_SUB_PORTALS } from "common/constants";
import dashboardSvg from "./icons/dashboardSvg";
import dotSvg from "./icons/dotSvg";
import accountSvg from "./icons/accountSvg";
import walletSvg from "./icons/walletSvg";
import moneyBagSvg from "./icons/moneyBagSvg";
import depositSvg from "./icons/depositSvg";
import withdrawSvg from "./icons/withdrawSvg";
import transferSvg from "./icons/transferSvg";
import platformSvg from "./icons/platformSvg";
import webTraderSvg from "./icons/webTraderSvg";
import partnershipSvg from "./icons/partnershipSvg";
import reportSvg from "./icons/reportSvg";
import affiliateSvg from "./icons/affiliateSvg";
import profileSvg from "./icons/profileSvg";
import ibTransferSvg from "./icons/ibTransferSvg";
import documentSvg from "./icons/documentSvg";
import inventorySvg from "./icons/inventorySvg";
import historySvg from "./icons/historySvg";
import masterSvg from "./icons/masterSvg";
import investorSvg from "./icons/investorSvg";
import calenderSvg from "./icons/calenderSvg";
import tradingSvg from "./icons/tradingSvg";
import feedSvg from "./icons/feedSvg";

const lightFill = "#E4B200";
const darkFill = "#F89622";

export default (portal, subPortal, profile, ibAllowtranscation = false, {
  partnershipStatus,
}, layoutMode) => {
  let menu = [
    {
      title: "Dashboard",
      icon: dashboardSvg({
        color: layoutMode === "dark" ? darkFill : lightFill,
        fill: layoutMode === "dark" ? "#0A172D" : "#fff",
      }),
      link: "/dashboard",
    }
  ];
  switch (portal) {
    case "FOREX":
      switch (subPortal) {
        case CUSTOMER_SUB_PORTALS.LIVE:
          // Doing this way because permissions based menu
          if (profile?.fx?.isClient) {
            // Account details
            menu.push(
              {
                title: "Accounts",
                icon: accountSvg({
                  fill: layoutMode === "dark" ? darkFill : lightFill,
                  height: 25,
                }),
                link: "#",
                hasSubMenu: true,
                subMenu: [
                  {
                    title: "Live Accounts",
                    icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                    link: "/accounts/live",
                    hasSubMenu: false,
                    subMenu: [],
                  },
                  {
                    title: "Demo Accounts",
                    icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                    link: "/accounts/demo",
                    hasSubMenu: false,
                    subMenu: [],
                  },
                  // {
                  //   title: "Change Password",
                  //   icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                  //   link: "/accounts/password",
                  //   hasSubMenu: false,
                  //   subMenu: [],
                  // },
                ],
              }
            );
            menu.push(
              {
                title: "Wallets",
                icon: walletSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                link: "/wallet",
                hasSubMenu: false,
                subMenu: [],
              },
              {
                title: "Deposit",
                icon: moneyBagSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                onClick: "selectDepositMethodModal",
                hasSubMenu: false,
                subMenu: [],
              },
              {
                title: "Withdraw",
                icon: withdrawSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                onClick: "selectWithdrawalMethodModal",
                hasSubMenu: false,
                subMenu: [],
              },
              {
                title: "Internal Transfer",
                icon: transferSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                onClick: "Transfer",
                hasSubMenu: false,
                subMenu: [],
              },
              {
                title: "Platforms",
                icon: platformSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                link: "/platforms",
                hasSubMenu: false,
                subMenu: [],
              },
              // {
              //   title: "Web Trader",
              //   icon: webTraderSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              //   link: "https://app.ztforex.com/",
              //   hasSubMenu: false,
              //   subMenu: [],
              // },
            );
          }
          if (!profile?.fx?.isIb) {
            menu.push({
              title: "Partnership",
              icon: partnershipSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              link: "/request-partnership",
              hasSubMenu: false,
              subMenu: [],
            }
            );
          }
          break;
        case CUSTOMER_SUB_PORTALS.IB:
          if (profile?.fx?.isIb) {
            menu.push(
              {
                title: "Wallets",
                icon: walletSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                link: "/wallet",
                hasSubMenu: false,
                subMenu: [],
              },              
              {
                title: "Partnership",
                icon: partnershipSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                link: null,
                hasSubMenu: true,
                subMenu: [
                  {
                    title: "My Live Clients",
                    icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                    link: "/ib/clients/live",
                    hasSubMenu: false,
                    subMenu: [],
                  },
                  {
                    title: "My Demo Clients",
                    icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                    link: "/ib/clients/demo",
                    hasSubMenu: false,
                    subMenu: [],
                  },
                  {
                    title: "Partnership",
                    icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                    link: "/partnership",
                    hasSubMenu: false,
                    subMenu: [],
                  },
                  {
                    title: "Referrals",
                    icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                    link: "/referrals",
                    hasSubMenu: false,
                    subMenu: [],
                  },
                  {
                    title: "Statement",
                    icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                    link: "/statement",
                    hasSubMenu: false,
                    subMenu: [],
                  },
                ],
              },
              {
                title: "Withdraw",
                icon: depositSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                link: "/withdraw",
                hasSubMenu: false,
                subMenu: [],
              },
              {
                title: "Internal Transfer",
                icon: ibTransferSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                link: "/ib/transfer",
                hasSubMenu: false,
                subMenu: [],
              },
            );
          }
          if (profile?.fx?.liveAcc?.length === 0) {
            menu.push({
              title: "Trading Account",
              icon: platformSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              link: "/trading-account",
              hasSubMenu: false,
              subMenu: [],
            });
          }
          break;
        case CUSTOMER_SUB_PORTALS.INVESTOR:
          if (profile?.fx?.isInvestor) {
            menu.push(
              {
                title: "Investor",
                icon: masterSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                link: "#",
                hasSubMenu: true,
                subMenu: [
                  {
                    title: "Accounts",
                    icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                    link: "/investor-accounts",
                    hasSubMenu: false,
                    subMenu: [],
                  },
                  // {
                  //   title: "Transaction",
                  //   icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                  //   link: "/transaction",
                  //   hasSubMenu: false,
                  //   subMenu: [],
                  // },
                ],
              },
              {
                title: "Leaderboard",
                icon: masterSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                link: "/master-traders",
                hasSubMenu: false,
                subMenu: [],
              },
              {
                title: "Wallets",
                icon: walletSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                link: "/wallet",
                hasSubMenu: false,
                subMenu: [],
              },
              {
                title: "Deposit",
                icon: moneyBagSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                onClick: "selectDepositMethodModal",
                hasSubMenu: false,
                subMenu: [],
              },
              {
                title: "Withdraw",
                icon: withdrawSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                onClick: "selectWithdrawalMethodModal",
                hasSubMenu: false,
                subMenu: [],
              },
              {
                title: "Internal Transfer",
                icon: transferSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                onClick: "Transfer",
                hasSubMenu: false,
                subMenu: [],
              }
            );
          }
          if (!profile?.fx?.isSp) {
            menu.push({
              title: "Request Master",
              icon: investorSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              link: "/request-master",
              hasSubMenu: false,
              subMenu: [],
            });
          }
          if (profile?.fx?.liveAcc?.length === 0) {
            menu.push({
              title: "Trading Account",
              icon: platformSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              link: "/trading-account",
              hasSubMenu: false,
              subMenu: [],
            });
          }
          break;
        case CUSTOMER_SUB_PORTALS.SP:
          if (profile?.fx?.isSp) {
            menu.push(
              {
                title: "Signal Provider",
                icon: masterSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                link: "#",
                hasSubMenu: true,
                subMenu: [
                  {
                    title: "Accounts",
                    icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                    link: "/signal-provider-accounts",
                    hasSubMenu: false,
                    subMenu: [],
                  },
                  {
                    title: "Allocation Profile",
                    icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                    link: "/signal-provider-allocation",
                    hasSubMenu: false,
                    subMenu: [],
                  },
                  {
                    title: "Investor Transaction",
                    icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                    link: "/signal-provider-transaction",
                    hasSubMenu: false,
                    subMenu: [],
                  },
                  {
                    title: "My Dedicated Links",
                    icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                    link: "/signal-provider-dedicated-links",
                    hasSubMenu: false,
                    subMenu: [],
                  },
                ],
              },
              {
                title: "Wallets",
                icon: walletSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                link: "/wallet",
                hasSubMenu: false,
                subMenu: [],
              },
              {
                title: "Deposit",
                icon: moneyBagSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                onClick: "selectDepositMethodModal",
                hasSubMenu: false,
                subMenu: [],
              },
              {
                title: "Withdraw",
                icon: withdrawSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                onClick: "selectWithdrawalMethodModal",
                hasSubMenu: false,
                subMenu: [],
              },
              {
                title: "Internal Transfer",
                icon: transferSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                onClick: "Transfer",
                hasSubMenu: false,
                subMenu: [],
              }
            );
          }
          break;
        default:
      }
      menu.push(
        {
          title: "Reports",
          icon: reportSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
          link: "/reports",
          hasSubMenu: false,
          subMenu: [],
        },
        
        // {
        //   title: "Affiliate",
        //   icon: affiliateSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
        //   link: "/affiliate",
        //   hasSubMenu: false,
        //   subMenu: [],
        // },
        {
          title: "Web Calender",
          icon: calenderSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
          link: "/web-calender",
          hasSubMenu: false,
          subMenu: [],
        },
        {
          title: "Trading Opportunities",
          icon: tradingSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
          link: "/trading-opportunities",
          hasSubMenu: false,
          subMenu: [],
        },
        {
          title: "Web Feed",
          icon: feedSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
          link: "/web-feed",
          hasSubMenu: false,
          subMenu: [],
        },
        {
          title: "My Profile",
          icon: profileSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
          link: "#",
          hasSubMenu: true,
          subMenu: [
            {
              title: "User Profile",
              icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              link: "/profile",
              hasSubMenu: false,
              subMenu: [],
            },
            {
              title: "My Documents",
              icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              link: "/documents",
              hasSubMenu: false,
              subMenu: [],
            },
            {
              title: "My Applications",
              icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              link: "/application",
              hasSubMenu: false,
              subMenu: [],
            },
            {
              title: "Bank Accounts",
              icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              link: "/bank-accounts",
              hasSubMenu: false,
              subMenu: [],
            },
            {
              title: "Notifications",
              icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              link: "/notifications",
              hasSubMenu: false,
              subMenu: [],
            },
            {
              title: "Activities",
              icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              link: "/activites",
              hasSubMenu: false,
              subMenu: [],
            },
            {
              title: "2FA",
              icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              link: "/two-fa",
              hasSubMenu: false,
              subMenu: [],
            },
          ],
        });
      break;
    case "GOLD":
      menu.push(
        {
          title: "Wallets",
          icon: walletSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
          link: "/wallet",
          hasSubMenu: false,
          subMenu: [],
        },
        {
          title: "Documents",
          icon: documentSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
          link: "/documents",
          hasSubMenu: false,
          subMenu: [],
        },
      );
      switch (subPortal) {
        case CUSTOMER_SUB_PORTALS.LIVE:
          if (profile?.fx?.liveAcc?.length === 0) {
            menu.push(
              {
                title: "Trading Account",
                icon: platformSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
                link: "/trading-account",
                hasSubMenu: false,
                subMenu: [],
              });
          }
          menu.push(
            {
              title: "Internal Transfer",
              icon: transferSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              onClick: "Transfer",
              hasSubMenu: false,
              subMenu: [],
            }
          );
          break;
        case CUSTOMER_SUB_PORTALS.DEMO:

      }
      menu.push(
        {
          title: "Inventory",
          icon: inventorySvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
          link: "/inventory",
          hasSubMenu: false,
          subMenu: [],
        },
        {
          title: "History",
          icon: historySvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
          link: "/history",
          hasSubMenu: false,
          subMenu: [],
        },
        {
          title: "My Profile",
          icon: profileSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
          link: "#",
          hasSubMenu: true,
          subMenu: [
            {
              title: "User Profile",
              icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              link: "/profile",
              hasSubMenu: false,
              subMenu: [],
            },
            {
              title: "My Addresses",
              icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              link: "/addresses",
              hasSubMenu: false,
              subMenu: [],
            },
            {
              title: "Bank Accounts",
              icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              link: "/bank-account",
              hasSubMenu: false,
              subMenu: [],
            },
            {
              title: "Activities",
              icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              link: "/activities",
              hasSubMenu: false,
              subMenu: [],
            },
            {
              title: "Notifications",
              icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              link: "/notifications",
              hasSubMenu: false,
              subMenu: [],
            },
            {
              title: "2FA",
              icon: dotSvg({ fill: layoutMode === "dark" ? darkFill : lightFill }),
              link: "/two-fa",
              hasSubMenu: false,
              subMenu: [],
            },
          ],
        });
      break;
    default:
  }
  return menu;
};