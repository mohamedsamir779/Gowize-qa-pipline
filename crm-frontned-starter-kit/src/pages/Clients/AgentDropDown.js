import {
  connect,
  useDispatch,
  useSelector
} from "react-redux";
import { withTranslation } from "react-i18next";
import React, { useEffect } from "react";
import Select from "react-select";
import { getSalesAgentsStart, assignAgentStart } from "store/users/actions";

function AgentForm(props){

  const dispatch = useDispatch();
  const { clients } = props;
  const clientIds = clients.map(client=>{
    return client._id;
  });

  function assignAgent(e){
    dispatch(assignAgentStart({
      agentId: e.value._id,
      body:{
        clientIds
      },
      agent: {
        ...e.value
      }
    }));
  }
  
  useEffect(()=>{
    dispatch( getSalesAgentsStart({
      page: 1,
      limit: 1000
    }));
  }, []);
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
  
  const usersOptions = props.salesAgent.map((user) => {
    return  {
      label :`${user.firstName} ${user.lastName}`,
      value: {
        _id:user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    }; 
  });
  return (
    <React.Fragment >
      <div 
        style={{
          minWidth:"200px",
          // paddingInlineEnd: "1rem" 
        }} 
        // className="w-40"
      >
        <Select   
          classNamePrefix="select2-selection"
          placeholder="Select an agent"
          options= {usersOptions}
          style={customStyles}
          onChange = {(e)=>assignAgent(e)}
        />
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  error: state.clientReducer.error,
  clientPermissions: state.Profile.clientPermissions,
  salesAgent: state.usersReducer.salesAgent || []
});

export default connect(mapStateToProps, null)(withTranslation()(AgentForm));