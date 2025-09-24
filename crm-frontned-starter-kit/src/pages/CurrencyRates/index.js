import React, { useEffect, useState } from "react";
import {
  useDispatch, useSelector
} from "react-redux";

import {
  Row, Col, Card, CardBody, CardTitle, CardHeader, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem 
} from "reactstrap";

import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import { MetaTags } from "react-meta-tags";
import moment from "moment";
import { fetchConversionRates } from "store/actions";
import { useTranslation } from "react-i18next";
import ConversionEditModal from "./ConversionEditModal";
import ConversionAddModal from "./ConverionAddModal";

function Teams() {
  const [selectedRow, setSelectedRow] = useState(null);

  const [sizePerPage, setSizePerPage] = useState(10);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { 
    loading,
    conversionRates,
    pagination,
    clearingCounter,
  } = useSelector((state) => state.conversionRatesReducer);
  
  useEffect(()=>{
    loadConversionRates(1, sizePerPage);
  }, [sizePerPage, clearingCounter]);

  const loadConversionRates = (page, limit) => {
    dispatch(fetchConversionRates({
      page,
      limit
    }));
  };
  
  const columns = [
    {
      text: t("Created At"),
      dataField: "createdAt",
      formatter: (item) => moment(item.createdAt).format("DD/MM/YYYY"),
    },
    {
      text: t("Base Currency"),
      dataField: "baseCurrency",
    },
    {
      text:t( "Target Currency"),
      dataField: "targetCurrency",
    },
    {
      text: t("Rate"),
      dataField: "value",
    },
    {
      dataField: "",
      text: t("Action"),
      formatter: (item) => (
        <UncontrolledDropdown
          disabled={!item?.isFromCRM}
        >
          <DropdownToggle
            tag="i"
            className="text-muted"
            style={{ cursor: "pointer" }}
          >
            <i
              className="mdi mdi-dots-horizontal font-size-18"
              style={{
                color:
                !item?.isFromCRM
                  ? "lightgray"
                  : "rgb(66, 65, 65)",
              }}
            />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem
              onClick={() => setSelectedRow(item)}
              href="#"
            >
              {t("Edit")}
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ),
    },
  ];

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Conversion Rates
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>Conversion Rates</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle className="color-primary">
                    Conversion Rates ({conversionRates?.length})
                  </CardTitle>
                  <ConversionAddModal />
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
                        <Tbody className="text-center">
                          {loading && <TableLoader colSpan={6} />}
                          {!loading && conversionRates.map((row, rowIndex) =>
                            <Tr key={rowIndex}>
                              {columns.map((column, index) =>
                                <Td key={`${rowIndex}-${index}`}>
                                  {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                                </Td>
                              )}
                            </Tr>
                          )}
                        </Tbody>
                      </Table>
                      <CustomPagination
                        {...pagination}
                        docs={conversionRates}
                        sizePerPage={sizePerPage}
                        setSizePerPage={setSizePerPage}
                        onChange={loadConversionRates}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      {selectedRow && (
        <ConversionEditModal
          editModal={selectedRow !== null} 
          value={selectedRow}
          toggleEditModal={() => setSelectedRow(null)}
        />
      )}
    </React.Fragment>
  );
}
export default Teams;
