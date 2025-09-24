import React, { useEffect } from "react";
import { fetchDictionaryStart } from "store/dictionary/actions";
import {
  useDispatch,
  connect,
  useSelector
} from "react-redux";
import Select from "react-select";

import { withTranslation } from "react-i18next";

function CountryDropDown({ ...props }){ 
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(fetchDictionaryStart());
    
  }, []);
  
  const optionGroup = props.countries.map((country)=>{
    return ({
      label: `${country.en} ${country.ar}`, 
      value: country.en
    });
  });

  const selectedCountryObj = props.countries && optionGroup.find((country) => (
    country.value === props.defaultValue
  )); 

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
      <div className="mb-3">
        <label htmlFor="choices-single-default" className="form-label font-size-14">{props.t(props.label ?? "Country")}</label>
        {
          !selectedCountryObj &&
          <Select 
            style={customStyles}
            onChange={(e) => {
              props.countryChangeHandler(e);
            }}
            options={optionGroup}
            classNamePrefix="select2-selection"
            placeholder={props.t(`Select ${props.label ?? "Country"}`)}
          />
        }
        {
          selectedCountryObj &&
          <Select 
            onChange={(e) => {
              props.countryChangeHandler(e);
            }}
            defaultValue={selectedCountryObj}
            options={optionGroup}
            classNamePrefix="select2-selection"
          />
        }
      </div>
    </React.Fragment>);
}

const mapStateToProps = (state)=>({
  countries: state.dictionaryReducer.countries || []
});

export default connect(mapStateToProps, null)(withTranslation()(CountryDropDown));