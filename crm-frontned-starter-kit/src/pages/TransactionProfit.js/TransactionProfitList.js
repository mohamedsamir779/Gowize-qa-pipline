import React, { useEffect, useState } from "react";
import {
  useDispatch, connect
} from "react-redux";
import {
  Row, Col, Card, CardBody, CardTitle, CardHeader, Spinner
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import TableLoader from "components/Common/TableLoader";
import { withTranslation } from "react-i18next";

import { fetchTransactionsProfitsStart } from "store/transactionsProfit/actions";
import { MetaTags } from "react-meta-tags";


function TransactionProfitList(props) {
  const [deleteModal, setDeleteModal] = useState(false);

  const [sizePerPage, setSizePerPage] = useState(10);

  const dispatch = useDispatch();


  useEffect(() => {
    loadTransactionsProfits(1, sizePerPage);
  }, [sizePerPage, 1]);
  
  useEffect(() => {
    if (!props.showDeleteModal && deleteModal) {
      setDeleteModal(false);

    }
  }, [props.showDeleteModal]);
  const loadTransactionsProfits = (page, limit) => {
    dispatch(fetchTransactionsProfitsStart());
  };

  const columns = [
    {
      dataField: "symbol",
      text: props.t("symbol"),
    },
    {
      dataField: "profit",
      text: props.t("Profit"),
    },
  ];

  const getData = (balances) => {
    return Object.keys(balances).map(key => {
      return {
        symbol: key,
        profit: balances[key],
      };
    });
  };


  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Exchange Balance
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>{props.t("Exchange Balances")}</h2>
          <Row>
            {props.transactionsProfits.map((transactionProfit, index)=><Col key={index} className="col-12">
              <Card>
                <CardHeader className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between  align-items-center">
                    <CardTitle>{props.t(transactionProfit.exchange)}</CardTitle>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                    >
                      <Table
                        id="tech-companies-1"
                        className="table  table-hover "
                      >
                        <Thead className="text-center table-light" >
                          <Tr>
                            {columns.map((column, index) =>
                              <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                            )}
                          </Tr>
                        </Thead>
                        
                        <Tbody style={{ fontSize: "13px" }}>
                          {props.loading && <TableLoader />}
                          {!props.loading && getData(transactionProfit.balances).map((row, rowIndex) => <Tr key={rowIndex}>
                            {columns.map((column, index) =>
                              <Td className="text-center" key={`${rowIndex}-${index}`}>
                                {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                              </Td>
                            )}
                          </Tr>
                          )}
                        </Tbody>
                      </Table>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>)}    
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  loading: state.transactionsProfitsReducer.loading || false,
  transactionsProfits: state.transactionsProfitsReducer.docs || [],
});

export default connect(mapStateToProps, null)(withTranslation()(TransactionProfitList));
