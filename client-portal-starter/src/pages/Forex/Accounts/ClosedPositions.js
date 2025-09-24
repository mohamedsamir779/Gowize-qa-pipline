import { useSelector } from "react-redux";
import {
  Table, Col, Row, Spinner
} from "reactstrap";
import { withTranslation } from "react-i18next";

import moment from "moment";
import CustomPagination from "components/Common/CustomPagination";
import CardWrapper from "components/Common/CardWrapper";
import { useState, useEffect } from "react";
import {
  Th,
  Thead,
  Tr
} from "react-super-responsive-table";

const ClosedPosition = (props) => {
  const { closed: closedPosition, loading } = useSelector((state) => state.forex.accounts.positions);

  const [sizePerPage, setSizePerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [paginatedPositions, setPaginatedPositions] = useState([]);
  const totalPositions = closedPosition ? closedPosition.length : 0;
  
  const totalPages = Math.ceil(totalPositions / sizePerPage);
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  useEffect(() => {
    setSizePerPage(10);
    setPage(1);
  }, [closedPosition]);

  useEffect(() => {
    if (closedPosition) {
      const start = (page - 1) * sizePerPage;
      const end = start + sizePerPage;
      setPaginatedPositions(closedPosition.slice(start, end));
    }
  }, [page, sizePerPage, closedPosition]);

  const columns = [
    {
      dataField: "PositionID",
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
    {
      dataField: "Profit",
      text: props.t("Profit"),

    },
    {
      dataField: "PricePosition",
      text: props.t("Open Price"),
      formatter: (val) => { return val?.PriceOpen}
    },
    {
      dataField: "Price",
      text: props.t("Close Price"),
      formatter: (val) => { return val?.PriceClose}
    },
    {
      dataField: "Volume",
      text: props.t("Volume"),
      formatter: (val) => parseFloat(val?.Volume / 100000).toFixed(2),
    },
    {
      dataField: "Time",
      text: props.t("Created Time"),
      formatter: (val) => moment(val?.TimeCreate).format("DD-MM-YYYY HH:mm:ss"),
    },
  ];

  return (
    <CardWrapper className="mt-3 px-5 py-4 glass-card">
      <Row>
        <Col className="d-flex justify-content-between">
          <h3 className="color-primary">{props.t("Closed Positions")}</h3>
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
                : closedPosition?.length === 0
                  ? <tr><td colSpan="100%" className="my-2">{props.t("No closed positions for this account.")}</td></tr>
                  : paginatedPositions.map((pos) => 
                    <tr key={pos.PositionID} className="border-top">
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
          isClientSide
          totalDocs={totalPositions}
          page={page}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          totalPages={totalPages}
          setSizePerPage={
            (size) => {
              setSizePerPage(size);
              setPage(1);
            }
          }
          sizePerPage={sizePerPage}
          onChange={setPage}
          
        />
      </div>
    </CardWrapper>
  );
};

export default withTranslation()(ClosedPosition);