import React, { useCallback } from "react";
import "./SearchBar.styles.scss";
import { debounce } from "lodash";
import { withTranslation } from "react-i18next";
function SearchBar({ handleSearchInput, placeholder = "Search", ...props }){

  const debouncedChangeHandler = useCallback(
    debounce(handleSearchInput, 1000), []
  );

  return (
    <div className="app-search d-none d-lg-block">
      <div className="position-relative">
        <input type="text" className="form-control"
          onChange={debouncedChangeHandler} 
          placeholder={props.t(placeholder)} />
        <button className="btn btn-primary" type="button"><i
          className="bx bx-search-alt align-middle"></i></button>
      </div>
    </div>
  );
}
export default withTranslation()(SearchBar);