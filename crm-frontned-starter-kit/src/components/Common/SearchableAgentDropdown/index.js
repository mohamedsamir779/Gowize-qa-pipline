import React, { useCallback, useEffect } from "react";
import { debounce } from "lodash";
import * as userApi from "apis/users";
import {
  getSalesAgentsStart,
} from "store/users/actions";
import { connect, useDispatch } from "react-redux";
import { withTranslation } from "react-i18next";
import AsyncAvFieldSelect from "../AsyncAvFieldSelect";


const SearchableAgentDropdown = (props) => {

  const dispatch = useDispatch();

  const {
    placeholder = "Search",
    isRequired = false,
    name = "agent",
    defaultOptions = [],
    value = null,
    agents = [],
    clientData = null,
    onChange = () => { },
    isMulti = false,
  } = props;

  const [agentOptions, setAgentOptions] = React.useState(defaultOptions);

  useEffect(() => {
    if (agents && agents.length > 0) {
      setAgentOptions(agents.map((user) => ({
        value: user._id,
        label: clientData && clientData.agent && clientData.agent._id === user._id 
          ? `${user.firstName} ${user.lastName} - (Currently Assigned)` 
          : user.firstName + " " + user.lastName
      })));
    }
  }, [agents, clientData]);

  useEffect(() => {
    if (!agents || agents.length === 0) {
      dispatch(getSalesAgentsStart({
        limit: 1000,
        page: 1
      }));
    }
  }, []);

  const debouncedChangeHandler = useCallback(
    debounce((inputValue, cb) => {
      userApi.getAssignedUsers({
        payload: {
          searchText: inputValue,
          page: 1,
          limit: 10,
        }
      }).then((data) => {
        return cb(data?.result?.docs.map((user) => (
          {
            label : clientData && clientData.agent && clientData.agent._id === user._id 
              ? `${user.firstName} ${user.lastName} - (Currently Assigned)` 
              : user.firstName + " " + user.lastName,
            value : `${user._id}`
          }
        )));
      });
    }, 1000), []);

  return (
    <AsyncAvFieldSelect 
      name={name}
      options={agentOptions}
      label={props.t("Agent")}
      errorMessage={props.t("Agent is required")}
      loadOptions={debouncedChangeHandler}
      defaultOptions={agentOptions || defaultOptions}
      value={value ? value : clientData?.agent?._id ? {
        label : `${clientData.agent.firstName} ${clientData.agent.lastName}`,
        value : `${clientData.agent._id}`
      } : ""}
      defaultValue={value ? value : clientData?.agent?._id ? {
        label : `${clientData.agent.firstName} ${clientData.agent.lastName}`,
        value : `${clientData.agent._id}`
      } : ""}
      isRequired={isRequired}
      placeholder={placeholder}
      isSearchable={true}
      backspaceRemovesValue={true}
      onChange={onChange}
      isMulti={isMulti}
    />
  );
};


const mapStateToProps = (state) => ({
  agents: state.usersReducer.salesAgent,
  agentsLoading: state.usersReducer.loading,
});
export default connect(mapStateToProps, null)(withTranslation()(SearchableAgentDropdown));