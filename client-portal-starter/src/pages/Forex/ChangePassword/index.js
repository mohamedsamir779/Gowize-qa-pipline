import {
  useState, useEffect, useRef
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AvForm, AvField, AvGroup, AvFeedback
} from "availity-reactstrap-validation";
import {
  Container, Col, Row,
  Label, Button,
} from "reactstrap";
import MetaTags from "react-meta-tags";
import { withTranslation } from "react-i18next";
import Icofont from "react-icofont";
import { getAccountsStart, updatePassword } from "../../../store/actions";

import CardWrapper from "components/Common/CardWrapper";
import PageHeader from "components/Forex/Common/PageHeader";

const Transfers = (props) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const { accounts, submitting } = useSelector((state) => state.forex.accounts);

  useEffect(() => {
    dispatch(getAccountsStart());
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const confirmPassword = (value, ctx, input, cb) => {
    if (value !== ctx.password) cb("Password doesn't match!");
    else cb(true);
  };

  const handleValidSubmit = (event, values) => {
    dispatch(updatePassword({
      _id: values.account,
      body: {
        password: values.password,
        type: values.type,
      }
    }));
    formRef.current.reset();
  };

  return (
    <>
      <MetaTags>
        <title>{props.t("Change Password")}</title>
      </MetaTags>
      <Container>
        <div className="page-content mt-5">
          <PageHeader title="Change Password"></PageHeader>
          <CardWrapper className="mt-4 p-4 glass-card">
            <Row className="mb-4">
              <Col className="d-flex justify-content-between">
                <h3 className="">{props.t("Change Password")}</h3>
              </Col>
            </Row>
            <Row>
              <AvForm
                ref={formRef}
                onValidSubmit={(e, v) => {
                  handleValidSubmit(e, v);
                }}
              >
                <Row>
                  <Col md="6">
                    <AvField type="select" name="account" value={accounts && accounts[0]?._id} label={props.t("Account No.*")} className="mt-1 mb-2 form-select" required>
                      {accounts?.map((account) =>
                        <option key={account.login} value={account._id}>{account.login} ({account.type})</option>
                      )};
                    </AvField>
                  </Col>
                  <Col md="6" className="mt-3 mt-md-0">
                    <AvField type="select" name="type" value={"main"} label={props.t("Type*")} className="mt-1 mb-2 form-select" required>
                      <option value={props.t("main")}>{props.t("Master")}</option>
                      <option value={props.t("investor")}>{props.t("Investor")}</option>
                    </AvField>
                  </Col>
                  <Col md="6" className="mt-3">
                    <AvGroup>
                      <Label for="password" className="mb-1 d-flex align-items-center">{props.t("New Password")}
                        <Icofont icon={showPassword ? "eye-blocked" : "eye"} className="show-password"
                          onClick={handleShowPassword}
                        ></Icofont>
                      </Label>
                      <AvField name="password" type={showPassword ? "text" : "password"} id="password"
                        validate={{
                          required: {
                            value: true,
                            errorMessage: "Password is required"
                          },
                          pattern: {
                            value: /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/,
                            errorMessage: "Password must contain at least one uppercase letter and one number"
                          },
                          minLength: {
                            value: 7,
                            errorMessage: "Password must be more than 6 characters"
                          },
                        }} />
                      
                    </AvGroup>
                  </Col>
                  <Col md="6" className="mt-3">
                    <AvGroup>
                      <Label for="confirm_password" className="mb-1">{props.t("Confirm Password")}</Label>
                      <AvField name="confirm_password" type="password" id="confirm_password"
                        validate={{
                          required: {
                            value: true,
                            errorMessage: "Password is required"
                          },
                          custom: confirmPassword
                        }}
                      />
                      <AvFeedback>{props.t("Password doesn't match")}</AvFeedback>
                    </AvGroup>
                  </Col>
                </Row>
                <div className="text-center mt-4">
                  <Button type="submit" disabled={submitting} className="color-bg-btn border-0 px-4">{props.t("Change Password")}</Button>
                </div>
              </AvForm>
            </Row>
          </CardWrapper>
        </div>
      </Container>
    </>
  );
};

export default withTranslation()(Transfers);