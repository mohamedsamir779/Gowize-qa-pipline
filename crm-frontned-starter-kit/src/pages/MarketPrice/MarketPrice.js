import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import TableLoader from "components/Common/TableLoader";
import { withTranslation } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import {
  fetchMarkupsStart
} from "store/markups/actions";
import { fetchPricingStart, fetchOrderBook } from "../../store/marketPricing/actions";

function MarketPrice(props) {
  const dispatch = useDispatch();
  const [selectedMarket, ] = useState(props.location.state);
  const [sizePerPage, ] = useState(10);
  const [menu, setMenu] = useState(false);
  const [markup, setMarkup] = useState();
  const t = props.t;

  useEffect(() => {
    loadMarkups();
    loadPricing(1, sizePerPage);
    loadOrderBook(1, sizePerPage);
  }, [markup]);

  const loadMarkups = () => {
    dispatch(
      fetchMarkupsStart()
    );
  };
  const loadPricing = (page, limit) => {
    dispatch(fetchPricingStart({
      page,
      limit,
      pairName: selectedMarket.pairName,
      marketId: selectedMarket._id,
      markupId: markup?._id
    }));
  };
  const loadOrderBook = (page, limit) => {
    dispatch(fetchOrderBook({
      page,
      limit,
      pairName: selectedMarket.pairName,
      marketId: selectedMarket._id,
      markupId: markup?._id
    }));
  };
  const handleChooseMarkup = (item) => {
    setMarkup(item);
  };

  const buyOrderColumns = [
    {
      dataField: 0,
      text: props.t("Price"),
      formatter: (val) => {
        return val[0] ? parseFloat(val[0]).toFixed(4)  : <></>;
      }
    },
    {
      dataField: 1,
      text: props.t("Amount"),
      formatter: (val) => {
        return val[1] ? parseFloat(val[1]).toFixed(4)  : <></>;
      }
    },
    {
      dataField: 2,
      text: props.t(`Total (${selectedMarket.quoteAsset})`),
      formatter: (val) => {
        const total = val[0] * val[1];
        val[2] = total;
        return total.toFixed(4);
      }
    },
    {
      dataField: 3,
      text: props.t(`Sum (${selectedMarket.quoteAsset})`),
      formatter: (val, index) => {
        const total = val[0] * val[1];
        let sum = total;
        if (index > 0)
          sum = sum + props.orderBooks.docs[0]?.bids[index - 1][3];
        val[3] = sum;
        return sum.toFixed(4);
      }
    },
  ];

  const sellOrderColumns = [
    {
      dataField: 0,
      text: props.t("Price"),
      formatter: (val) => {
        return val[0] ? parseFloat(val[0]).toFixed(4)  : <></>;
      }
    },
    {
      dataField: 1,
      text: props.t("Amount"),
      formatter: (val) => {
        return val[1] ? parseFloat(val[1]).toFixed(4)  : <></>;
      }
    },
    {
      dataField: 2,
      text: props.t(`Total (${selectedMarket.quoteAsset})`),
      formatter: (val) => {
        const total = val[0] * val[1];
        val[2] = total;
        return total.toFixed(4);
      }
    },
    {
      dataField: 3,
      text: props.t(`Sum (${selectedMarket.quoteAsset})`),
      formatter: (val, index) => {
        const total = val[0] * val[1];
        let sum = total;
        if (index > 0)
          sum = sum + props.orderBooks.docs[0]?.asks[index - 1][3];
        val[3] = sum;
        return sum.toFixed(4);
      }
    },
  ];

  if (!selectedMarket) {
    return (<>
      <div className="page-content">
        <div className="container-fluid text-center">
          <h2>{t("Please select Market")}</h2>
        </div>
      </div>
    </>);
  }
  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between" style={{
          marginBottom: "30px",
          paddingRight: "50px"
        }}>
          <h2>{t(`${selectedMarket.pairName} Market`)}</h2>
          <Dropdown
            toggle={() => setMenu(!menu)}
            isOpen={menu}
          >
            <DropdownToggle caret>
              
              {markup ? `${markup.title} (${markup.value["$numberDecimal"] ? markup.value["$numberDecimal"] : markup.value})` : "Choose Markup"}
              <i className="mdi mdi-chevron-down"></i>
            </DropdownToggle>
            <DropdownMenu>
              {props.loading && <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>}
              <DropdownItem key={"Markup-Dropdown-None"} onClick={() => { handleChooseMarkup() }}>
                None
              </DropdownItem>
              {!props.loading && props.markups.map((markup, index) => {
                return <DropdownItem key={`Markup-Dropdown-${index}`} onClick={() => { handleChooseMarkup(markup) }}>
                  {markup.title} ({markup.value["$numberDecimal"] ? markup.value["$numberDecimal"] : markup.value})
                </DropdownItem>;
              })}
            </DropdownMenu>
          </Dropdown>
        </div>
        <Row>
          <Col className="col-12">
            <div>
              <Card>
                <CardBody>
                  {props.marketPrices.docs.map((row, index) => {
                    return <h6 key={index}>
                      {row.marketPrice["$numberDecimal"] ? row.marketPrice["$numberDecimal"] : row.marketPrice} ({selectedMarket.quoteAsset})
                    </h6>;
                  })}
                </CardBody>
              </Card>   
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="col-12 col-md-6">
            <Card>
              <CardHeader className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between  align-items-center">
                  <CardTitle className="color-primary">
                    {props.t("Buy Orders")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardBody>
                <div className="table-rep-plugin" style={props.orderBooks.docs[0]?.bids?.length > 0 ? {
                  height: "600px",
                  overflow: "auto"
                } : {}}>
                  <div
                    className="table-responsive mb-0"
                    data-pattern="priority-columns"
                  >
                    <Table id="tech-companies-1" className="table" >
                      <Thead>
                        <Tr>
                          {buyOrderColumns.map((column, index) => (
                            <Th data-priority={index} key={index}>
                              {column.text}
                            </Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {props.orderBooksLoading && <TableLoader colSpan={12} />}
                        {!props.orderBooksLoading &&
                          props.orderBooks.docs[0]?.bids?.map((row, rowIndex) => (
                            <Tr key={rowIndex}>
                              {buyOrderColumns.map((column, index) => (
                                <Td key={`${rowIndex}-${index}`}>
                                  {column.formatter
                                    ? column.formatter(row, rowIndex)
                                    : row[column.dataField] ? row[column.dataField] : <></>}
                                </Td>
                              ))}
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="col-12 col-md-6">
            <Card>
              <CardHeader className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between  align-items-center">
                  <CardTitle>
                    {props.t("Sell Orders")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardBody>
                <div className="table-rep-plugin" style={props.orderBooks.docs[0]?.asks?.length > 0 ? {
                  height: "600px",
                  overflow: "auto"
                } : {}}>
                  <div
                    className="table-responsive mb-0"
                    data-pattern="priority-columns"
                  >
                    <Table id="tech-companies-1" className="table">
                      <Thead>
                        <Tr>
                          {sellOrderColumns.map((column, index) => (
                            <Th data-priority={index} key={index}>
                              {column.text}
                            </Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody style={{}}>
                        {props.orderBooksLoading && <TableLoader colSpan={12} />}
                        {!props.orderBooksLoading &&
                          props.orderBooks.docs[0]?.asks?.map((row, rowIndex) => (
                            <Tr key={rowIndex}>
                              {sellOrderColumns.map((column, index) => (
                                <Td key={`${rowIndex}-${index}`}>
                                  {column.formatter
                                    ? column.formatter(row, rowIndex)
                                    : row[column.dataField] ? row[column.dataField] : <></>}
                                </Td>
                              ))}
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* <CustomPagination
            {...props}
            className="border-0"
            setSizePerPage={setSizePerPage}
            sizePerPage={sizePerPage}
            onChange={loadOrderBook}
            docs={props.orderBooks.docs}
          /> */}
        </Row>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  marketPricesLoading: state.MarketPricing.marketPricingLoading || false,
  orderBooksLoading: state.MarketPricing.orderBooksLoading || false,
  marketPrices: state.MarketPricing.marketPrices || [],
  orderBooks: state.MarketPricing.orderBooks || [],
  markups: state.markupsReducer.markups || []
});

export default connect(mapStateToProps, null)(withTranslation()(MarketPrice));