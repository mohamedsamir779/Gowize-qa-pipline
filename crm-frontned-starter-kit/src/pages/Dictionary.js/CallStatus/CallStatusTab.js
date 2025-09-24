import React, { useState, useEffect } from "react";
import {
  connect, useDispatch,
} from "react-redux";
import { Link } from "react-router-dom";
import {
  CardBody, Card, CardHeader
} from "reactstrap";
import { withTranslation } from "react-i18next";
import CallStatusAdd from "./CallStatusAdd";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import TableLoader from "components/Common/TableLoader";
import CallStatusEdit from "./CallStatusEdit";
import { fetchDictionaryStart } from "store/dictionary/actions";
function CallStatusTab(props) {
  const dispatch = useDispatch();
  const [selectedCallStatus, setSelectedCallStatus] = useState();
  const [editModal, setEditModal] = useState(false);
  const { update } = props.dictionariesPermissions;
  useEffect(() => {
    if (!props.editSuccess && editModal) {
      setEditModal(false);
    }
    if (props.editSuccess) {
      dispatch(fetchDictionaryStart());
    }
  }, [props.editSuccess]);

  const columns = [
    {
      dataField: "callStatus",
      text: props.t("Call Status"),
    },
    {
      dataField: "defaultCallStatusColors",
      text: props.t("Color"),
      formatter: (item) => <div style={{
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        margin: "auto",
        backgroundColor: props.defaultColors[item]
      }}></div>
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Action"),
      formatter: (item) => {
        return (
          <div className="d-flex justify-content-center">
            <Link className={`text-success ${!update ? "d-none" : ""}`} to="#">
              <i
                className="mdi mdi-pencil font-size-18"
                id="edittooltip"
                onClick={() => { setSelectedCallStatus(item); setEditModal(true) }}
              ></i>
            </Link>
          </div>
        );
      },
    }
  ];

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <div className="d-flex justify-content-end  align-items-center">
            <CallStatusAdd />
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
                className="table "
              >
                <Thead>
                  <Tr>
                    {columns.map((column, index) =>
                      <Th data-priority={index} key={index}className={column.dataField != "callStatus" ? "text-center" : ""}>{column.text}</Th>
                    )}
                  </Tr>
                </Thead>
                <Tbody style={{ fontSize: "13px" }}>
                  {props.loading && <TableLoader colSpan={4} />}
                  {!props.loading && Object.keys(props.callStatus).map((row, rowIndex) =>
                    <Tr key={rowIndex}>
                      {columns.map((column, index) =>
                        <Td key={`${rowIndex}-${index}`}>
                          {column.formatter ? column.formatter(row, rowIndex) : row}
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
      {<CallStatusEdit open={editModal} selectedCallStatus={selectedCallStatus} onClose={() => setEditModal(false)} />}
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  loading: state.dictionaryReducer.loading || false,
  dictionary: state.dictionaryReducer.dictionary || [],
  callStatus: state.dictionaryReducer.callStatus || [],
  defaultColors: state.dictionaryReducer.defaultCallStatusColors || [],
  id: state.dictionaryReducer.id,
  disableDeleteButton: state.dictionaryReducer.disableDeleteButton,
  editSuccess: state.dictionaryReducer.editSuccess,
  dictionariesPermissions: state.Profile.dictionariesPermissions || {},

});

export default connect(mapStateToProps, null)(withTranslation()(CallStatusTab));