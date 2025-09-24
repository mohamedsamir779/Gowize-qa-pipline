import CardWrapper from "components/Common/CardWrapper";
import PageHeader from "components/Forex/Common/PageHeader";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MetaTags } from "react-meta-tags";
import {
  Button,
  Col,
  Container, FormGroup, Input, Label, Row, Spinner
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import AvFieldSelecvt from "../../../../components/Common/AvFieldSelect";
import { useDispatch, useSelector } from "react-redux";
import {
  createIbWalletTransfer,
  getAccountsStart,
  getClientIbAccounts
} from "store/actions";
import { getIbClients, getAllClientsIbAccounts } from "store/forex/ib/clients/actions";
import { useHistory } from "react-router-dom";
import IbNotApproved from "components/Common/IbNotApproved";
import { CUSTOMER_SUB_PORTALS, PORTALS } from "common/constants";
import { getIbWallet } from "apis/forex/ib";

function InternalTransfer() {
  const { t } = useTranslation();
  const [transferDestination, setTransferDestination] = useState(1);
  const [ibAccounts, setIbAccounts] = useState([]); // client own accounts (from accounts) options
  const [ownAccountsOptions, setOwnAccountsOptions] = useState([]);  // client accounts (to accounts owned by the client) options 
  const [ibClients, setIbClients] = useState([]);
  const [toClientAccountOptions, setToClientAccountOptions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [allClientsAccounts, setAllClientsAccounts] = useState([]);
  const [fromAccountBalance, setFromAccountBalance] = useState();
  const { clients } = useSelector(state => state.forex.ib.clients);
  const { loading } = useSelector(state => state.forex.ib.transactions.ibInternalTransfer);
  const { subPortal, portal } = useSelector(state => state.Layout);
  const { accounts } = useSelector(state => state.forex.accounts);
  const { clientAccounts } = useSelector(state => state.forex.ib.clients);
  // ib accounts owned by the client (from account)
  const { ibClientAccounts } = useSelector(state => state.forex.ib.clients);
  // all accounts under the IB user
  const { allIbClientsAccounts, allIbClientsLoading } = useSelector(state => state.forex.ib.clients);
  const { transferLoading, clearingCounter } = useSelector(state => state.walletReducer);

  const partnershipAgreement = useSelector((state) => (state.Profile.clientData.stages?.ib?.partnershipAgreement));
  const [isIbPortal] = useState(subPortal === CUSTOMER_SUB_PORTALS.IB);

  const history = useHistory();
  const dispatch = useDispatch();

  if (subPortal !== CUSTOMER_SUB_PORTALS.IB || (portal && !portal.includes(PORTALS.FOREX)))
    history.push("/");

  const handleSubmit = (e, v) => {
    v.amount = parseInt(v.amount);
    // const fromAccount = ibClientAccounts.filter((account) => {
    //   return (
    //     account.login == v.tradingAccountFrom
    //   );
    // });
    // const fromAccountBalace = parseFloat(fromAccount[0]?.Equity);
    // if (fromAccountBalace > v.amount) {
    //   dispatch(ibInternalTransfer(v));
    // }
    dispatch(createIbWalletTransfer({
      ...v,
    }));
  };

  const fromAccountChangeHandler = (e) => {
    const fromAccount = ibClientAccounts.filter((account) => {
      return (
        account.login == e
      );
    });
    const result = parseFloat(fromAccount[0]?.Equity);
    setFromAccountBalance(result);
  };

  const amountValidation = (value, ctx, input, cb) => {
    if (parseFloat(value) > fromAccountBalance) cb("Not enought balance");
    else cb(true);
  };

  useEffect(() => {
    if (ibClientAccounts?.length > 0) {
      setIbAccounts(ibClientAccounts.map((account) => {
        return (
          {
            label: account.login + " - " + account.Equity,
            value: account.login
          }
        );
      }));
    }
  }, [ibClientAccounts]);

  useEffect(() => {
    // ib accounts owned by the client (from account)
    dispatch(getClientIbAccounts());

    // ib accounts owned by the client (to account) 
    dispatch(getAccountsStart({
      type: "LIVE"
    }));
    dispatch(getIbClients({
      type: "live"
    }));
  }, [clearingCounter]);

  useEffect(() => {
    if (accounts?.length > 0) {
      setOwnAccountsOptions(
        accounts.map((account) => {
          return (
            {
              label: account.login + " - " + account.Equity,
              value: account._id,
            }
          );
        })
      );
    }
  }, [accounts]);

  useEffect(() => {
    if (clients?.length > 0) {
      setIbClients(clients.map((client) => {
        return (
          client._id
        );
      }));
    }
  }, [clients]);

  const getIbClientsFunction = () => {
    if (ibClients?.length > 0) {
      dispatch(getAllClientsIbAccounts({
        type: "LIVE",
        customersId: Object.values(ibClients)
      }));
    }
    setAllClientsAccounts(clientAccounts);
  };

  useEffect(() => {
    if (allIbClientsAccounts?.length > 0) {
      let options = [];
      allIbClientsAccounts.map((account) => {
        account.docs.map((doc) => {
          options.push({
            label: doc.login + " - " + doc.Equity,
            value: doc._id,
          });
        });
      }
      );
      setToClientAccountOptions(options);
    }
  }, [allIbClientsAccounts]);

  const [wallet, setWallet] = useState({
    amount: 0,
    frozenAmount: 0,
  });
  const [walletLoading, setWalletLoading] = useState(false);

  useEffect(()=>{
    setWalletLoading(true);
    getIbWallet().then((res)=>{
      if (res.isSuccess) {
        setWallet({
          ...res.result,
        });
      } else {
        throw new Error(res.message);
      }
    }).catch((err)=>{
      console.log(err);
    }).finally(()=>{
      setWalletLoading(false);
    });
  }, [clearingCounter]);

  return (<>
    <MetaTags>
      <title>{t("Internal Transfer")}</title>
    </MetaTags>
    <div className="page-content">
      <Container className="pt-5">
        {isIbPortal && !partnershipAgreement && <IbNotApproved />}
        <PageHeader title="Internal Transfer"></PageHeader>
        <CardWrapper className="mt-4 shadow glass-card">
          <div className="d-flex justify-content-between heading pb-2">
            <h4 className="color-primary">{t("Internal Transfer")}</h4>
            <div className="d-flex">
              <FormGroup
                check
                className="my-auto me-3"
              >
                <Input
                  name="toMyAccount"
                  id="toMyAccount"
                  type="radio"
                  checked={transferDestination === 1}
                  onChange={() => { setTransferDestination(1) }}
                />
                <Label check for="toMyAccount">
                  {t("To My Account")}
                </Label>
              </FormGroup>
              <FormGroup check className="my-auto">
                <Input
                  name="toClientAccount"
                  type="radio"
                  id="toClientAccount"
                  checked={transferDestination === 2}
                  onChange={() => { setTransferDestination(2) }}
                  onClick={() => { getIbClientsFunction() }}
                />
                <Label check for="toClientAccount">
                  {t("To Client Account")}
                </Label>
              </FormGroup>
            </div>
          </div>
          <AvForm
            className="custom-form mt-4"
            onValidSubmit={handleSubmit}
          >
            <Row>
              <Col xs={12} className="mb-3">
                {
                  walletLoading ? <Spinner /> :
                    <>
                      <AvFieldSelecvt
                        name="fromId"
                        label={t("From Account")}
                        className="form-control"
                        type="select"
                        required
                        options={[
                          {
                            label: t("IB Wallet") + " - " + wallet.amount,
                            value: wallet?._id
                          }
                        ]}
                        onChange={fromAccountChangeHandler}
                        maxHeight={150}
                      />
                    </>
                }
              </Col>
              {
                transferLoading ? <Spinner /> :
                  <>
                    {transferDestination === 1 && <Col xs={6} className="mb-3">
                      <AvFieldSelecvt
                        name="toId"
                        label={t("To Account")}
                        type="select"
                        errorMessage={t("Enter To Account")}
                        validate={{ required: { value: true } }}
                        options={ownAccountsOptions}
                        disabled={ownAccountsOptions?.length === 0}
                        maxHeight={150}
                      />
                    </Col>}
                    {transferDestination === 2 && <Col xs={6} className="mb-3">
                      <AvFieldSelecvt
                        name="toId"
                        label={t("To Account")}
                        type="select"
                        errorMessage={t("Enter To Account")}
                        validate={{ required: { value: true } }}
                        options={toClientAccountOptions}
                        loading={allIbClientsLoading}
                        maxHeight={150}
                      />
                    </Col>}
                  </>
              }
              <Col xs={6} className="mb-3">
                <AvField
                  name="amount"
                  label={t("Amount")}
                  placeholder={t("Enter Amount")}
                  type="number"
                  min="0"
                  errorMessage={t("Enter Amount")}
                  validate={
                    {
                      required: { value: true },
                      custom: amountValidation
                    }
                  }
                />
              </Col>
              <Col xs={12} className="mb-3">
                <AvField
                  name="note"
                  label={t("Note")}
                  placeholder={t("Enter Note")}
                  type="text"
                  errorMessage={t("Enter Note")}
                />
              </Col>
            </Row>
            <div className="text-center pt-3">
              <Button type="submit" className="color-bg-btn border-0 w-lg" disabled={loading || transferLoading}>
                {(loading || transferLoading) ? <Spinner></Spinner> : t("Transfer")}
              </Button>
            </div>
          </AvForm>
        </CardWrapper>
      </Container>
    </div>
  </>);
}

export default InternalTransfer;