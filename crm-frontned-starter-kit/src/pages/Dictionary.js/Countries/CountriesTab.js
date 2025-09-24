import React, { useState, useEffect } from "react";
import { useDispatch, connect } from "react-redux";
import {
  CardBody, Card, CardHeader
} from "reactstrap";
import { Link } from "react-router-dom";
import CountriesAdd from "./CountriesAdd";
import TableLoader from "components/Common/TableLoader";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import DeleteModal from "components/Common/DeleteModal";
import CountriesEdit from "./CountriesEdit";
import { removeItem } from "store/dictionary/actions";
import { withTranslation } from "react-i18next";

function CountriesTab(props){  
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletedItem, setDeletedItem] = useState();
  const [editModal, setEditModal] = useState();
  const [selectedCountry, setSelectedCountry] = useState();
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
  const columns = [
    {
      dataField:"alpha2",
      text:props.t("Alpha2"),
      formatter:(val)=>val.alpha2.toUpperCase()
    }, 
    {
      dataField:"alpha3",
      text:props.t("Alpha3"),
      formatter:(val)=>val.alpha3.toUpperCase()
    },
    {
      dataField:"callingCode",
      text:props.t("Calling Code"),
      formatter :(value)=>(`+${value.callingCode}`)
    },
    {
      dataField:"ar",
      text:props.t("Arabic")
    },
    {
      dataField:"en",
      text:props.t("English")
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Action"),
      formatter: (item) => {
        
        return (
          <div className="d-flex gap-3">
            <Link className={`text-success ${!update ? "d-none" : ""}`} to="#">
              <i
                className="mdi mdi-pencil font-size-18"
                id="edittooltip"
                onClick={() => { setSelectedCountry(item); setEditModal(!editModal)}}
              ></i>
            </Link>
            <Link className={`text-danger ${!deletePermission ? "d-none" : ""}`} to="#">
              <i
                className="mdi mdi-delete font-size-18"
                id="deletetooltip"
                onClick={() => {setDeleteModal(!deleteModal); setDeletedItem(item)}}
              ></i>
            </Link>
          </div>
        );
      }
    }
  ];
  function deleteCountry (){
    dispatch(removeItem(props.id, { "countries":{ ...deletedItem } }));
  }
  return (

    <React.Fragment>
    
      <Card>
        <CardHeader>
          <div className="d-flex justify-content-end align-items-center">
            <CountriesAdd/>
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
                <Thead className="text-center">
                  <Tr>
                    {columns.map((column, index) =>
                      <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                    )}
                  </Tr>
                </Thead>
                <Tbody className="text-center" style={{ fontSize:"13px" }}>
                  {props.loading && <TableLoader colSpan={4} />}
                  {!props.loading && props.countries.map((row, rowIndex) =>
                           
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
      {<CountriesEdit open={editModal} country={selectedCountry} onClose={()=>setEditModal(false)}/>}
      {<DeleteModal loading= {props.disableDeleteButton} show ={deleteModal} onDeleteClick={deleteCountry} onCloseClick={()=>setDeleteModal(false)}/>}
    </React.Fragment>
  );
}
const mapStateToProps = (state)=>({
  dictionary:state.dictionaryReducer.dictionary || [],
  countries :state.dictionaryReducer.countries || [],
  id:state.dictionaryReducer.id,
  editSuccess:state.dictionaryReducer.editSuccess,
  deleteLoading:state.dictionaryReducer.deleteLoading,
  clearDeleteModal :state.dictionaryReducer.clearDeleteModal,
  dictionariesPermissions:state.Profile.dictionariesPermissions || {},
  disableDeleteButton : state.dictionaryReducer.disableDeleteButton
});
export default connect(mapStateToProps, null)(withTranslation()(CountriesTab));