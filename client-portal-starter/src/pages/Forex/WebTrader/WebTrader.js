import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import "./webtrader.scss";

const app_config = {
  clientName: "Sky Option",
  sidebarTitle: "Sky Option Client Portal",
  webTraderServer: "AccuindexLimited-Demo",
  webTraderVersion: 5,
  webTraderUtmSource: "trade.accu-index.com",
  contactUs: "#",
  linkDesktop:
    "https://download.mql5.com/cdn/web/sky.option.it/mt5/skyoption5setup.exe",
  linkAndroid: "#",
  linkIos: "#",
};

const WebTrader = () => {
  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  };
  const [height, setHeight] = React.useState(700);
  useEffect(() => {
    const { height } = getWindowDimensions();
    setHeight(height - height * 0.1);
  }, []);

  return (
    <>
      <div id="webterminal" className={"web-terminal"} style={{
        height,
        zIndex: 3,
        position: "relative",
        marginTop: "10%",
      }}>
        <iframe style={{
          height: "100%",
          width: "100%",
        }} src={`https://metatraderweb.app/trade?servers=${app_config.webTraderServer}&amp;trade_server=${app_config.webTraderServer}&amp;startup_mode=no_autologin&amp;lang=en&amp;save_password=off`} allowfullscreen="allowfullscreen"></iframe>
      </div>
      <Helmet>
        {/* <script src='https://trade.mql5.com/trade/widget.js'></script> */}

        <script type="text/javascript">
          {/* {`
            setTimeout(() => {
              new MetaTraderWebTerminal( "webterminal", {
                version: ${app_config.webTraderVersion},
                servers: ["${app_config.webTraderServer}"],
                server: "${app_config.webTraderServer}",
                demoAllServers: true,
                utmSource: "${app_config.webTraderUtmSource}",
                startMode: "create_demo",
                language: "en",
                colorScheme: "black_on_white"
            } );
          }, 1000);
          `} */}
        </script>
      </Helmet>
    </>
  );
};

export default WebTrader;
