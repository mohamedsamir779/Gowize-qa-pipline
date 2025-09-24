import React from "react";

// i18n
import { withTranslation } from "react-i18next";
import MainNavigation  from "./MainNavigation";

function Layout({ clientId, isIb, isLead, children }){

  // const onClickHandler = () => {
  //   props.redirectToListingHandler();
  // };
  
  return (
    <React.Fragment>
      <MainNavigation clientId={clientId} isIb={isIb} isLead={isLead}/>
      <main>  
        {children}  
      </main>
    </React.Fragment>
  );
}

export default withTranslation()(Layout);