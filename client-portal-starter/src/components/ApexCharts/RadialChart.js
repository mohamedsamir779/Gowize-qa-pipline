import React from "react";
const ReactApexChart = React.lazy(()=> import("react-apexcharts"));
import { useSelector } from "react-redux";
import { Spinner } from "reactstrap";
import BigNumber from "bignumber.js";
//i18n
import { withTranslation } from "react-i18next";

const RadialChart = ({ height, ...props }) => {
  let wallets = useSelector(state => state.crypto.wallets?.wallets);
  let totalWalletAmount = 0;

  if (!wallets) 

    return <div className="d-flex align-items-center justify-content-center my-3">
      <Spinner className="text-center m-auto"></Spinner>
    </div>;
  wallets = wallets.map((wallet) => {
    // const p = markets && markets.find(x => x.pairName === `${wallet.asset}/USDT`);
    // const usdPrice =  p ? p.marketPrice : 1;
    // const usdValue = parseFloat(new BigNumber(usdPrice).multipliedBy(new BigNumber(wallet.amount || 0)).toString());
    totalWalletAmount += wallet.usdValue;
    return {
      ...wallet,
    };
  });
  wallets.sort((a, b) => {
    return b.usdValue - a.usdValue;
  });
  const series = wallets.map(x => parseFloat(new BigNumber(x.usdValue).dividedBy(new BigNumber(totalWalletAmount)).multipliedBy(100)).toFixed(2));
  // const series = [(wallets[0].usdValue / totalWalletAmount).toFixed(2) * 100, (wallets[1].amount / totalWalletAmount).toFixed(2) * 100, (wallets[2].amount / totalWalletAmount).toFixed(2) * 100, (wallets[3].amount / totalWalletAmount).toFixed(2) * 100]
  const options = {
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: props.t("Total"),
            formatter: function () {
              return totalWalletAmount.toFixed(2) + " $";
            },
          },
        },
      },
    },

    labels: wallets.map(x => x.asset),
    colors: ["#556ee6", "#34c38f", "#f46a6a", "#f1b44c"],
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="radialBar"
      height={height}
    />
  );
};
export default withTranslation()(RadialChart); 
