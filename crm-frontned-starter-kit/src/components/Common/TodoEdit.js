import React, { useState, useEffect } from "react";
import {
  useDispatch, connect, useSelector
} from "react-redux";
import {
  Modal, ModalHeader,
  ModalBody,
  Row, Col
} from "reactstrap";
import {
  AvForm, AvField
} from "availity-reactstrap-validation";
import { withTranslation } from "react-i18next";
import { AsyncPaginate } from "react-select-async-paginate";

import {
  addNoteStart, addReminderStart, addTodosStart, addRemarkStart, editTodoStart
} from "store/todos/actions";

import * as clientsApi from "apis/client";

// const optionsPerPage = 3;

const loadClientsOptions = async (search, page) => {
  const payload = {
    page: page,
    limit: 30,
  };
  if (search) {
    payload.searchText = search;
  }
  const output = [];
  const data = await clientsApi
    .getClients({
      payload: payload,
    })
    .then((results) => {
      return results;
    });
  data.result?.docs?.map(function (item) {
    output.push({
      value: item._id,
      label: item.firstName + " " + item.lastName,
    });
  });
  return {
    options: output,
    hasMore: data.hasNextPage,
  };
};

function TodoAdd(props) {
  const [addModal, setAddTodoModal] = useState(false);
  const [typeText, setTypeText] = useState(false);
  const [todoObj, setTodoObj] = useState({
    note: props?.data?.note,
    timeEnd: props?.data?.timeEnd ? new Date(props?.data?.timeEnd) : new Date(),
    type: 1,
    _id: props?.data?._id,
    id: props?.data?._id,
  });

  useEffect(() => {
    setTodoObj({
      note: props?.data?.note,
      timeEnd: props?.data?.timeEnd ? new Date(props?.data?.timeEnd) : new Date(),
      type: 1,
      _id: props?.data?._id,
      id: props?.data?._id,
    });
  }, [props.data]);

  const dispatch = useDispatch();
  const { create = true } = props.todosPermissions;
  const toggleAddModal = () => {
    setAddTodoModal(!addModal);
    if (props.onClose) {
      props.onClose();
    }
  };
  const handleAddTodo = (e, values) => {
    const params = {
      ...values,
      id: todoObj._id,
      timeEnd: values.timeEnd ? new Date(values.timeEnd).toISOString() : todoObj.timeEnd,
    };
    console.log(params, "params");
    let add;
    switch (props.type) {
      case 0:
        add = editTodoStart;
        break;
      case 1:
        add = addReminderStart;
        break;
      case 2:
        add = addNoteStart;
        break;
      case 3:
        add = addRemarkStart;
        break;
      default:
        add = editTodoStart;
        break;
    }

    dispatch(add(params));
  };

  useEffect(()=>{
    props.onClose();
  }, [props.editDone]);

  useEffect(() => {
    if (props.clearingCounter > 0 && addModal) {
      setAddTodoModal(false);
      if (props.onClose) {
        props.onClose();
      }
    }
  }, [props.clearingCounter]);

  useEffect(() => {
    setAddTodoModal(props.show);
  }, [props.show]);

  useEffect(() => {
    switch (props.type) {
      case 0:
        setTypeText("Task");
        break;
      case 1:
        setTypeText("Reminder");
        break;
      case 2:
        setTypeText("Note");
        break;
      case 3:
        setTypeText("Remark");
        break;
    }
  }, [props.type]);

  /**
   * For clients dropdown
   */
  const [clientValue, setclientValue] = useState(null);


  const loadPageOptions = async (q, prevOptions, { page }) => {

    const { options, hasMore } = await loadClientsOptions(q, page);

    return {
      options,
      hasMore,

      additional: {
        page: page + 1,
      },
    };
  };

  // useEffect(() => {
  //   console.log(props.data);
  //   console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
  //   if (props.data && props.data.customerId && props.data.customerId._id) {
  //     setTodoObj({
  //       ...props.data,
  //       timeEnd: moment(props.data.timeEnd).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
  //     });
  //     console.log(todoObj);
  //   }
  //   // if (props.selectedDay) {
  //   //   setTodoObj({
  //   //     ...todoObj,
  //   //     timeEnd: new Date(new Date(props.selectedDay).toLocaleString("en-US", {
  //   //       timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  //   //     }))
  //   //   });
  //   // }
  // }, [props.data]);

  const { layoutMode } = useSelector(state => state.Layout);

  const customStyles = {
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#495057",
      padding: 0,
      paddingRight: "5px",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none"
    }),
    control: (provided) => {
      if (layoutMode === "dark") {
        return {
          ...provided,
          backgroundColor: "#19283B",
          border: 0,
          boxShadow: "0 0.125rem 0.25rem #0B182F",
          color: "#adb5bd",
          height: "100%",
        };
      }
      return {
        ...provided,
        height: "100%",
      };
    },
    menu: (provided) => ({
      ...provided,
      backgroundColor: layoutMode === "dark" ? "#242632" : "white",
      color: layoutMode === "dark" ? "#adb5bd" : "#495057",
      zIndex: 3,
    }),
    option: (provided, state) => ({
      ...provided,
      display: state.isDisabled ? "none" : "flex",
      flexDirection: "row",
      alignItems: "center",
      color: layoutMode === "dark" ? "#adb5bd" : "#495057",
    }),
    singleValue: (provided) => {
      return {
        ...provided,
        flexDirection: "row",
        alignItems: "center",
        color: layoutMode === "dark" ? "#adb5bd" : "#495057",
      };
    },
  };

  return (
    <React.Fragment >
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          Edit {typeText}
        </ModalHeader>
        <ModalBody >
          <AvForm onValidSubmit={handleAddTodo}>
            <Row form>
              {props.selectedClient && <React.Fragment>
                <Col className="col-12 mb-3">
                  <label>{props.t("Client")}</label>
                  <h5>{props.t(props.selectedClient.firstName + " " + props.selectedClient.lastName)}</h5>
                </Col>
                <AvField
                  name="customerId"
                  type="hidden"
                  value={props.selectedClient?._id}
                />
              </React.Fragment>}
              {props.data && props.data.customerId && <React.Fragment>
                <Col className="col-12 mb-3">
                  <label>{props.t("Client")}</label>
                  <h5>{props.t(props.data.customerId.firstName + " " + props.data.customerId.lastName)}</h5>
                </Col>
              </React.Fragment>}
              {!props.selectedClient && !props.data && <Col className="col-12 mb-3">
                <label>Client</label>
                <AsyncPaginate
                  styles={customStyles}
                  additional={{ page: 1 }}
                  value={clientValue}
                  loadOptions={loadPageOptions}
                  placeholder="Choose Client Name ..."
                  onChange={(obj) => { setclientValue(obj) }}
                  errorMessage="please select Client"
                  validate={{ required: { value: true } }}
                />
                <AvField
                  style={{ display: "none" }}
                  name="customerId"
                  type="text"
                  errorMessage={props.t("Please Select Client")}
                  value={clientValue && clientValue.value}
                  validate={{
                    required: { value: true },
                  }}
                />

              </Col>}

              <Col className="col-12 mb-3">
                <AvField
                  name="note"
                  label={props.t("Note")}
                  type="text"
                  value={todoObj.note}
                  errorMessage={props.t("Invalid Reminder Note")}
                  validate={{
                    required: { value: true },
                  }}
                />

              </Col>
              {
                props.data?.type == "1" &&
                <Col className="col-12 mb-3">
                  <AvField
                    type="datetime-local"
                    name="timeEnd"
                    value={props.timeEnd}
                    label={props.t("Date")}
                    errorMessage={props.t("Invalid Reminder Note")}
                  >
                  </AvField>
                </Col>
              }
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-success save-event"
                  >
                    {props.t("Edit")}
                  </button>
                </div>
              </Col>
            </Row>
          </AvForm>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}


const mapStateToProps = (state) => ({
  todosPermissions: state.Profile.todosPermissions || {},
  clearingCounter: state.todosReducer.clearingCounter || 0,
  editDone: state.todosReducer.editDone
});
export default connect(mapStateToProps, null)(withTranslation()(TodoAdd));
