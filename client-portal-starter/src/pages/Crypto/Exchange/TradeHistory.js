import {
  Table
} from "reactstrap";
import { withTranslation } from "react-i18next";

import CardWrapper from "../../../components/Common/CardWrapper";

const TradeHistory = (props) => {
  /* eslint-disable object-property-newline */
  const history = [
    { "price": 78169, "size": 0.011740, "time": "16:09:44" },
    { "price": 78169, "size": 0.011740, "time": "16:09:44" },
    { "price": 78169, "size": 0.011740, "time": "16:09:44" },
    { "price": 78169, "size": 0.011740, "time": "16:09:44" },
    { "price": 78169, "size": 0.011740, "time": "16:09:44" },
    { "price": 78169, "size": 0.011740, "time": "16:09:44" },
    { "price": 78169, "size": 0.011740, "time": "16:09:44" },
    { "price": 78169, "size": 0.011740, "time": "16:09:44" },
    { "price": 78169, "size": 0.011740, "time": "16:09:44" },
    { "price": 78169, "size": 0.011740, "time": "16:09:44" },
    { "price": 78169, "size": 0.011740, "time": "16:09:44" },
    { "price": 78169, "size": 0.011740, "time": "16:09:44" },
    { "price": 78169, "size": 0.011740, "time": "16:09:44" },
    { "price": 78169, "size": 0.011740, "time": "16:09:44" },
  ];

  return (
    <CardWrapper className="full-height">
      <h5>{props.t("Trade History")}</h5>
      <Table borderless className="text-center">
        <thead>
          <tr>
            <th className="pb-0 px-0 pe-md-2">{props.t("Price")}</th>
            <th className="pb-0 px-0 pe-md-2">{props.t("Size")}</th>
            <th className="pb-0 px-0">{props.t("Time")}</th>
          </tr>
        </thead>
        <tbody>
          {
            history.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="pb-0 px-0 pe-md-2">{item.price}</td>
                  <td className="pb-0 px-0 pe-md-2">{item.size}</td>
                  <td className="pb-0 px-0">{item.time}</td>
                </tr>
              );
            })
          }
        </tbody>
      </Table>
    </CardWrapper>
  );
};

export default withTranslation()(TradeHistory); 