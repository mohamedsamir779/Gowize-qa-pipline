import React, { useEffect, useState } from "react";
import {
  useDispatch, useSelector
} from "react-redux";

import {
  Row, Col, Card, CardBody, CardTitle, CardHeader, Input, Label, Spinner,
} from "reactstrap";

import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import TableLoader from "components/Common/TableLoader";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import { MetaTags } from "react-meta-tags";
import formatDate from "helpers/formatDate";
import { fetchAccountTypes, updateAccountType } from "store/actions";
import AddAccountType from "./AddAccountType";
import { Link } from "react-router-dom";
import useModal from "hooks/useModal";
import EditAccountType from "./EditAccountType";


function AccountTypes(props) {
  const [accountType, setAccountType] = useState();
  const [editModal, toggleEditModal] = useModal();

  const columns = [
    {
      dataField: "createdAt",
      text: "Created Date",
      formatter: (val) => formatDate(val.createdAt)
    },
    {
      dataField: "title",
      text: "Title",
      formatter: (item) => (
        captilazeFirstLetter(item.title)
      )
    },
    {
      dataField: "type",
      text: "Type",
      formatter: (item) => (
        captilazeFirstLetter(item.type)
      )
    },
    {
      dataField: "platform",
      text: "Platform",
      formatter: (item) => (
        captilazeFirstLetter(item.platform)
      )
    },
    {
      dataField: "forCrm",
      text: "For CRM",
      formatter: (item) => (
        <div className="d-flex gap-3 justify-content-center">
          {(props.changeStatusLoading) ? <React.Fragment>
            <Spinner className="ms-2" color="primary" />
          </React.Fragment> : <React.Fragment>
            <Input
              checked={item.forCrm}
              type="checkbox"
              onChange={() => { updateVisibility("forCrm", item) }}
              id={`crm.${item._id}`}
              switch="none"
              disabled={updating}
            />
            <Label className="me-1" htmlFor={`crm.${item._id}`} data-on-label="" data-off-label=""></Label>
          </React.Fragment>}
        </div>
      ),
    },
    {
      dataField: "forCp",
      text: "For CP",
      formatter: (item) => (
        <div className="d-flex gap-3 justify-content-center">
          {(props.changeStatusLoading) ? <React.Fragment>
            <Spinner className="ms-2" color="primary" />
          </React.Fragment> : <React.Fragment>
            <Input
              checked={item.forCp}
              type="checkbox"
              onChange={() => { updateVisibility("forCp", item) }}
              id={`cp.${item._id}`}
              switch="none"
              disabled={updating}
            />
            <Label className="me-1" htmlFor={`cp.${item._id}`} data-on-label="" data-off-label=""></Label>
          </React.Fragment>}
        </div>
      ),
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: "Actions",
      formatter: (item) => (
        <Link className="text-success" to="#">
          <i
            className="mdi mdi-pencil font-size-18"
            id="edittooltip"
            onClick={() => { setAccountType(item); toggleEditModal() }}
          ></i>
        </Link>
      )
    },

  ];
  const dispatch = useDispatch();
  const { accountTypes, accountTypesLoading, updating } = useSelector((state) => state.tradingAccountReducer);

  useEffect(() => {
    loadAccountTypes();
  }, []);

  const loadAccountTypes = () => {
    dispatch(fetchAccountTypes());
  };

  const updateVisibility = (crmOrCp, item) => {
    dispatch(updateAccountType(item._id, !item[crmOrCp] ? { [crmOrCp]: true } : { [crmOrCp]: false }));
  };

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Account Types
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2>Account Types</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle className="color-primary">Account Types List ({accountTypes?.length ?? 0})</CardTitle>
                  <AddAccountType />
                </CardHeader>
                <CardBody>
                  <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                    >
                      <Table
                        id="tech-companies-1"
                        className="table table-hover "
                      >
                        <Thead className="text-center table-light" >
                          <Tr>
                            {columns.map((column, index) =>
                              <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                            )}
                          </Tr>
                        </Thead>
                        <Tbody className="text-center" style={{ fontSize: "13px" }}>
                          {accountTypesLoading && <TableLoader />}
                          {accountTypes?.map((row, rowIndex) =>
                            <Tr key={rowIndex}>
                              {columns.map((column, index) =>
                                <Td key={`${rowIndex}-${index}`}>
                                  {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                                </Td>
                              )}
                            </Tr>
                          )}
                        </Tbody>
                      </Table>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      {<EditAccountType
        show={editModal}
        selectedAccountType={accountType}
        toggle={toggleEditModal}
      // bankAccountUpdateHandler={bankAccountUpdateHanlder}
      />}

    </React.Fragment>
  );
}

export default AccountTypes;
