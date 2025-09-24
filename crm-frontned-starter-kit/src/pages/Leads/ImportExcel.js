
import { useDispatch, connect } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Col,
  Row
} from "reactstrap";
import React, { 
  useState, 
  useEffect, 
} from "react";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { addNewLeadExcel } from "../../store/leads/actions";
import { withTranslation } from "react-i18next";
import SourceDropDown from "../../components/Common/SourceDropDown";

function ImportExcel(props) {
  const dispatch = useDispatch();
  const [file, setFile] = useState({});
  const [addModal, setAddUserModal] = useState(false);
  const [source, setSource] = useState("");
  const { create } = props.leadsPermissions;

  const handleAddLead = (event, values)=>{
    event.preventDefault();
    const formData = new FormData();
    formData.append("leads", file);
    formData.append("source", source);
    dispatch(addNewLeadExcel(formData));
  }; 

  const toggleAddModal = () => {
    setAddUserModal(!addModal);
  };

  useEffect(() => {
    if (props.clearingCounter > 0 && addModal){
      setAddUserModal(false);
    }
  }, [props.clearingCounter]);
  
  const validateFile = (value, ctx, input, cb)=> {
    const extensions = ["csv", "xls", "xlsx"];
    const extension = value.split(".")[1];
    if (extensions.includes(extension) || !value){
      if (!value || file.size <= 2097152){
        cb(true);
      } else cb("2mb maximum size");
    } else cb("Only images or PDF can be uploaded");   
  };
  
  return (
    <React.Fragment>
      <Button
        color="primary"
        className={`btn btn-primary ${!create ? "d-none" : ""}`}
        onClick={toggleAddModal}>
        <i className="bx bx-plus me-1"/> 
        {props.t("Import Leads from Excel")}
      </Button>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Import Excel")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleAddLead(e, v);
            }}
          >
            <Row>
              <Col md="12">
                <div className="mb-3">
                  <AvField
                    name="lead"
                    type="file"
                    label={props.t("Select File")}
                    errorMessage={props.t("Please Select a valid file")}
                    validate = {{
                      required:{ value: true },
                      custom: validateFile 
                    }}
                    onChange={(e)=> setFile(e.target.files[0])}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <div className="mb-3">
                  <SourceDropDown 
                    setSource = {setSource}
                  />
                </div>
                <AvField
                  type="text"
                  name="source"
                  value={source}
                  errorMessage={props.t("Please Select a source")}
                  validate = {{
                    required:{ value: true },
                  }}
                  style={{
                    margin: -15,
                    opacity: 0, 
                    height: 0,
                    width: 0
                  }}
                />
              </Col>
            </Row>
            <div className='text-center pt-3 p-2'>
              <Button disabled={props.disableAddButton} type="submit" color="primary" className="">
                {props.disableAddButton ? ( <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"/>) : props.t("Add")}
              </Button>
            </div>
          </AvForm>
          {
            props.error && (
              <UncontrolledAlert color="danger">
                <i className="mdi mdi-block-helper me-2"/>
                {props.t(props.error)}
              </UncontrolledAlert>
            )
          }
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  error: state.leadReducer.error,
  showAddSuccessMessage: state.leadReducer.showAddSuccessMessage,
  disableAddButton: state.leadReducer.excelLoading,
  leadsPermissions: state.Profile.leadsPermissions || {},
  clearingCounter: state.leadReducer.addClearingCounter,
});

export default connect(mapStateToProps, null)(withTranslation()(ImportExcel));