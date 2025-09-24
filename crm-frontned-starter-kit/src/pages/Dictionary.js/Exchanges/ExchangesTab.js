import React, { useState, useEffect } from "react";

import { useDispatch, connect } from "react-redux";
import {
  CardBody, CardHeader, Card
} from "reactstrap";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ExchangeAddModal from "./ExchangeAddModal";
import DeleteModal from "components/Common/DeleteModal";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import TableLoader from "components/Common/TableLoader";
import ExchangeEdit from "./ExchangeEdit";
import { removeItem } from "store/dictionary/actions";
import { captilazeFirstLetter } from "common/utils/manipulateString";
function ExchangesTab(props){ 
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletedItem, setDeletedItem] = useState();
  const [selectedExchange, setSelectedExchange] = useState();
  const [editModal, setEditModal] = useState(false);
  const dispatch = useDispatch();
  const { update, delete:deletePermission } = props.dictionariesPermissions;
  useEffect(()=>{
    if (!props.editSuccess && editModal){
      setEditModal(false);
    }
  }, [props.editSuccess]);
  useEffect(()=>{
    if (props.clearDeleteModal && deleteModal){
      setDeleteModal(false);
    }
  }, [props.clearDeleteModal]);
  let columns = [
    {
      dataField:"exchanges",
      text:props.t("Exchanges"),
      formatter:(val)=>captilazeFirstLetter(val.exchanges)
    }, 
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Action"),
      formatter: (item ) => {
        
        return (
          <div className="d-flex gap-3">
            <Link className={`text-success ${!update ? "d-none" : ""}`} to="#">
              <i
                className="mdi mdi-pencil font-size-18"
                id="edittooltip"
                onClick={() => {setSelectedExchange(item); setEditModal(!editModal)}}
              ></i>
            </Link>
            <Link className={`text-danger ${!deletePermission ? "d-none" : ""}`} to="#">
              <i
                className="mdi mdi-delete font-size-18"
                id="deletetooltip"
                onClick={() => {setDeletedItem(item); setDeleteModal(true)}}
              ></i>
            </Link>
          </div>
        );
      }
    }
  ];

  const customData = props.dictionary[0] ? props.exchanges.map((exchange)=>{
    return {
      exchanges:exchange
    };
  }) : [] ; 
  const deleteExchange = ()=>{
    dispatch(removeItem(props.id, deletedItem));
  };
  
  return (

    <React.Fragment>
    
      <Card>
        <CardHeader>
          <div className="d-flex  justify-content-end  align-items-center">
            <ExchangeAddModal/>
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
                      <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                    )}
                  </Tr>
                </Thead>
                <Tbody  style={{ fontSize: "13px" }} >
                  {props.loading && <TableLoader colSpan={4} />}
                  {!props.loading && customData.map((row, rowIndex) =>
                           
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
                    
            </div>
          </div>
        </CardBody>
      </Card>
      {<ExchangeEdit open={editModal} selectedExchange={selectedExchange} onClose={()=>setEditModal(false)}/>}
      {<DeleteModal loading={props.disableDeleteButton} show ={deleteModal} onDeleteClick={deleteExchange} onCloseClick={()=>setDeleteModal(false)}/>}
    </React.Fragment>
  );
}
const mapStateToProps = (state)=>({
  dictionary:state.dictionaryReducer.dictionary || [],
  exchanges: state.dictionaryReducer.exchanges  || [],
  disableDeleteButton :state.dictionaryReducer.disableDeleteButton,
  id:state.dictionaryReducer.id,
  editSuccess:state.dictionaryReducer.editSuccess,
  clearDeleteModal:state.dictionaryReducer.clearDeleteModal,
  dictionariesPermissions : state.Profile.dictionariesPermissions || {},
  
  
});
export default connect(mapStateToProps, null)(withTranslation()(ExchangesTab));