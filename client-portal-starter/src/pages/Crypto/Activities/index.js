import React, { useEffect, useState } from "react";
import { Button, Container } from "reactstrap";
import { useDispatch, connect } from "react-redux";
import MetaTags from "react-meta-tags";
import CardWrapper from "../../../components/Common/CardWrapper";
import CustomTable from "../../../components/Common/CustomTable";
//i18n
import { withTranslation } from "react-i18next";
import { fetchLogs } from "store/actions";
import { getLogMessage } from "helpers/getLogMessages";

function Activities(props) {
  const dispatch = useDispatch();
  const {
    t,
    logs,
    loading,
    totalDocs,
  } = props;
  const constLimit = 5;
  const [limit, setLimit] = useState(constLimit);

  const columns = [
    {
      dataField: "createdAt",
      text: props.t("Time"),
      formatter: (val) => {
        let d = new Date(val.createdAt);
        d = `${d.toLocaleDateString()}, ${d.toLocaleTimeString()}`;
        return d;
      }
    },
    {
      dataField: "content",
      text: props.t("Message"),
      formatter: (val) => (getLogMessage(val))
    }, 
  ];

  useEffect(()=>{
    dispatch(fetchLogs({
      page: 1,
      limit,
    }));
  }, [limit]);

  return (
    <>
      <div className="page-content">
        <MetaTags>
          <title>{props.t("Activities")}</title>
        </MetaTags>
        <Container className="mb-5 mt-5">
          <h1 className="mb-4">
            {t("Activities")}
          </h1>
          <CardWrapper>
            <Container>
              <CustomTable 
                columns={columns} 
                rows={logs} 
                loading={loading}
              />
              {
                logs?.length > 0 
                  && totalDocs > logs?.length &&
                  <Button 
                    type="button" 
                    className='blue-gradient-color w-100' 
                    onClick={() => {
                      if (totalDocs > logs?.length) {
                        setLimit(preValue => preValue + constLimit);
                      }
                    }}
                  >
                    {t("Load More")}
                  </Button> 
              }
            </Container>
          </CardWrapper>
        </Container>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  logs: state.logs.logs && state.logs.logs.docs || [],
  totalDocs: state.logs.logs.totalDocs,
  logsLoaded: state.logs.logsLoaded,
  loading: state.logs.loading,
});

export default connect(mapStateToProps, null)(withTranslation()(Activities));