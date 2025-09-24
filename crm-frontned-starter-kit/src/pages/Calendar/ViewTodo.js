import React, { useEffect, useState } from "react";

import {
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import {
  useDispatch, connect
} from "react-redux";
import { withTranslation } from "react-i18next";

import { Link } from "react-router-dom";

import DeleteModal from "components/Common/DeleteModal";
import TodoEdit from "components/Common/TodoEdit";
import { deleteTodosStart } from "store/actions";
import moment from "moment";
import { getNoteType } from "common/utils/getNoteType";
import { getClientLink } from "common/utils/getCustomerLink";

function EditReminderModal(props) {
  const { delete: deleteTodos } = props.todosPermissions;
  const { update: updateTodos } = props.todosPermissions;
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoObj, setTodoObj] = useState({
    note: "",
    timeEnd: "",
    type: 1,
    _id: "",
    createdBy: {
      firstName: "",
      lastName: "",
    },
    customerId: {
      firstName: "",
      lastName: "",
    }
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.data && props.data.customerId && props.data.customerId._id) {
      setTodoObj({
        ...todoObj,
        ...props.data
      });
    }
  }, [props.data]);


  useEffect(() => {
    if (props.clearingCounter > 0) {
      setShowEditModal(false);
      props.onClose();
    }
  }, [props.clearingCounter]);

  useEffect(() => {
    if (props.deletingClearCounter > 0 && showDeleteModal) {
      setShowDeleteModal(false);
      props.onClose();
    }
  }, [props.deletingClearCounter]);

  const deleteRole = () => {
    dispatch(deleteTodosStart({
      id: todoObj._id,
      type: todoObj.type
    }));
  };

  return (
    <React.Fragment >
      <Modal isOpen={props.show} toggle={props.onClose} centered={true}>
        <ModalHeader toggle={props.onClose} tag="h4">
          {getNoteType(todoObj.type)}
        </ModalHeader>
        <ModalBody >
          <div className="row">
            <div className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-2">
              <Row>
                <Col className="col-10">
                  <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-3">
                    {getClientLink(todoObj.customerId._id, todoObj.customerId.firstName, todoObj.customerId.lastName)}
                    {/* <h6 style={{ textTransform: "capitalize" }}>{todoObj.customerId.firstName + " " + todoObj.customerId.lastName}</h6> */}
                  </div>
                </Col>
                <Col className="col-2">
                  {updateTodos && <Link className="text-success float-end" to="#">
                    <i
                      className="mdi mdi-pencil font-size-18"
                      id="edittooltip"
                      onClick={() => { setShowEditModal(true) }}
                    ></i>
                  </Link>}
                  {deleteTodos && <Link className="text-danger" to="#">
                    <i
                      className="mdi mdi-delete font-size-18"
                      id="deletetooltip"
                      onClick={() => { setShowDeleteModal(true) }}
                    ></i>
                  </Link>}
                </Col>
              </Row>
              {
                <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-3">
                  <span>
                    Client Phone: {todoObj?.customerId?.phone || todoObj?.customerId?.mobile}
                  </span>
                </div>
              }
              {todoObj.type === 1 &&
                <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-3">
                  <span>
                    Reminder At: {moment(todoObj.timeEnd).format("YYYY-MM-DD hh:mm")}
                  </span>
                </div>}
              <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-3">
                Created By: {todoObj.createdBy.firstName + " " + todoObj.createdBy.lastName}
              </div>
              <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12">
                {`Text: ${todoObj.note}`}
              </div>
            </div>
          </div>
          <TodoEdit
            show={showEditModal}
            data={props.data}
            onClose={() => { setShowEditModal(false) }}
            hidenAddButton={true}
          />
        </ModalBody>
      </Modal>
      <DeleteModal
        loading={props.deleteLoading}
        onDeleteClick={deleteRole}
        show={showDeleteModal}
        onCloseClick={() => { setShowDeleteModal(false) }}
      />

    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  clearingCounter: state.todosReducer.clearingCounter || 0,
  deletingClearCounter: state.todosReducer.deletingClearCounter,
  todosPermissions: state.Profile.todosPermissions || {},
});
export default connect(mapStateToProps, null)(withTranslation()(EditReminderModal));
