import {
  useState, useEffect, useContext
} from "react";
import {
  Table, Alert
} from "reactstrap";
import { withTranslation } from "react-i18next";
import { BigNumber } from "bignumber.js";

import SocketContext from "../../../context/context";

import CardWrapper from "components/Common/CardWrapper";

const OrderBooks = (props) => {
  const { state } = useContext(SocketContext);
  const { orderBooks } = state;
  const { selectedMarket } = props;
  const [selectedOrderBooks, setSelectedOrderBooks] = useState(null);

  useEffect(() => {
    const books = orderBooks.find((market) => market.pairName === selectedMarket);
    setSelectedOrderBooks(books);
  });
  let spreadValue = BigNumber(selectedOrderBooks?.asks[0][0]).minus(BigNumber(selectedOrderBooks?.bids[0][0])).toFixed(5);
  return (
    <CardWrapper className="h-100">
      <h5>{props.t("Order Book")}</h5>
      <Table borderless className="text-center mb-0">
        <thead>
          <tr>
            <th className="pb-0">{props.t("Price")}</th>
            <th className="pb-0">{props.t("Size")}</th>
          </tr>
        </thead>
        {
          selectedOrderBooks && <tbody>
            {
              selectedOrderBooks.asks.slice(0, 5).reverse().map((asks, index) =>
                <tr key={index}>
                  <td className="pt-2 pb-0">{asks[0]}</td>
                  <td className="pt-2 pb-0 text-danger">{asks[1]}</td>
                </tr>
              )
            }
            <tr>
              <td colSpan="2" className="pt-2 pb-0">
                <Alert color="secondary" className="py-0 mb-0">{props.t("Spread")} [{spreadValue}]</Alert>
              </td>
            </tr>
            {
              selectedOrderBooks.bids.slice(0, 5).map((bids, index) =>
                <tr key={index}>
                  <td className="pt-2 pb-0">{bids[0]}</td>
                  <td className="pt-2 pb-0 text-success">{bids[1]}</td>
                </tr>
              )
            }
          </tbody>
        }
      </Table>
    </CardWrapper>
  );
};

export default withTranslation()(OrderBooks); 
