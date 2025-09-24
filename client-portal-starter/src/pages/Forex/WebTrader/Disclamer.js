import { useTranslation } from "react-i18next";

function Disclamer({ setAccept }) {
  const { t } = useTranslation();
  return (<div>
    <div className="d-flex justify-content-center align-items-center border-bottom py-3 px-0">
      <div className="d-flex">
        <img src="img/icons/disclamer.svg"/>
        <div className="ms-3">
          <h4>{t("Disclamer")}</h4>
          <p className="text-muted">{t("Last updated August 19, 2022")}</p>
        </div>
      </div>
    </div>
    <div className="p-3">
      <ul>
        <li>
          <h4 className="mb-3">{t("1. Terms")}</h4>
          <div className="terms bg-soft-blue p-4">
            {t(`MetaQuotes Ltd is a software development company and does not provide any financial,
               investment, brokerage, trading or data feed services,
               nor is it involved in any commission-based payments concerning any trading operations.MetaQuotes Ltd is a software development company and does not provide any financial,
               investment, brokerage, trading or data feed services, nor is it involved in any commission-based payments concerning any trading operations.`)}
            <div>
              {t(`None of the information available in the application is intended as an investment advice.
                Before using this application for trading, you should seek the advice of a qualified 
                and registered securities professional and undertake your own due diligence.`)}
            </div>
          </div>
          <div className="text-center">
            <button className="btn btn-outline-primary m-2 w-lg">
              {t("Decline")}
            </button>
            <button type="button" className="btn btn-primary m-2 w-lg"
              onClick={()=> {
                setAccept(true);
                localStorage.setItem("acceptTraderDisclamer", true);
              }}
            >{t("Accept")}</button>
          </div>
        </li>
      </ul>
    </div>
  </div>);
}

export default Disclamer;