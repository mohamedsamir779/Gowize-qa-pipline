import React, {
  useCallback, useEffect, useState
} from "react";
import { debounce } from "lodash";
import * as clientApi from "apis/client";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import AsyncAvFieldSelect from "./AsyncAvFieldSelect";


const SearchableClientIbSelect = (props) => {

  const {
    placeholder = "Search",
    isRequired = false,
    name = "client",
    label = "Clients",
    type = null,
    defaultOptions = [],
    value = null,
    onChange = () => { },
    disallowed = null,
  } = props;

  const [selectOptions, setSelectOptions] = useState(defaultOptions);

  useEffect(() => {
    const payload = {
      page: 1,
      limit: 10,
    };
    if (type) payload.fxType = type;
    clientApi.getClients({ payload }).then((data) => {
      setSelectOptions(data?.result?.docs
        .filter((client) => client._id !== disallowed)
        .map((client) => ({
          value: client._id,
          label: `${client.firstName} ${client.lastName}`
        })));
    });
  }, []);

  const debouncedChangeHandler = useCallback(
    debounce((inputValue, cb) => {
      clientApi.getClients({
        payload: {
          searchText: inputValue,
          fxType: type,
          page: 1,
          limit: 10,
        }
      }).then((data) => {
        return cb(data?.result?.docs.map((client) => (
          {
            label: `${client.firstName} ${client.lastName}`,
            value: `${client._id}`
          }
        )));
      });
    }, 1000), []);
  return (
    <AsyncAvFieldSelect
      name={name}
      options={selectOptions}
      label={props.t(label)}
      errorMessage={props.t("Agent is required")}
      loadOptions={debouncedChangeHandler}
      defaultOptions={selectOptions || defaultOptions}
      value={value || ""}
      defaultValue={value || ""}
      isRequired={isRequired}
      placeholder={placeholder}
      isSearchable={true}
      backspaceRemovesValue={true}
      onChange={onChange}
    />
  );
};


const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, null)(withTranslation()(SearchableClientIbSelect));