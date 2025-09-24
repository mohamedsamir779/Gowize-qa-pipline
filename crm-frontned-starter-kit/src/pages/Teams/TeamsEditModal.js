import React, { useEffect, useState } from "react";
import {
  useDispatch,
  connect,
  useSelector
} from "react-redux";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { editTeam } from "store/teams/actions";
import { AsyncPaginate } from "react-select-async-paginate";
import loadOptions from "./loadOptions";

function TeamsEditModal(props) {
  const { open, team = {}, manager, onClose } = props;
  const [managerValue, setManagerValue] = useState(null);
  useEffect(() => {
    setManagerValue({
      value: team.managerId?._id,
      label: team.managerId?.firstName,
    });

  }, [manager]);
  const dispatch = useDispatch();
  const handleEditTeam = (e, values) => {
    values.managerId = managerValue.value;
    dispatch(
      editTeam({
        id: team._id,
        values,
      })
    );
  };
  useEffect(() => {
    if (props.editClearingCounter > 0 && open) {
      onClose();
    }
  }, [props.editSuccess]);

  const defaultAdditional = {
    page: 1,
  };

  const loadPageOptions = async (q, prevOptions, { page }) => {
    const { options, hasMore } = await loadOptions(q, page);

    return {
      options,
      hasMore,

      additional: {
        page: page + 1,
      },
    };
  };

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
    <React.Fragment>
      <Modal isOpen={open} toggle={onClose} centered={true}>
        <ModalHeader toggle={onClose} tag="h4">
          Edit Team
        </ModalHeader>
        <ModalBody>
          <AvForm
            className="p-4"
            onValidSubmit={(e, v) => {
              handleEditTeam(e, v);
            }}
          >
            <div className="mb-3">
              <AvField
                name="title"
                label="Team Title  "
                placeholder="Enter Team Title"
                type="text"
                errorMessage="Enter Team Title"
                value={team.title}
                validate={{ required: { value: true } }}
              />
            </div>
            <div className="mb-3">
              <label>Team Manager</label>

              <AsyncPaginate
                styles={customStyles}
                additional={defaultAdditional}
                default={manager}
                value={managerValue}
                loadOptions={loadPageOptions}
                placeholder="Select Team Manager"
                onChange={setManagerValue}
                errorMessage="please select Team Manager"
                validate={{ required: { value: true } }}
              />
            </div>
            <div className="text-center ">
              <Button type="submit" color="primary" className="" >
                Edit 
              </Button>
            </div>
          </AvForm>
          {props.editError && (
            <UncontrolledAlert color="danger">
              <i className="mdi mdi-block-helper me-2"></i>
              {props.editError}
            </UncontrolledAlert>
          )}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  editLoading: state.teamsReducer.editLoading,
  addLoading: state.teamsReducer.addLoading,
  editResult: state.teamsReducer.editResult,
  editError: state.teamsReducer.editError,
  editSuccess: state.teamsReducer.editSuccess,
  editClearingCounter: state.teamsReducer.editClearingCounter,
});
export default connect(mapStateToProps, null)(TeamsEditModal);
