import CardWrapper from "components/Common/CardWrapper";
import APForm from "./Methods/AsiaBanksForm";

function DepositStatus({ result, selectedPaymentMethod, loading, isSuccess, t, toggleOpen, type, isError }) {
  switch (selectedPaymentMethod) {
    case "ASIA_BANKS":
      return <APForm result={result}></APForm>;
    case "FINITIC_PAY":
      if (result?.result?.url) {
        return <>
          <div>
            {t("Please complete payment")}
            <div className="mt-4">
              <iframe
                src={result?.result?.url}
                title="Finitic Pay"
                style={{
                  width: "100%",
                  height: "70vh",
                }}
              />
            </div>
          </div>
        </>;
      } else {
        return <>
          <div className="text-center  mb-4">
            <h1 className="fs-1 mb-5">
              {t("Oops!")} <i className="bx sad"></i>
            </h1>
            <p>{t("Your Deposit Request Not Successfully Created")}</p>
          </div>
          <CardWrapper className="mb-4">
            <div className="d-flex align-items-center justify-content-between px-5">
              <div>
                <div className="positive">{result.message}</div>
              </div>
            </div>
          </CardWrapper>
        </>;
      }
    case "EPAYME":
      if (loading){
        return <>{t("Waiting for you to complete payment")}</>;
      } else if (isSuccess){
        return <>{t("Payment completed transaction will be added within 15 minutes")}</>;
      } else if (isError){
        return <>{t("Payment failed")}</>;
      }
      break;
    default:
      if (isSuccess)
        return <>
          <div className="text-center  mb-4">
            <h1 className="fs-1 mb-5">
              {t("Yay!")} <i className="bx bx-wink-smile"></i>
            </h1>
            <p>{t("Pending Deposit Thank You")}</p>
            <p>
              <span className="positive">
                {
                  type === "fiatDeposit" ? result?.result?.amount?.$numberDecimal : result?.result?.amount
                } { " "} {type === "fiatDeposit" ? result?.result?.currency : result?.result?.currency}
              </span>
            </p>
            <span className="text-muted">
              {t("Your transaction ID is")}
              {result?.result?._id}
            </span>
          </div>
          <CardWrapper className="mb-4">
            <div className="d-flex align-items-center justify-content-around px-4">
              <div>
                <div className="text-muted">{t("Status")}</div>
                <div className="positive">{t(result?.result?.status)}</div>
              </div>
              <div>
                <div className="text-muted">{t("GATEWAY")}</div>
                <div>{result.result?.gateway}</div>
              </div>
            </div>
          </CardWrapper>
        </>; 
      else if (isError) 
        return <>
          <div className="text-center  mb-4">
            <h1 className="fs-1 mb-5">
              {t("Oops!")} <i className="bx sad"></i>
            </h1>
            <p>{t("Your Deposit Request Not Successfully Created")}</p>
          </div>
          <CardWrapper className="mb-4">
            <div className="d-flex align-items-center justify-content-between px-5">
              <div>
                <div className="positive">{result.message}</div>
              </div>
            </div>
          </CardWrapper>
        </>; 
      else {
        return <></>;
      }
  }
}

export default DepositStatus;