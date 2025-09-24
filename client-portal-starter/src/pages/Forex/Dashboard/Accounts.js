import classNames from "classnames";
import CardWrapper from "components/Common/CardWrapper";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  ButtonGroup,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Spinner,
} from "reactstrap";
import { getAccountsStart } from "store/actions";

function Accounts({
  onAccountSelect,
  buttons,
  type,
  setType,
  isFromDashboard = true,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { accounts, loading } = useSelector((state) => state.forex.accounts);
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [accountTab, setAccountTab] = useState("1");
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const toggleAccountTab = (tab) => {
    if (accountTab !== tab) {
      setAccountTab(tab);
    }
  };

  useEffect(() => {
    dispatch(
      getAccountsStart({
        type: type.toUpperCase(),
      })
    );
  }, [type]);

  useEffect(() => {
    if (accounts && accounts.length > 0){
      setSelectedAccount(accounts[0]);
      onAccountSelect && onAccountSelect(accounts[0]?._id);
    }
  }, [accounts]);
  return (
    <>
      <CardWrapper className="accounts-tab shadow glass-card"
      >
        <div className="buttons-row"
          style={{
            justifyContent: "space-between"
          }}
        >
          {isFromDashboard ? 
            (
              <ButtonGroup className="my-2 shadow">
                <Button
                  className={classNames("btn btn-light border-0 ", {
                    "shadow-lg text-white color-bg-btn": customActiveTab === "1",
                  })}
                  onClick={() => {
                    toggleCustom("1");
                    setType("live");
                  }}
                >
                  {t("Live Accounts")}
                </Button>
                <Button
                  className={classNames("btn btn-light border-0", {
                    "shadow-lg text-white color-bg-btn": customActiveTab === "2",
                  })}
                  onClick={() => {
                    toggleCustom("2");
                    setType("demo");
                  }}
                >
                  {t("Demo Accounts")}
                </Button>
              </ButtonGroup>
            ) :
            (
              <ButtonGroup className="my-2 shadow">
                <Button
                  className="btn border-0 shadow-lg text-white color-bg-btn"
                  // style={{
                  //   background:"#00C6C1",
                  // }}
                >
                  {t(`${type === "live" ? "Live" : "Demo"} Accounts`)}
                </Button>
              </ButtonGroup>
            )
          }
          <div className="d-flex justify-content-end">
            {buttons &&
              buttons.map((button, index) => {
                return (
                  <div
                    key={index}
                    className="mx-1"
                  >
                    <Button
                      className="btn-light my-2 shadow-lg bg-white border-0 color-bg-btn"
                      onClick={button.onClick}
                      disabled={button.disabled}
                    >
                      <i
                        className={button.iconName}
                        style={{
                          fontSize: "15px",
                        }}
                      ></i>
                      <span className="text-capitalize">{button.title}</span>
                    </Button>
                  </div>
                );
              })}
          </div>
        </div>
        {loading ? (
          <>
            <div className="d-flex align-items-center justify-content-center">
              <Spinner></Spinner>
            </div>
          </>
        ) : accounts && accounts.length > 0 ? (
          <>
            <Row className="d-flex justify-content-center pt-4">
              <Col lg={2} md={4} xs={12}>
                <Dropdown
                  isOpen={open}
                  toggle={() => {
                    setOpen(!open);
                  }}
                  direction="down"
                  className={classNames(
                    "acc-tab-card mb-3 border-0 shadow-lg p-3"
                  )}
                  onClick={() => {
                    toggleAccountTab("1");
                  }}
                >
                  <DropdownToggle
                    color="white"
                    caret
                    className="text-start w-100 p-0 mb-1 btn-no-hover-color-black"
                    style={{ minHeight: "fit-content" }}
                    onClick={() => {
                      toggleAccountTab("1");
                    }}
                  >
                    <div className="acc-tab-card-title color-primary">
                      {t("Account")}
                    </div>
                    <div className="acc-tab-card-desc">
                      {selectedAccount && (
                        <>
                          {selectedAccount?.login}
                          {isFromDashboard
                            ? `/${selectedAccount?.accountTypeId?.platform}`
                            : ""}
                        </>
                      )}
                    </div>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end w-100 acc-tab-card-desc">
                    {accounts.map((account) => {
                      return (
                        <DropdownItem
                          key={account._id}
                          onClick={() => {
                            setSelectedAccount(account);
                            if (!isFromDashboard) onAccountSelect(account._id);
                          }}
                        >
                          <div className="acc-tab-card-desc">
                            {account && (
                              <>
                                {account.login}
                                <div>{account?.accountTypeId?.title || "-"}</div>
                              </>
                            )}
                          </div>
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </Dropdown>
              </Col>
              <Col lg={2} md={4} xs={12}>
                <div
                  className={classNames(
                    "acc-tab-card mb-3 shadow-lg border border-0"
                  )}
                  onClick={() => {
                    toggleAccountTab("2");
                  }}
                > 
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                    className="text-start w-100 p-0 mb-1 btn-white "
                  >
                    <div className="acc-tab-card-title color-primary">
                      {t("Leverage")}
                    </div>
                    <div className="acc-tab-card-desc">
                      1:{(String(
                        selectedAccount?.MarginLeverage 
                        ? selectedAccount?.MarginLeverage
                        : selectedAccount?.leverage
                        ? selectedAccount?.leverage
                        : selectedAccount?.leverageInCents
                        ? selectedAccount?.leverageInCents
                        : "-"))}
                    </div>
                  </button>
                </div>
              </Col>
              <Col lg={2} md={4} xs={12}>
                <div
                  className={classNames(
                    "acc-tab-card mb-3 shadow-lg border border-0"
                  )}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                    className="text-start w-100 p-0 mb-1 btn-white"
                  >
                    <div className="acc-tab-card-title color-primary">
                      {t("Balance")}
                    </div>
                    <div className="acc-tab-card-desc color-green">
                      {(String(selectedAccount?.Balance
                               ? selectedAccount?.Balance
                               : selectedAccount?.balance
                                ? selectedAccount?.balance
                                : "-"))}
                    </div>
                  </button>
                </div>
              </Col>
              <Col lg={2} md={4} xs={12}>
                <div
                  className={classNames(
                    "acc-tab-card mb-3 shadow-lg border border-0"
                  )}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                    className="text-start w-100 p-0 mb-1 btn-white"
                  >
                    <div className="acc-tab-card-title color-primary">
                      {t("Equity")}
                    </div>
                    <div className="acc-tab-card-desc">
                      {(String(selectedAccount?.Equity
                        ? selectedAccount?.Equity
                        : selectedAccount?.equity
                          ? selectedAccount?.equity
                          : "-"  ) )}
                    </div>
                  </button>
                </div>
              </Col>
              <Col lg={2} md={4} xs={12}>
                <div
                  className={classNames(
                    "acc-tab-card mb-3 shadow-lg border border-0"
                  )}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                    className="text-start w-100 p-0 mb-1 btn-white"
                  >
                    <div className="acc-tab-card-title color-primary">
                      {t("Credit")}
                    </div>
                    <div className="acc-tab-card-desc color-yellow">
                      {(String(selectedAccount?.Credit
                               ? selectedAccount?.Credit
                               : selectedAccount?.credit
                                ? selectedAccount?.credit
                                : selectedAccount?.bonus
                                  ? selectedAccount?.bonus
                                  : "-"))}
                    </div>
                  </button>
                </div>
              </Col>
              {isFromDashboard && (
                <Col lg={2} md={4} xs={12}>
                  <div
                    className={classNames(
                      "acc-tab-card mb-3 shadow-lg border border-0"
                    )}
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                      className="text-start w-100 p-0 mb-1 btn-white"
                    >
                      <div className="acc-tab-card-title color-primary">
                        {t("Free Margin")}
                      </div>
                      <div className="acc-tab-card-desc">
                      {(String(selectedAccount?.MarginFree
                                 ? selectedAccount?.MarginFree
                                 : selectedAccount?.FreeMargin
                                  ? selectedAccount?.FreeMargin
                                  : selectedAccount?.freeMargin
                                    ? selectedAccount?.freeMargin
                                    : "-"))}
                      </div>
                    </button>
                  </div>
                </Col>
              )}
            </Row>
            {!isFromDashboard && (
              <Row className="justify-content-center gx-4">
                <Col lg={2} md={4} xs={12}>
                  <div
                    className={classNames(
                      "acc-tab-card mb-3 shadow-lg border border-0"
                    )}
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                      className="text-start w-100 p-0 mb-1 btn-white"
                    >
                      <div className="acc-tab-card-title color-primary">
                        {t("Platform")}
                      </div>
                      <div className="acc-tab-card-desc color-text">
                        {t(selectedAccount?.platform || "-")}
                      </div>
                    </button>
                  </div>
                </Col>
                <Col lg={2} md={4} xs={12}>
                  <div
                    className={classNames(
                      "acc-tab-card mb-3 shadow-lg border border-0"
                    )}
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                      className="text-start w-100 p-0 mb-1 btn-white"
                    >
                      <div className="acc-tab-card-title color-primary">
                        {t("Currency")}
                      </div>
                      <div className="acc-tab-card-desc color-text">
                        {t(selectedAccount?.currency || "-")}
                      </div>
                    </button>
                  </div>
                </Col>
                <Col lg={2} md={4} xs={12}>
                  <div
                    className={classNames(
                      "acc-tab-card mb-3 shadow-lg border border-0"
                    )}
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                      className="text-start w-100 p-0 mb-1 btn-white"
                    >
                      <div className="acc-tab-card-title color-primary">
                        {t("Margin Level")}
                      </div>
                      <div className="acc-tab-card-desc color-text">
                        {t(selectedAccount?.MarginLevel || "-")}
                      </div>
                    </button>
                  </div>
                </Col>
                <Col lg={2} md={4} xs={12}>
                  <div
                    className={classNames(
                      "acc-tab-card mb-3 shadow-lg border border-0"
                    )}
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                      className="text-start w-100 p-0 mb-1 btn-white"
                    >
                      <div className="acc-tab-card-title color-primary">
                        {t("Margin")}
                      </div>
                      <div className="acc-tab-card-desc">
                        {t(selectedAccount?.Margin
                           ? selectedAccount?.Margin
                           : selectedAccount?.margin
                            ? selectedAccount?.margin
                            : selectedAccount?.usedMargin
                              ? selectedAccount?.usedMargin
                              :  "-")}
                      </div>
                    </button>
                  </div>
                </Col>
                <Col lg={2} md={4} xs={12}>
                  <div
                    className={classNames(
                      "acc-tab-card mb-3 shadow-lg border border-0"
                    )}
                    onClick={() => {
                      toggleAccountTab("6");
                    }}
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                      className="text-start w-100 p-0 mb-1 btn-white"
                    >
                      <div className="acc-tab-card-title color-primary">
                        {t("Free Margin")}
                      </div>
                      <div className="acc-tab-card-desc">
                      {t(String(selectedAccount?.MarginFree
                                 ? selectedAccount?.MarginFree
                                 : selectedAccount?.FreeMargin
                                  ? selectedAccount?.FreeMargin
                                  : selectedAccount?.freeMargin
                                    ? selectedAccount?.freeMargin
                                    : "-"))}
                      </div>
                    </button>
                  </div>
                </Col>
              </Row>
            )}
          </>
        ) : (
          <div className="py-3">
            <p className="text-center color-text">{t(`No ${type} accounts available`)}</p>
          </div>
        )}
      </CardWrapper>
    </>
  );
}

export default Accounts;
