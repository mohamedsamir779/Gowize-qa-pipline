import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container, Col, Row, Button, Spinner,
} from "reactstrap";
import MetaTags from "react-meta-tags";
import { useTranslation, withTranslation } from "react-i18next";
import {
  AvForm, AvField, AvCheckboxGroup, AvCheckbox
} from "availity-reactstrap-validation";

import CardWrapper from "components/Common/CardWrapper";
import PageHeader from "components/Forex/Common/PageHeader";
import AvFieldSelecvt from "../../../components/Common/AvFieldSelect";
import {
  addWithdrawal, fetchWithdrawalsGatewaysStart, getAccountsStart, showErrorNotification, showSuccessNotification, toggleCurrentModal
} from "store/actions";
import IbNotApproved from "components/Common/IbNotApproved";
import {
  companyName,
} from "content";
import { addWithdraw } from "apis/withdraw";
import { getIbWallet } from "apis/forex/ib";

const Withdraw = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [wallet, setWallet] = useState({
    amount: 0,
    frozenAmount: 0,
  });
  const { gateways } = useSelector((state) => state.forex.ib.transactions.withdraws);
  const { accounts } = useSelector((state) => state.forex.accounts);
  const bankAccounts = useSelector((state) => state.crypto?.bankAccounts?.bankAccounts?.docs);
  const { subPortal } = useSelector((state) => (state.Layout));
  const partnershipAgreement = useSelector((state) => (state.Profile.clientData.stages?.ib?.partnershipAgreement));

  const isIbPortal = (subPortal === "IB");
  const [fields, setFields] = useState({
    amount: 0,
    note: "",
  });

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
  }, []);

  useEffect(() => {
    dispatch(fetchWithdrawalsGatewaysStart());
    dispatch(getAccountsStart({ type: "IB" }));
  }, []);

  const handleSubmit = (v) => {
    setLoading(true);
    addWithdraw({
      gateway: v.gateway,
      walletId: wallet._id,
      amount: v.amount,
      note: v.note,
    }).then((res) => {
      if (res.isSuccess) {
        dispatch(showSuccessNotification("Withdrawal request has been submitted successfully"));
      } else {
        throw new Error(res.message);
      }
    }).catch((err) => {
      console.log(err);
      dispatch(showErrorNotification(err.message));
    }).finally(() => {
      setLoading(false);
      setFields({
        amount: 0,
        note: "",
      });
    });
  };

  return (
    <>
      <MetaTags>
        <title>{props.t("Withdrawals")}</title>
      </MetaTags>
      <Container>
        {isIbPortal && !partnershipAgreement && <IbNotApproved />}
        <div className="page-content mt-5">
          <PageHeader title="Withdrawals"></PageHeader>
          <Row className="mt-4">
            <Col md={6}>
              <CardWrapper className="p-4 glass-card shadow">
                <div className="d-flex justify-content-between">
                  <h3 className="color-primary">{props.t("IB Wallet Withdrawal")}</h3>
                  <i className="bx bx-dots-vertical-rounded fs-3 mt-1"></i>
                </div>
                <AvForm className="mt-4" onValidSubmit={(e, v) => handleSubmit(v)} >
                  {
                    (loading || walletLoading) ? <Spinner /> : 
                      <>
                        <Row>
                          <Col lg={6}>
                            <div className="mb-3">
                              <h4>
                                {t("Available Balance")}
                                :
                                {" "}
                                <span className="color-primary">
                                  {walletLoading ? "Loading..." : wallet.amount}
                                </span>
                              </h4>
                            </div>
                          </Col>
                        </Row>
                        <div className="mb-3">
                          <AvFieldSelecvt
                            name="gateway"
                            label={t("Transaction Gateway")}
                            className="form-control"
                            placeholder={t("Select Transaction Gateway")}
                            type="select"
                            options={gateways && Object.keys(gateways).map((key) => ({
                              label: key,
                              value: key
                            }
                            ))}
                            value={fields.gateway}
                            onChange={(e) => {
                              setFields({
                                ...fields,
                                gateway: e
                              });
                            }}
                            required
                          />
                        </div>

                        {/* <div className="mb-3">
                          <AvFieldSelecvt
                            name="tradingAccountId"
                            label={t("From Account")}
                            className="form-control"
                            placeholder={t("Select From Account")}
                            type="select"
                            options={accounts?.map((account) => ({
                              label: account.login,
                              value: account._id
                            }))}
                            value={fields.tradingAccountId}
                            onChange={(e) => {
                              setFields({
                                ...fields,
                                tradingAccountId: e
                              });
                            }}
                            required
                          />
                        </div> */}
                        <Row className="mb-3">
                          <Col lg={bankAccounts?.length < 0 ? 9 : 12}>
                            <AvFieldSelecvt
                              name="bankAccount"
                              label={t("Bank Account")}
                              className="form-control"
                              placeholder={t("Select Bank Account")}
                              type="select"
                              options={bankAccounts?.map((bank) => ({
                                label: bank.bankName,
                                value: bank._id
                              }))}
                              value={fields.bankAccount}
                              onChange={(e) => {
                                setFields({
                                  ...fields,
                                  bankAccount: e
                                });
                              }}
                              required
                            />
                          </Col>
                          {bankAccounts?.length < 1 &&
                          <Col lg={3} className="flex justify-content-center align-items-center">
                            <button type="button" className="btn color-bg-btn color-white mt-4" onClick={() => {
                              dispatch(toggleCurrentModal("AddBankAccountModal"));
                            }
                            }>{t("Add Bank")}</button>
                          </Col>
                          }
                        </Row>
                        <div className="mb-3">
                          <AvField
                            name="amount"
                            label={props.t("Amount (In currency of the selected account)")}
                            placeholder={props.t("Enter Amount")}
                            type="number"
                            min="0"
                            errorMessage={props.t("Enter Amount")}
                            value={fields.amount}
                            onChange={(e) => {
                              setFields({
                                ...fields,
                                amount: e.target.value
                              });
                            }}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <AvField
                            name="note"
                            label={props.t("Note")}
                            placeholder={props.t("Enter Note")}
                            type="text"
                            errorMessage={props.t("Enter Note")}
                            value={fields.note}
                            onChange={(e) => {
                              setFields({
                                ...fields,
                                note: e.target.value
                              });
                            }}
                          />
                        </div>
                        <AvCheckboxGroup
                          name="termsAndConditions"
                          required
                          style={{ background: "transparent" }}
                        >
                          <AvCheckbox
                            label={props.t("I confirm, the bank account I added is correct.")}

                          />
                        </AvCheckboxGroup>
                        <div className="text-center mt-4">
                          <Button type="submit" className="color-bg-btn border-0 w-lg">{props.t("Submit")}</Button>
                        </div>
                      </>
                  }
                </AvForm>
              </CardWrapper>
            </Col>
            <Col md={6} className="mt-4 mt-md-0">
              <CardWrapper className="h-100 p-4 shadow glass-card">
                <h3 className="text-danger">{props.t("Important Notice")}</h3>
                <p className="mt-3">
                  {props.t(`${companyName}, in accordance with international laws on combating terrorist financing
                and money laundering, does not accept payments from third parties &
                payments to third parties are not carried out.`)}
                </p>
                <p className="mt-3">
                  {props.t(`${companyName} may require additional documentation /information from you to prove your
                bank account held in your name as third party payments are not permitted.`)}
                </p>
                <p className="mt-3">
                  {props.t(`All withdrawals will be returned to the original source of funding. any profits on
                your account must be retumed to you via bank transfer.`)}
                </p>
              </CardWrapper>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default withTranslation()(Withdraw);