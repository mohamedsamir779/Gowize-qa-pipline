import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { addTeam } from "store/teams/actions";

import { AsyncPaginate } from "react-select-async-paginate";

import loadOptions from "./loadOptions";

function TeamsAddModal(props) {
  const [addModal, setAddTeamModal] = useState(false);
  const [managerValue, setManagerValue] = useState(null);
  const [teamError, setTeamError] = useState(false);
  const [title, setTitle] = useState("");

  const dispatch = useDispatch();

  const { create } = props.teamsPermissions;
  const toggleAddModal = () => {
    setAddTeamModal(!addModal);
  };
  const handleAddTeam = (e, values = {}) => {
    if (managerValue) {
      values.managerId = managerValue?.value;
      values.title = title;
      dispatch(addTeam(values));
      setManagerValue(null);
    } else {
      setTeamError(true);
      setTimeout(() => {
        setTeamError(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (props.clearingCounter > 0 && addModal) {
      setAddTeamModal(false);
    }
  }, [props.addSuccess]);

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
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}>
        <i className="bx bx-plus me-1"></i>  Add New Team
      </Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          Add New Team
        </ModalHeader>
        <ModalBody>
          <AvForm
            className="p-4"
            onValidSubmit={(e, v) => {
              handleAddTeam(e, v);
            }}
          >
            <div className="mb-3">
              <AvField
                name="title"
                label="Team Title  "
                placeholder="Enter Team Title"
                type="text"
                onChange={(e)=>setTitle(e.target.value)}
                errorMessage="Enter Team Title"
                validate={{ required: { value: true } }}
              />
            </div>

            <div className="mb-3">
              <label>Team Manager</label>
              <AsyncPaginate
                styles={customStyles}
                additional={defaultAdditional}
                value={managerValue}
                loadOptions={loadPageOptions}
                onChange={setManagerValue}
                placeholder="Select Team Manager"
                errorMessage="please select Team Manager"
                validate={{ required: { value: true } }}
              />
              {teamError && (
                <p className="small text-danger ">please select Team Manager</p>
              )}
            </div>

            <div className="text-center ">
              <Button type="submit"  color="primary" className="">
                Add
              </Button>
            </div>
          </AvForm>
          {props.addError && (
            <UncontrolledAlert color="danger">
              <i className="mdi mdi-block-helper me-2"></i>
              {props.addErrorDetails}
            </UncontrolledAlert>
          )}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  addLoading: state.teamsReducer.addLoading,
  addErrorDetails: state.teamsReducer.addErrorDetails,
  addSuccess: state.teamsReducer.addSuccess,
  addError: state.teamsReducer.addError,
  // managersData: state.teamsReducer.managersData,
  clearingCounter: state.teamsReducer.clearingCounter,
  teamsPermissions: state.Profile.teamsPermissions || {}
});
export default connect(mapStateToProps, null)(TeamsAddModal);
