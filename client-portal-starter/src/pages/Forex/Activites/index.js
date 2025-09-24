import {
  Container, Table,
  Button
} from "reactstrap";
import MetaTags from "react-meta-tags";
import { withTranslation } from "react-i18next";
import { useDispatch, connect } from "react-redux";
import { useState, useEffect } from "react";
import { fetchLogs } from "../../../store/general/logs/actions";
import { getLogMessage } from "helpers/getLogMessages";
import Loader from "components/Common/Loader";
import CardWrapper from "components/Common/CardWrapper";
import PageHeader from "components/Forex/Common/PageHeader";
import {
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "react-super-responsive-table";

const Activites = (props) => {
  const dispatch = useDispatch();
  const {
    t,
    logs,
    loading,
    totalDocs,
  } = props;  const constLimit = 5;
  const [limit, setLimit] = useState(constLimit);
  useEffect(() => {
    dispatch(fetchLogs({
      page: 1,
      limit,
    }));
  }, [limit]);

  function dateFormatter(val)  {
    let d = new Date(val.createdAt);
    d = `${d.toLocaleDateString()}, ${d.toLocaleTimeString()}`;
    return d;
  }

  function renderLoadBtn() {
    return logs?.length > 0
      && totalDocs > logs?.length && !loading &&
      <Button
        type="button"
        className=' w-100 mt-2 color-bg-btn border-0'
        onClick={() => {
          if (totalDocs > logs?.length) {
            setLimit(preValue => preValue + constLimit);
          }
        }}
      >
        {t("Load More")}
      </Button>;
  }

  const columns = [
    {
      dataField: "createdAt",
      text: t("Date and Time"),
      sort: true,
      formatter: dateFormatter,
    },
    {
      dataField: "message",
      text: t("Message"),
      sort: true,
      formatter: (val) => getLogMessage(val),
    },
  ];

  return (
    <>
      <MetaTags>
        <title>{t("Activities")}</title>
      </MetaTags>
      <Container>
        <div className="page-content mt-5">
          <PageHeader title="Activities
          "></PageHeader>
          <div>
            <CardWrapper className="mt-4 p-4 glass-card shadow">
              <div className="border rounded-3 mt-4">
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
                  <Tbody>
                    {loading && <Loader />}
                    {logs?.length > 0 && logs.map((log, index) => (
                      <tr key={index} className="border-top">
                        <td className="font-weight-bold">{dateFormatter(log)}</td>
                        <td className="font-weight-bold">{getLogMessage(log)}</td>
                      </tr>
                    ))}
                  </Tbody>
                </Table>
              </div>
              <div className="mt-4">
                {renderLoadBtn()}
              </div>
            </CardWrapper>
          </div>
        </div>
      </Container>
    </>
  );
};

const mapStateToProps = (state) => ({
  logs: (state.logs.logs && state.logs.logs.docs) || [],
  totalDocs: state.logs.logs.totalDocs,
  logsLoaded: state.logs.logsLoaded,
  loading: state.logs.loading,
});

export default connect(mapStateToProps, null)(withTranslation()(Activites));