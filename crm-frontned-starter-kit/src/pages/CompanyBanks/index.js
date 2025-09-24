import React, { useEffect, useState } from "react";
import { useDispatch, connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { MetaTags } from "react-meta-tags";
import {
  Row, Col, Card, CardBody, CardTitle, CardHeader
} from "reactstrap";
import { Link } from "react-router-dom";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

// i18n
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import DeleteModal from "components/Common/DeleteModal";
import useModal from "hooks/useModal";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import { fetchBankAccount, deleteBankAccount } from "store/companyBankAccount/actions";
import ClientAddBankAccountModal from "./AddBankAccountModal";
import BankAccountEditModal from "./EditBankAccountModal";

function ClientBank(props) {
  const dispatch = useDispatch();
  const [sizePerPage, setSizePerPage] = useState(5);
  const [addModal, toggleAddModal] = useModal();
  const [deleteModal, toggleDeleteModal] = useModal();
  const [editModal, toggleEditModal] = useModal();
  const [isBankAccountModified, setIsBankAccountModified] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState();
  const loadBankDetails = (page, limit) => {
    dispatch(fetchBankAccount({ 
      page,
      limit
    }));
  };
  useEffect(() => {
    loadBankDetails(1, sizePerPage);
  }, [sizePerPage, props.deleteClearingCounter, isBankAccountModified, props.addClearingCounter, props.editResult]);
  
  
  const bankAccountUpdateHanlder = () => {
    setIsBankAccountModified(!isBankAccountModified);
    toggleEditModal();
  };
  const deleteBankAccountFunction = () => {
    dispatch(deleteBankAccount(selectedBankAccount._id));
    toggleDeleteModal();
  };

  const columns = [
    {
      dataField: "bankName",
      text: props.t("Bank Name"),
      formatter: (item) => (
        captilazeFirstLetter(item.bankName)
      )
    },
    {
      dataField: "accountHolderName",
      text: props.t("Owner"),
      formatter: (item) => (
        captilazeFirstLetter(item.accountHolderName)
      )
    },
    {
      dataField: "swiftCode",
      text: props.t("Swift Code")
    },
    {
      dataField: "iban",
      text: props.t("IBAN")
    }, 
    {
      dataField: "accountNumber",
      text: props.t("Account Number")
    },
    {
      dataField: "currency",
      text: props.t("Currency"),
      formatter: (item) => (
        captilazeFirstLetter(item.currency)
      )
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Actions"),
      formatter: (item) => (
        <div className="d-flex gap-3">
          <Link className="text-success" to="#">
            <i
              className="mdi mdi-pencil font-size-18"
              id="edittooltip"
              onClick={() => {setSelectedBankAccount(item); toggleEditModal()}}
            ></i>
          </Link>
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => {setSelectedBankAccount(item); toggleDeleteModal()}}
            ></i>
          </Link>
        </div>
      )
    },
  ];

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          {props.t("Bank Accounts")}
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>{props.t("Bank Accounts")}</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle className="color-primary">{props.t("Bank accounts list")} ({props.totalDocs})</CardTitle>
                  <ClientAddBankAccountModal show={addModal} toggle={toggleAddModal} /> 
                </CardHeader>
                <CardBody>
                  <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                    >
                      <Table
                        id="tech-companies-1"
                        className="table  table-hover "
                      >
                        <Thead className="text-center table-light" >
                          <Tr>
                            {columns.map((column, index) =>
                              <Th data-priority={index} key={index}>
                                <span className="color-primary">{column.text}</span>
                              </Th>
                            )}
                          </Tr>
                        </Thead>
                        { props.totalDocs === 0 
                          ? 
                          <Tbody>
                            {props.loading && <TableLoader colSpan={4} />}                            
                            {!props.loading &&
                              <>
                                <Tr>
                                  <Td colSpan={"100%"} className="fw-bolder text-center" st>
                                    <h3 className="fw-bolder text-center">No records</h3>
                                  </Td>
                                </Tr>
                              </>
                            }
                          </Tbody>
                          :
                          <Tbody className="text-center"> 
                            {props.loading && <TableLoader colSpan={4} />}
                            {!props.loading && props.docs.map((row, rowIndex) =>
                              <Tr key={rowIndex}>
                                {columns.map((column, index) =>
                                  <Td key={`${rowIndex}-${index}`}>
                                    { column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                                  </Td>
                                )}
                              </Tr>
                            )}
                          </Tbody>
                        }
                      </Table>
                      <CustomPagination
                        {...props}
                        setSizePerPage={setSizePerPage}
                        sizePerPage={sizePerPage}
                        onChange={loadBankDetails}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {<DeleteModal 
            loading={props.deleteLoading} 
            onDeleteClick={deleteBankAccountFunction} 
            show={deleteModal}
            onCloseClick={toggleDeleteModal} 
          />}
          {<BankAccountEditModal 
            open={editModal}  
            selectedBankAccount={selectedBankAccount} 
            onClose={toggleEditModal}
            bankAccountUpdateHandler={bankAccountUpdateHanlder} 
          />}
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  loading: state.banks.loading || false,
  docs: state.banks.docs || [],
  page: state.banks.page || 1,
  totalDocs: state.banks.totalDocs || 0,
  totalPages: state.banks.totalPages || 0,
  hasNextPage: state.banks.hasNextPage,
  hasPrevPage: state.banks.hasPrevPage,
  limit: state.banks.limit,
  nextPage: state.banks.nextPage,
  pagingCounter: state.banks.pagingCounter,
  prevPage: state.banks.prevPage,
  clearingCounter: state.banks.clearingCounter,
  deleteLoading: state.banks.deleteLoading,
  deleteClearingCounter: state.banks.deleteClearingCounter,
  addClearingCounter: state.banks.addClearingCounter,
  editResult: state.banks.editResult
});

export default connect(mapStateToProps, null)(withTranslation()(ClientBank));
