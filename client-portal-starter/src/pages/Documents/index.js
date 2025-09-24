import React, { useEffect } from "react";
import {
  connect, useDispatch, useSelector
} from "react-redux";
import { Container, Spinner } from "reactstrap";
import MetaTags from "react-meta-tags";

import CardWrapper from "../../components/Common/CardWrapper";
import { fetchDocsStart } from "../../store/general/documents/actions";
import DocumentsList from "./DocumnetsList";
import DocumentUpload from "./DocumentsUpload";
//i18n
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import documentJourneyValidation from "common/helpers";
import DocumentsCorpUpload from "./DocumentsCorpUpload";
import Sumsub from "./Sumsub";
// import Sumsub from "./Sumsub";

function Documents(props) {
  const clientData = useSelector(state => state.Profile.clientData);
  const { loading } = useSelector(state => state.documents);
  const { subPortal } = useSelector(state => state.Layout);
  const dispatch = useDispatch();
  const loadDocs = () => {
    dispatch(fetchDocsStart());
  };
  useEffect(() => {
    loadDocs(props.token);

  }, [props.uploading]);

  if (documentJourneyValidation(clientData, subPortal) !== true) {
    return (
      <div className="page-content">
        <MetaTags>
          <title>{props.t("Documents")}</title>
        </MetaTags>
        {loading ? <div className="d-flex align-items-center justify-content-center mt-5">
          <Spinner />
        </div> : <Container>
          <CardWrapper className="mt-5 glass-card shadow">
            <div className="d-flex align-items-center justify-content-center color-primary">
              <Link to="/dashboard">
                {props.t("Please complete journey stages before upload documents")}
              </Link>
            </div>
          </CardWrapper>
        </Container>}
      </div>);
  }
  
  const enableSumSub = true;

  if (enableSumSub) {
    return <>
      <div className="page-content">
        <MetaTags>
          <title>{props.t("Documents")}</title>
        </MetaTags>
        <Container>
          <div className="profile mt-5 h-full">
            <Sumsub />
          </div>
        </Container>
      </div>
    </>;
  }

  return (<>
    <div className="page-content">
      <MetaTags>
        <title>{props.t("Documents")}</title>
      </MetaTags>
      <Container>
        <div className="profile mt-5">
          <>
            <h1 className="mb-4 color-primary">
              {props.t("My Documents")}
            </h1>
            <CardWrapper className='mb-5 my-document glass-card shadow'>
              <DocumentsList />
            </CardWrapper>
            <h1 className="mb-4 color-primary">
              {props.t("Upload New Document")}
            </h1>
            <div className="upload-document mb-5">
              {clientData.isCorporate ? <DocumentsCorpUpload /> : <DocumentUpload />}
            </div>
          </>
        </div>
      </Container>
    </div>
  </>);
}

const mapStateToProps = (state) => ({
  documents: state.documents.documents,
  uploading: state.documents.uploading
});

export default connect(mapStateToProps, null)(withTranslation()(Documents)); 