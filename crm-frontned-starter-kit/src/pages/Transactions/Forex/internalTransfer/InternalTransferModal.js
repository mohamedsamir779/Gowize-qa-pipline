import React, { 
  useState, useEffect 
} from "react";
import {
  useDispatch, useSelector 
} from "react-redux";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Alert,
  Button
} from "reactstrap";
import { Link } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation";
import "../SearchableInputStyles.scss";
import { withTranslation } from "react-i18next";
import { addInternalTransfer } from "store/forexTransactions/internalTransfers/actions";
import {
  fetchTradingAccountByCustomerId
} from "store/tradingAccounts/actions";
import AvFieldSelect from "components/Common/AvFieldSelect";
import SearchableComponent from "./SearchableComponents";
import { getClients, getReferrals } from "apis/client";
import { fetchClientWallets } from "store/wallet/actions";
import TableLoader from "components/Common/Loader";
import usePermissions from "routes/permissions";
import { fetchConversionRates } from "store/actions";
import { getTradingAccountByCustomerId } from "apis/tradingAccounts";
import AsyncAvFieldSelect from "components/Common/AsyncAvFieldSelect";
import { getClientWalletDetails } from "apis/wallet";

function AddInternalTransferModal(props){
  const dispatch = useDispatch();
  const [addModal, setAddModal] = useState(false);
  const [from, setFrom] = useState("");
  const [fromCustomer, setFromCustomer] = useState(undefined);
  const [fromDetails, setFromDetails] = useState(undefined);
  const [to, setTo] = useState(undefined);
  const [amount, setAmount] = useState(0);
  const [ibTransactionType, setIbTransactionType] = useState(null);
  const [ibClient, setIbClient] = useState(null);
  const [toIbOptions, setToIbOptions] = useState([]);
  const [isAmountValid, setIsAmountValid] = useState(false);

  const {
    wallets,
    walletsLoading,
  } = useSelector((state) => ({
    wallets: state.walletReducer?.wallet?.docs || [],
    walletsLoading: state.walletReducer?.loading || false,
  }));

  const {
    accounts,
    accountsLoading,
  } = useSelector((state) => ({
    accounts : state.tradingAccountReducer.customerTradingAccounts || [],
    accountsLoading: state.tradingAccountReducer.loading || false,
  }));

  const {
    conversionRates,
    loadingConversionRates,
  } = useSelector((state) => ({
    conversionRates: state.conversionRatesReducer.conversionRates || [],
    loadingConversionRates: state.conversionRatesReducer.loading || false,
  }));

  const { addInternalTransferClearingCounter } = useSelector(
    (state) => state.internalTransferReducer
  );

  const {
    withdrawalsPermissions,
  } = usePermissions();
  const { create } = withdrawalsPermissions;

  useEffect(() => {
    props.show && setAddModal(!addModal);
  }, [props.show]);

  const cleanUp = () => {
    setTo("");
    setFrom("");
    setFromDetails(undefined);
    setFromCustomer(undefined);
    setIbTransactionType(null);
    setAmount(0);
  };

  const toggleAddModal = () => {
    cleanUp();
    setAddModal(!addModal);
  };

  useEffect(() => {
    if (!props.disableAddButton && open ){
      setAddModal(false);
    }
  }, [props.modalClear]);

  useEffect(() => {
    if (amount > 0 && fromDetails) {
      if (fromDetails?.amount) {
        console.log("wallet");
        setIsAmountValid(amount <= fromDetails?.amount);
      }
      if (fromDetails?.Balance || fromDetails?.balance) {
        console.log("account");
        let fromAmount = fromDetails?.Balance 
          ? fromDetails?.Balance
          : fromDetails?.balance;
        setIsAmountValid(amount <= parseInt(fromAmount ));
      }
      
    } else {
      setIsAmountValid(false);
    }
  }, [amount, fromDetails]);

  const handleAddForexInternalTransfer = (e, v) => {
    const payload = {
      fromId: fromDetails._id,
      toId: to._id,
      amount,
      source: v?.from === "fx" ? "FX" : "WALLET",
      destination: to?.accountTypeId ? "FX" : "WALLET",
      transactionType : !v?.ibClient ? "SELF_TRANSFER" : "IB_TRANSFER",
    };
    dispatch(addInternalTransfer({
      ...payload,
    }));
  };

  const loadWalletsByCustomerId = (customerId) => {
    dispatch(fetchClientWallets({
      belongsTo: customerId,
      page: 1,
      limit: 100,
      isCrypto: false,
    }));
  };

  const loadTradingAccountsByCustomerId = (customerId)=>{
    dispatch(fetchTradingAccountByCustomerId({ customerId }));   
  };

  useEffect(() => {
    if (fromCustomer) {
      loadWalletsByCustomerId(fromCustomer._id);
      loadTradingAccountsByCustomerId(fromCustomer._id);
    }
  }, [fromCustomer]);

  useEffect(() => {
    if (fromDetails && to && fromDetails.currency !== to.currency) {
      dispatch(fetchConversionRates({
        baseCurrency: fromDetails.currency,
        targetCurrency: to.currency,
      }));
    }
  }, [fromDetails, to]);

  useEffect(() => {
    if (fromDetails && ibTransactionType === "client" && ibClient) {
      (async () => {
        const walletResp = await getClientWalletDetails({
          payload: {
            belongsTo: ibClient._id,
            customerId: ibClient._id,
            page: 1,
            limit: 100,
            isCrypto: false,
          }
        });
        const accResp = await getTradingAccountByCustomerId({
          payload: {
            customerId: ibClient._id,
          }
        });
        const wallets = walletResp?.result?.docs || [];
        const accounts = accResp?.result?.docs || [];
        const options = [];
        wallets.filter(w => w._id !== fromDetails._id).map((wallet,) => {
          options.push({
            label: `${wallet.asset} | BAL: ${wallet.amount}`,
            value: {
              ...wallet,
              currency: wallet.asset,
            },
          });
        }
        );
        accounts.map((account) => {
          options.push({
            label: `${account?.platform} - ${account?.accountTypeId?.title} | ${account?.login} | BAL: ${account?.Balance ?? account?.balance} ${account?.currency}`,
            value: account,
          });
        }
        );
        setToIbOptions(options);
      })();
    } else {
      setToIbOptions([]);
    }
  }, [fromDetails, ibTransactionType, ibClient]);

  useEffect(() => {
    return () => {
      cleanUp();
    };
  }, []);

  useEffect(() => {
    addModal && toggleAddModal();
  }, [addInternalTransferClearingCounter]);


  const getClientToOptions = () => {
    const options = [];
    if (fromDetails) {
      wallets.filter(w => w._id !== fromDetails._id).map((wallet,) => {
        options.push({
          label: `${wallet.asset} | BAL: ${wallet.amount}`,
          value: {
            ...wallet,
            currency: wallet.asset,
          },
        });
      });
    }
    if (fromCustomer) {
      accounts
        .filter((account) => account?._id !== fromDetails?._id).map((account) => {
          options.push({
            label: `${account?.platform} - ${account?.accountTypeId?.title} | ${account?.login} | BAL: ${account?.Balance ?? account?.balance} ${account?.currency}`,
            value: account,
          });
        });
    }
    return options;
  };

  const isConversionRateRequired = fromDetails?.currency !== to?.currency;
  const isConversionRateAvailable = conversionRates?.length > 0;
  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}>
        <i className="bx bx-plus me-1" /> 
        {props.t("Add New Internal Transfer")}
      </Link>
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Internal Transfer")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={handleAddForexInternalTransfer}
          >
            <Row className="mb-3">
              <Col md="12">
                <div>
                  <AvFieldSelect
                    label={props.t("From")}
                    name="from"
                    type="select"
                    required
                    onChange={(e) => setFrom(e)}
                    isSearchable = {true}
                    options={[
                      {
                        label: props.t("Live Account"),
                        value: "fx",
                      },
                      {
                        label: props.t("Live Wallet"),
                        value: "wallet",
                      },
                    ]}
                    classNamePrefix="select2-selection"
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <SearchableComponent
                  placeholder={("Select Client")}
                  label={"Client"}
                  name={"client"}
                  onChange={(e) => {
                    e?.value ? setFromCustomer(e.value) : setFromCustomer(e);
                  }}
                  getData={
                    async (payload) => getClients({ payload })
                      .then((res) => {
                        if (props.customerId) {
                          const customer = res?.result?.docs?.find((client) => client._id === props.customerId?._id);
                          setFromCustomer({
                            value: customer,
                            label: `${customer?.fx?.isIb ? "IB" : "Client"} | ${customer.firstName} ${customer.lastName}`,
                          });
                          return customer ? [customer] : [];
                        } else {
                          return res?.result?.docs || [];
                        }
                      })
                  }
                  raw
                  value={props?.customerId ? fromCustomer : null}
                  mapper={(client) => ({
                    value: client,
                    label: `${client?.fx?.isIb ? "IB" : "Client"} | ${client.firstName} ${client.lastName}`,
                  })}
                />
              </Col>
            </Row>
            {
              from === "wallet" ?
                <>
                  <Row>
                    {
                      walletsLoading ? <>
                        <TableLoader />
                      </> : <>
                        <Col md="12">
                          <div>
                            <AvFieldSelect
                              label={props.t("Wallet")}
                              name="fromWallet"
                              type="select"
                              required
                              isSearchable = {true}
                              options={(wallets || []).map((wallet) => {
                                return {
                                  label: `${wallet?.asset} | BAL: ${wallet?.amount}`,
                                  value: {
                                    ...wallet,
                                    currency: wallet.asset,
                                  },
                                };
                              })}
                              onChange={(e) => setFromDetails(e)}
                              classNamePrefix="select2-selection"
                              validate={{ required: { value: true } }}
                            />
                          </div>
                        </Col>
                      </>
                    }
                  </Row>
                </>
                :
                <>
                  <Row>
                    {
                      accountsLoading ? <>
                        <TableLoader />
                      </> : <>
                        <Col md="12">
                          <div>
                            <AvFieldSelect
                              label={props.t("Trading Account From")}
                              name="fromAccount"
                              type="select"
                              required
                              isSearchable = {true}
                              options={(accounts || [])
                                .map((account) => {
                                  return {
                                    label: `${account?.platform} - ${account?.accountTypeId?.title} | ${account?.login} | BAL: ${account?.Balance ?? account?.balance } ${account?.currency}`,
                                    value: account,
                                  };
                                })}
                              onChange={(e) => setFromDetails({
                                ...e,
                              })}
                              classNamePrefix="select2-selection"
                              validate={{ required: { value: true } }}
                            />
                          </div>
                        </Col>
                      </>
                    }
                  </Row>
                </>
            }
            {
              fromCustomer?.fx?.isIb && 
                      <>
                        <Row>
                          <Col md="12">
                            <AvFieldSelect
                              label={props.t("Type")}
                              name="type"
                              type="select"
                              required
                              placeholder={props.t("Select the Transaction Type")}
                              onChange={(e) => setIbTransactionType(e)}
                              isSearchable = {true}
                              options={[
                                {
                                  label: props.t("Self"),
                                  value: "self",
                                },
                                {
                                  label: props.t("Client"),
                                  value: "client",
                                },
                              ]}
                              classNamePrefix="select2-selection"
                              validate={{ required: { value: true } }}
                            />
                          </Col>
                        </Row>
                      </>
            }
            {
              (!fromCustomer?.fx?.isIb || (fromCustomer?.fx?.isIb && ibTransactionType === "self")) && <Row>
                <Col md="12">
                  <div>
                    <AvFieldSelect
                      label={props.t("To")}
                      name="toId"
                      type="select"
                      required
                      onChange={(e) => setTo(e)}
                      isSearchable = {true}
                      options={getClientToOptions()}
                      classNamePrefix="select2-selection"
                      validate={{ required: { value: true } }}
                    />
                  </div>
                </Col>
              </Row>
            }
            {
              (fromCustomer?.fx?.isIb && ibTransactionType === "client") && <Row>
                <Col md="12">
                  <SearchableComponent
                    placeholder={("Select Ib Client")}
                    label={"IB Client"}
                    name={"ibClient"}
                    onChange={(e) => {
                      e?.value ? setIbClient(e.value) : setIbClient(e);
                    }}
                    getData={
                      async () => getReferrals({ 
                        payload: {
                          clientId: fromCustomer?._id,
                          type: "live",
                        }
                      }).then((res) => (res?.result?.[0]?.childs))
                    }
                    mapper={(client)=> (
                      {
                        label: `${client?.fx?.isIb ? "IB" : "Client"} | ${client.firstName} ${client.lastName}`,
                        value: client
                      }
                    )}
                    value={ibClient}
                  />
                </Col>
                {
                  ibClient && <Col md="12">
                    <div>
                      <AsyncAvFieldSelect
                        label={props.t("To")}
                        name="toId"
                        type="select"
                        required
                        onChange={(e) => e?.value ? setTo(e.value) : setTo(e)}
                        isSearchable = {true}
                        defaultOptions={toIbOptions}
                        classNamePrefix="select2-selection"
                        validate={{ required: { value: true } }}
                        defaultValue=""
                        value={to}
                      />
                    </div>
                  </Col>
                }
              </Row>
            }
            <Row className="mb-3">
              <Col md="12">
                <AvField
                  name="amount"
                  label={props.t("Amount")}
                  placeholder={props.t("Enter Amount")}
                  type="number"
                  min="1"
                  onChange={(e) => setAmount(e.target.value)}
                  errorMessage={props.t("Enter Valid Amount")}
                  validate = {{
                    required :{ value:true },
                  }}
                />
              </Col>
            </Row>
            <div className='text-center pt-3 p-2'>
              {
                isConversionRateRequired && isConversionRateAvailable
                && amount > 0 && <>
                  <Alert
                    color="warning"
                  >A conversion rate is applied : {" "}
                    {(amount * parseFloat(conversionRates?.find(c => c.baseCurrency === fromDetails.currency && c.targetCurrency === to?.currency)?.value))?.toFixed(2)}
                    {" "}{to?.currency}</Alert>
                </>
              }
              {
                amount > 0 && !isAmountValid && <>
                  {props.t("Amount is greater than balance")}
                </>
              }
            </div>
            {
              create &&
              <Row>
                <Button
                  disabled={!fromDetails || !to || (amount == 0  || !isAmountValid)}
                  color="primary"
                  className="btn-block w-md waves-effect waves-light" type="submit">  
                  {props.t("Create")}
                </Button>
              </Row>
            }
          </AvForm>
        </ModalBody> 
      </Modal>
    </React.Fragment>
  );
}

export default (withTranslation()(AddInternalTransferModal));