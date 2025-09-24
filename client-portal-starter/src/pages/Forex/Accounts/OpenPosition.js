
import { useDispatch, useSelector } from "react-redux";
import {
  Table, Col, Row,  Spinner
} from "reactstrap";
import { withTranslation } from "react-i18next";

import moment from "moment";

import CardWrapper from "components/Common/CardWrapper";
import CustomPagination from "components/Common/CustomPagination";
import { useState, useEffect } from "react";
import { getOpenPositionsStart } from "store/actions";
import {
  Th,
  Thead,
  Tr
} from "react-super-responsive-table";

const OpenPosition = (props) => {
  
  const { open, loading } = useSelector((state) => state.forex.accounts.positions);
  const openPositions = open ? open.docs : [];
  const dispatch = useDispatch();
  const [sizePerPage, setSizePerPage] = useState(10);

  useEffect(() => {
    loadOpenPositions(1, sizePerPage);
  }, [sizePerPage]);
  

  const loadOpenPositions = (page = 1, limit = 10) => {
    if (props.accountId) dispatch(getOpenPositionsStart({
      limit,
      page,
      _id: props.accountId
    }));
  };

  const columns = [
    {
      dataField: "Position",
      text: "#",
      formatter: (val) => { return val?.Position}
    },
    {
      dataField: "Action",
      text: props.t("Deal Type"),
      formatter: (val) => (val?.Action === "0" ? props.t("Buy") : props.t("Sell"))
    },
    {
      dataField: "Symbol",
      text: props.t("Symbol"),
    },
    // {
    //   dataField: "Profit",
    //   text: props.t("Profit"),
    // },
    {
      dataField: "PriceOpen",
      text: props.t("Open Price"),
    },
    // {
    //   dataField: "PriceCurrent",
    //   text: props.t("Current Price"),
    // },
    {
      dataField: "Volume",
      text: props.t("Volume"),
      formatter: (val) => parseFloat(val?.Volume / 100000).toFixed(2),
    },
    {
      dataField: "TimeCreate",
      text: props.t("Created Time"),
      formatter: (val) => moment(val?.TimeCreate).format("DD-MM-YYYY HH:mm:ss"),
    },
  ];

  return (
    <CardWrapper className="mt-3 px-5 py-4 glass-card">
      <Row>
        <Col className="d-flex justify-content-between">
          <h3 className="color-primary">{props.t("Open Positions")}</h3>
        </Col>
      </Row>
      <div className="mt-4 border rounded-3">
        <Table borderless responsive className="text-center mb-0" >
          <Thead className="text-center table-light">
            <Tr>
              {columns.map((column, index) => (
                <Th data-priority={index} key={index} className="color-primary"> 
                  {column.text}
                </Th>
              ))}
            </Tr>
          </Thead>
          <tbody className="border-top font-weight-bold">
            {loading
              ? <tr><td className="py-4" colSpan="100%"><Spinner /></td></tr>
              : !props.accountId
                ? <tr><td colSpan="100%" className="my-2">{props.t("Please select an account.")}</td></tr>
                : openPositions.length === 0
                  ? <tr><td colSpan="100%" className="my-2">{props.t("No open positions for this account.")}</td></tr>
                  : openPositions.map((pos) =>
                    <tr key={pos.Position} className="border-top">
                      {columns.map((column, index) => (
                        <td data-priority={index} key={index}>
                          {column.formatter ? column.formatter(pos) : pos[column.dataField]}
                        </td>
                      ))}
                    </tr>
                  )
            }
          </tbody>
        </Table>
      </div>
      <div className="mt-4">
        <CustomPagination
          {...open}
          setSizePerPage={setSizePerPage}
          sizePerPage={sizePerPage}
          onChange={loadOpenPositions}
        />
      </div>
    </CardWrapper>
  );
};

export default withTranslation()(OpenPosition);