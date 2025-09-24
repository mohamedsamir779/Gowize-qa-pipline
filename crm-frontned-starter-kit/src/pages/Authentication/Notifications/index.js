import TableLoader from "components/Common/TableLoader";
import CustomPagination from "components/Common/CustomPagination";
import formatDate from "helpers/formatDate";
import React, { useEffect, useState } from "react";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import {
  Table, Tbody, Td, Th, Thead, Tr
} from "react-super-responsive-table";
import {
  Card, CardBody, Col, Row
} from "reactstrap";
import { fetchNotifications } from "store/actions";
import { useTranslation } from "react-i18next";

function Notifications() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(10);
  const {
    notificationsData,
    loading,
  } = useSelector(
    (state) => ({
      notificationsData: state.notificationsReducer?.notifications || [],
      loading: state.notificationsReducer?.loading || false,
      markReadLoading: state.notificationsReducer?.markReadLoading || false,
    })
  );
  const {
    docs: notifications,
  } = notificationsData;

  const fetchData = (page = 1) => {
    dispatch(fetchNotifications({
      page,
      limit,
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [limit, 1]);

  const columns = [
    {
      dataField: "recordId",
      text: t("ID")
    },
    {
      dataField: "createdAt",
      text: t("Date Created"),
      formatter: (val) => formatDate(val.createdAt, "DD/MM/YYYY, hh:mm A"),
    },
    {
      dataField: "title",
      text: t("Title"),
      formatter: (val) => (val.title ? val.title : "-"),
    },
    {
      dataField: "body",
      text: t("Message"),
      formatter: (val) => (val.body ? val.body : "-"),
    },
  ];

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          {t("Notifications")}
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <Row>
            <Col className="col-12">
              <h2>{t("Notifications")}</h2>
            </Col>
            <Card>
              <CardBody>
                <div className="table-rep-plugin">
                  <div
                    className="table-responsive mb-0"
                    data-pattern="priority-columns"
                  >
                    <Table
                      id="my-notifications-1"
                      className="table table-hover"
                    >
                      <Thead className="text-center table-light" >
                        <Tr>
                          {columns.map((column, index) =>
                            <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                          )}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {loading && <TableLoader colSpan={4} />}
                        {!loading && notifications.length === 0 &&
                          <>
                            <Tr>
                              <Td colSpan={"100%"} className="fw-bolder text-center" st="true">
                                <h3 className="fw-bolder text-center">No records</h3>
                              </Td>
                            </Tr>
                          </>
                        }
                        {!loading && notifications.map((row, rowIndex) =>
                          <Tr key={rowIndex}>
                            {columns.map((column, index) =>
                              <Td key={`${rowIndex}-${index}`} className="text-center">
                                {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                              </Td>
                            )}
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                    <CustomPagination
                      {...notificationsData}
                      docs={notifications}
                      setSizePerPage={setLimit}
                      sizePerPage={limit}
                      onChange={fetchData}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Notifications;