import React from "react";
import {
  Card, CardBody, CardTitle, CardSubtitle, Table
} from "reactstrap";
const AssetsStats = () => {
  return (
    <React.Fragment>
      <Card className="card-animate">
        <CardBody>
          <CardTitle className="color-primary">Assets</CardTitle>
          <CardSubtitle className="mb-3">
              Assets Comapny vs Clients
          </CardSubtitle>
          <div className="table-responsive">
            <Table className="table table-borderless mb-0">
              <thead>
                <tr className="text-center">
                  <th></th>
                  <th>BTC</th>
                  <th>USDT</th>
                  <th>USD</th>
                  <th>ETH</th>
                  <th>TRX</th>
                  <th>XRP</th>
                </tr>
              </thead>
              <tbody className="text-center">
                <tr>
                  <th className="text-start" scope="row">Comapny</th>
                  <td>34</td>
                  <td>2,000,000</td>
                  <td>500,000</td>
                  <td>147</td>
                  <td>23,434</td>
                  <td>44,888</td>
                </tr>
                <tr>
                  <th className="text-start" scope="row">Clients</th>
                  <td>14</td>
                  <td>1,358,000</td>
                  <td>400,238</td>
                  <td>45</td>
                  <td>4,972</td>
                  <td>55,454</td>
                </tr>
              </tbody>
            </Table>
          </div>
          
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default AssetsStats;