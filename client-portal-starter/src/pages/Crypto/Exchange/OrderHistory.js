import {
  ButtonGroup,
  Button,
  Table,
  Spinner
} from "reactstrap";

import {
  useDispatch, useSelector
} from "react-redux";
import { getOrdersStart } from "../../../store/crypto/orders/actions";

import { useTranslation, withTranslation } from "react-i18next";

import CardWrapper from "../../../components/Common/CardWrapper";
import { useState, useEffect } from "react";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders: orderHistory, loading } = useSelector(state => state.crypto.orders);
  const [orderStatus, setOrderStatus] = useState("closed");
  const { t } =  useTranslation(); 
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.toLocaleDateString()}, ${d.toLocaleTimeString()}`;
  };

  useEffect(() => {
    dispatch(getOrdersStart({
      limit: 5,
      status: orderStatus
    }));
  }, [orderStatus]);
  return (
    <CardWrapper className="custom-height">
      <div className="d-flex justify-content-between py-2">
        <h5 className="text-capitalize">{orderStatus} {t("Orders")}</h5>
        <ButtonGroup className="border rounded">
          <Button size="sm" color={orderStatus === "open" ? "secondary" : "white"} className="px-3"
            onClick={() => setOrderStatus("open")}
          >
            {t("Open")}</Button>
          <Button size="sm" color={orderStatus === "closed" ? "secondary" : "white"} className="px-3"
            onClick={() => setOrderStatus("closed")}
          >
            {t("Closed")}</Button>
        </ButtonGroup>
      </div>
      <Table borderless className="text-center">
        <thead>
          <tr>
            <th className="pb-0">{t("Symbol")}</th>
            <th className="pb-0">{t("Date")}</th>
            <th className="pb-0">{t("Type")}</th>
            <th className="pb-0">{t("Side")}</th>
            <th className="pb-0">{t("Amount")}</th>
            <th className="pb-0">{t("Tp")}</th>
            <th className="pb-0">{t("Sl")}</th>
            <th className="pb-0">{t("Price")}</th>
          </tr>
        </thead>
        <tbody>
          {
            loading ?
              <tr>
                <td className="pb-0" colSpan="100%"><Spinner /></td>
              </tr>
              :
              orderHistory?.length > 0
                ? orderHistory.map((item) =>
                  <tr key={item._id}>
                    <td className="pb-0">{item.symbol}</td>
                    <td className="pb-0"><span>{formatDate(item.createdAt)}</span></td>
                    <td className="pb-0">{item.type}</td>
                    <td className="pb-0">{item.side}</td>
                    <td className="pb-0">{item.amount?.$numberDecimal ?? item.amount}</td>
                    <td className="pb-0">{item.paramsData?.tp}</td>
                    <td className="pb-0">{item.paramsData?.sl}</td>
                    <td className="pb-0">{item.price?.$numberDecimal ?? item.price}</td>
                  </tr>
                )
                :
                <tr>
                  <td className="pb-0" colSpan="100%">You don&apos;t have any {orderStatus} orders.</td>
                </tr>
          }
        </tbody>
      </Table>
    </CardWrapper>
  );
};

export default withTranslation()(OrderHistory); 