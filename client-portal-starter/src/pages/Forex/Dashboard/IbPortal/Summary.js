import { getIbDashboardSummary, getIbWallet } from "apis/forex/ib";
import CardWrapper from "components/Common/CardWrapper";
import { useEffect, useState } from "react";
import { useTranslation, withTranslation } from "react-i18next";
// eslint-disable-next-line object-curly-newline
import { CardText, Col, Row, Spinner } from "reactstrap";
import Select, { components } from "react-select";
import { useSelector } from "react-redux";
const { SingleValue, Option } = components;

const PlatformSelect = (props) => {
  const { layoutMode } = useSelector((state) => state.Layout);
  const { t } = useTranslation();

  const IconSingleValue = (props) => (
    <SingleValue {...props}>
      <div
        className="color-primary font-weight-bold border-0"
        style={{ fontSize: "12px" }}
      >
        {t("Platform")}
      </div>
      <div style={{ fontWeight: "bold" }}>{props.data.label}</div>
    </SingleValue>
  );

  const IconOption = (props) => <Option {...props}>{props.data.label}</Option>;
  const customStyles = {
    dropdownIndicator: (provided) => ({
      ...provided,
      color: layoutMode === "dark" ? "white" : "#495057",
      padding: 0,
      backgroundColor: "transparent",
      paddingRight: "5px",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
    control: (provided) => {
      if (layoutMode === "dark") {
        return {
          ...provided,
          backgroundColor: "#1A2A3E",
          boxShadow: "0 0.125rem 0.25rem #0B182F",
          border: 0,
          color: "#adb5bd",
          height: "100%",
          padding: "10px",
        };
      }
      return {
        ...provided,
        borderRadius: "10px",
        padding: "10px",
        height: "100%",
        border: "0px",
        boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 10%)",
        cursor: "pointer",
        background: "transparent",
      };
    },
    menu: (provided) => ({
      ...provided,
      backgroundColor: layoutMode === "dark" ? "#242632" : "white",
      color: layoutMode === "dark" ? "#adb5bd" : "#495057",
      zIndex: 3,
    }),
    option: (provided, state) => ({
      ...provided,
      display: state.isDisabled ? "none" : "flex",
      flexDirection: "row",
      alignItems: "center",
      color: layoutMode === "dark" ? "#adb5bd" : "#495057",
      padding: "10px",
    }),
    singleValue: (provided) => {
      return {
        ...provided,
        flexDirection: "row",
        alignItems: "center",
        color: layoutMode === "dark" ? "#adb5bd" : "#495057",
      };
    },
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "transparent",
        }}
      >
        <Select
          {...props}
          className={"basic-single color-primary shadow border-0"}
          placeholder={t("Select Platform")}
          styles={customStyles}
          onInputChange={(input) => {
            if (input !== "") {
              if (!/^-?\d*\.?\d*$/.test(input)) {
                return "";
              }
            }
            return input;
          }}
          components={{
            SingleValue: IconSingleValue,
            Option: IconOption,
          }}
          options={props.options}
        />
      </div>
    </>
  );
};
function Summary() {
  const { t } = useTranslation();
  const { ibMT5Acc } = useSelector((state) => state.Profile.clientData.fx);
  const [selectedPlatform, setSelectedPlatform] = useState({
    label: `MT5${ibMT5Acc.length > 0 ? ` (${ibMT5Acc[0]})` : ""}`,
    value: "MT5",
  });
  const [state, setState] = useState({
    loading: false,
  });
  const [wallet, setWallet] = useState({
    amount: 0,
    frozenAmount: 0,
  });
  const [walletLoading, setWalletLoading] = useState(false);
  const getSummary = async () => {
    setState({
      ...state,
      loading: true,
    });
    const result = await getIbDashboardSummary({
      platform: selectedPlatform.value,
    });
    if (result.status)
      setState({
        ...state,
        loading: false,
        ...result.result,
      });
    else
      setState({
        ...state,
        loading: false,
      });
  };
  useEffect(() => {
    getSummary();
  }, [selectedPlatform]);

  useEffect(()=>{
    setWalletLoading(true);
    getIbWallet().then((res)=>{
      if (res.isSuccess) {
        setWallet({
          ...res.result,
        });
      } else {
        throw new Error(res.message);
      }
    }).catch((err)=>{
      console.log(err);
    }).finally(()=>{
      setWalletLoading(false);
    });
  }, []);

  return ( 
    <>
      <CardWrapper className="accounts-tab shadow glass-card">
        <div className="d-flex justify-content-between pb-2">
          <h5 className="color-primary">{t("Summary")}</h5>
        </div>
        <CardText className="mb-0">
          {state.loading  || walletLoading ? <div className="d-flex align-items-center justify-conten-center">
            <Spinner></Spinner>
          </div> : <Row>
            <Row>
              {/* <Col xs={4}>
                <div className="mb-3">
                  {ibMT5Acc.length > 0 && <PlatformSelect
                    options={[{
                      label: `MT5${ibMT5Acc.length > 0 ? ` (${ibMT5Acc[0]})` : ""}`,
                      value: "MT5",
                    },
                    {
                      label: "MT4",
                      value: "MT4"
                    }]}
                    value={selectedPlatform}
                    onChange={(e)=>{
                      setSelectedPlatform(e);
                    }}
                    defaultValue={{
                      label: `MT5${ibMT5Acc.length > 0 ? ` (${ibMT5Acc[0]})` : ""}`,
                      value: "MT5" 
                    }}
                    type="number"
                  >
                  </PlatformSelect>}
                </div>
              </Col> */}
              <Col xs={4}>
                <div  className="acc-tab-card mb-3 shadow-lg border-0" >
                  <div>
                    <div className="acc-tab-card-title" style={{ "fontSize": "12px" }}>
                      {t("IB Equity")}
                    </div>
                    <div className="acc-tab-card-desc">
                      {wallet.amount} $
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={4}>
                <div  className="acc-tab-card mb-3 shadow-lg border-0" >
                  <div>
                    <div className="acc-tab-card-title" style={{ "fontSize": "12px" }}>
                      {t("IB Frozen Balance")}
                    </div>
                    <div className="acc-tab-card-desc">
                      {wallet?.freezeAmount} $
                    </div>
                  </div>
                  </div>
                </Col>
                <Col xs={12} lg={4}>
                  <div className="acc-tab-card mb-3 shadow-lg border-0">
                    <div>
                      <div
                        className="acc-tab-card-title"
                        style={{ fontSize: "12px" }}
                      >
                        {t("Clients Current Equity")}
                      </div>
                      <div className="acc-tab-card-desc">
                        {t(`${state.clientsEquity | "-"} $`)}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} lg={3}>
                  <div className="acc-tab-card mb-3 shadow-lg border-0">
                    <div>
                      <div
                        className="acc-tab-card-title"
                        style={{ fontSize: "12px" }}
                      >
                        {t("Total Clients Deposit")}
                      </div>
                      <div className="acc-tab-card-desc">
                        {t(`${state.deposit | "-"} $`)}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={12} lg={3}>
                  <div className="acc-tab-card mb-3 shadow-lg border-0">
                    <div>
                      <div
                        className="acc-tab-card-title"
                        style={{ fontSize: "12px" }}
                      >
                        {t("Total Client Withdrawal")}
                      </div>
                      <div className="acc-tab-card-desc color-yellow">
                        {t(`${state.withdraw | "-"} $`)}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={12} lg={3}>
                  <div className="acc-tab-card mb-3 shadow-lg border-0">
                    <div>
                      <div
                        className="acc-tab-card-title"
                        style={{ fontSize: "12px" }}
                      >
                        {t("Total Live Clients")}
                      </div>
                      <div className="acc-tab-card-desc text-success">
                        {t(state.live | "-")}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={12} lg={3}>
                  <div className="acc-tab-card mb-3 shadow-lg border-0">
                    <div>
                      <div
                        className="acc-tab-card-title"
                        style={{ fontSize: "12px" }}
                      >
                        {t("Total Demo Clients")}
                      </div>
                      <div className="acc-tab-card-desc text-warning">
                        {t(state.demo | "-")}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Row>}
        </CardText>
      </CardWrapper>
    </>
  );
}

export default withTranslation()(Summary);
