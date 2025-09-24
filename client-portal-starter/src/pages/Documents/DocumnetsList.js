import React from "react";
import { connect } from "react-redux";
import { Spinner } from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
import CustomTable from "../../components/Common/CustomTable";
import * as content from "content";
import axios from "axios";

function DocumentList(props) {
  const imagesUrl = content.imagesUrl;

  const docs = props.documents?.map((obj) => {
    let arr = [obj.file1];
    if (obj.file2) {
      arr.push({ originalname: " " });
      arr.push(obj.file2);
    }
    obj.files = arr;

    return obj;
  });

  // const [deleteModal, setDeleteModal] = React.useState({
  //   show: false,
  //   documentId: null,
  //   clientId: null,
  // });

  function titleCase(str) {
    let tmpArr = str.toLowerCase().split("_");

    return tmpArr
      .map((obj) => {
        return obj[0].toUpperCase() + obj.slice(1);
      })
      .join(" ");
  }

  function getFileLink(obj, index, id) {
    if (!obj || !obj.url) return <></>;
    const getSecureLink = () => {
      axios.get(`${content.apiUrl}/api/v1/crm/documents/${id}/${index}`, {
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem("authUser"))?.token}`
        }
      }).then(res => {
        window.open(res.data.result, "_blank");
      }
      ).catch(err => {
        console.log(err);
      });
    };
    return <div><a onClick={() => getSecureLink(obj.url)} style={{
      color: "#405189",
      cursor: "pointer"
    }}  >{obj?.filename?.split("/")?.pop() || obj?.fileName?.split("/")?.pop() || index}</a></div>;
  }

  const getClientName = (id) => {
    const client = props.clientData?.corporateInfo?.shareholders?.find((obj) => obj._id === id);
    if (!id) {
      const auth = props.clientData?.corporateInfo?.authorizedPerson;
      return auth?.firstName + " " + auth?.lastName;
    }
    return client?.firstName + " " + client?.lastName;
  };

  const columns = [
    {
      dataField: "createdAt",
      text: props.t("Created Date"),
      formatter: (val) => new Date(val.createdAt).toLocaleDateString(),
    },
    {
      dataField: "type",
      text: props.t("Type"),
      formatter: (val) => `${titleCase(val.type)} ${val.subType ? `- ${titleCase(val.subType)} (${titleCase(getClientName(val.shareholderId))})` : ""}`,
    },
    {
      dataField: "files",
      text: props.t("Files"),
      formatter: (val) => val.files.map((obj, index) => getFileLink(obj, index + 1, val?._id)),
    },
    {
      dataField: "status",
      text: props.t("Status"),
      formatter: (val) => titleCase(val.status),
    },
    {
      dataField: "status",
      text: "",
      formatter: (val) => {
        return val.rejectionReason ? val.rejectionReason : "";
      },
    },
  ];
  if (props.loading) {
    return (
      <div className="d-flex align-items-center justify-content-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {props.documents?.length > 0 ? (
        <CustomTable columns={columns} rows={docs} />
      ) : (
        <div className="d-flex align-items-center justify-content-center" style={{ width: "100%" }}>
          {props.t("No document uploaded")}
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  loading: state.documents.loading,
  clearChangeStatus: state.documents.clearChangeStatus,
  clearDelete: state.documents.clearDelete,
  documents: state.documents.documents,
  clientData: state.Profile.clientData,
  error: state.documents.error,
});
export default connect(mapStateToProps, null)(withTranslation()(DocumentList));
