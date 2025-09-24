import React, { useState, useEffect } from "react";
import {
  Card, CardBody, CardTitle,
} from "reactstrap";
import ReactTooltip from "react-tooltip";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { scaleLinear } from "d3-scale";


const CountriesMap = (props) => {
  const { clients, leads } = props;

  const geoUrl = "https://exiniti.blob.core.windows.net/public/maps/wcsa.json";
  const [content, setTooltipContent] = useState("");
  const [dataStr, setDataStr] = useState({
    type: 0,
    data: [],
  });

  useEffect(()=>{
    setDataStr({
      type: 0,
      data: clients,
    });
  }, [clients, leads]);
  
  const changeCustomerType = (chk) => {
    if (chk === 0) {
      setDataStr({
        type: 0,
        data: clients 
      });
    } else {
      setDataStr({
        type: 1,
        data: leads 
      });
    }
  };

  const rounded = (num) => {
    if (num > 1000000000) {
      return Math.round(num / 100000000) / 10 + "Bn";
    } else if (num > 1000000) {
      return Math.round(num / 100000) / 10 + "M";
    } else if (num > 1000) {
      return Math.round(num / 100) / 10 + "K";
    } else {
      return num;
    }
  };

  const colorScale = scaleLinear()
    .domain([0, 1, 10, 50])
    .range(["#b7ddfd", "#71bbf9", "#008afd", "#005398"]);

  return (
    <React.Fragment>
      <Card className="card-animate countries-map">
        <CardBody>
          <CardTitle className="d-flex justify-content-between align-items-center">
            <h5>{props.t("Customers Map")}</h5>
            <div className="btn-group btn-group-sm mt-2" role="group" aria-label="Basic example">
              <button type="button" className={dataStr.type === 0 ? "btn btn-primary" : "btn btn-info"}  onClick={()=>{changeCustomerType(0)}}>Clients</button>
              <button type="button" className={dataStr.type === 1 ? "btn btn-primary" : "btn btn-info"} onClick={()=>{changeCustomerType(1)}}>Leads</button>
            </div>
          </CardTitle>
          <div>
            <div data-tip="">
              <ComposableMap height={450} width={800}>
                <ZoomableGroup>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const d = dataStr.data && dataStr.data.find(
                          (s) => s.country.toLowerCase() === geo.properties["name"].toLowerCase()
                        );
                        return <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => {
                            const { name } = geo.properties;
                            const count = d ? d.total : 0;
                            setTooltipContent(`${name} — ${rounded(count)}`);
                          }}
                          onMouseLeave={() => {
                            setTooltipContent("");
                          }}
                          fill={d ? colorScale(d.count) : "#b7ddfd"}
                        />;
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            </div>
            <ReactTooltip>{content}</ReactTooltip>
          </div>

        </CardBody>
      </Card>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  loading: state.dashboardReducer.loading || false,
  leads: state.dashboardReducer.leads,
  clients: state.dashboardReducer.clients,
});

export default connect(mapStateToProps, null)(withTranslation()(CountriesMap));