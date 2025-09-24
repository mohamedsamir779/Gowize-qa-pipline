import React, { useEffect } from "react";
import { fetchDictionaryStart } from "store/dictionary/actions";
import { useDispatch, connect } from "react-redux";
import Select from "react-select";

import { withTranslation } from "react-i18next";

function NationalityDropDown({ ...props }){ 
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

  const selectedNationalityObj = props.countries && optionGroup.find((nationality) => (
    nationality.value === props.defaultValue
  ));
  
  return (
    <React.Fragment>
      <div className="mb-3">
        <label htmlFor="choices-single-default" className="form-label font-size-14">{props.t("Nationality")}</label>
        {
          !selectedNationalityObj &&
          <Select 
            onChange={(e) => {
              props.nationalityChangeHandler(e);
            }}
            options={optionGroup}
            classNamePrefix="select2-selection"
            placeholder={props.t("Select a nationality")}
          />
        }
        {
          selectedNationalityObj &&
          <Select 
            onChange={(e) => {
              props.nationalityChangeHandler(e);
            }}
            defaultValue={selectedNationalityObj}
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

export default connect(mapStateToProps, null)(withTranslation()(NationalityDropDown));