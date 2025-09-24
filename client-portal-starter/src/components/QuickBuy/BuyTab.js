import React, {
  useEffect, useState
} from "react";
import {
  InputGroup,
  Input,
  Label,
  Form as RSForm,
  Col,
  Row,
  InputGroupText,
  FormFeedback,
  FormText,
  FormGroup,
} from "reactstrap";
import {
  Formik, Field as FormikField, Form as FormikForm
} from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { makeOrder } from "../../store/crypto/orders/actions";
import CustomSelect from "components/Common/CustomSelect";
import { getAssetImgSrc } from "helpers/assetImgSrc";
import BigNumber from "bignumber.js";
import { showErrorNotification } from "store/general/notifications/actions";
import { useTranslation } from "react-i18next";

const Swapper = ({ toggle1 }) => {
  return <div className='icon-swap-container'>
    <div className="icon-swap">
      <button type="button" className='btn btn-light' onClick={(e) => {
        e.preventDefault();
        toggle1("sell");
      }}>
        <i className='mdi mdi-sync' style={{ fontSize: "1rem" }}></i>
      </button>
    </div>
  </div>;
};

function BuyTab({  toggle1, currentMarket, setCurrentMarket, submitButtonRef }) {
  const { wallets } = useSelector((state) => state.crypto.wallets);
  const { markets } = useSelector((state) => state.crypto.markets);
  const { error: orderError } = useSelector(state => state.crypto.orders);
  const [error, setError] = useState("");
  const [, setShowError] = useState(false);
  const [baseAsset, setBaseAsset] = useState(currentMarket.marketId?.baseAsset);
  const [quoteAsset, setQuoteAsset] = useState(currentMarket.marketId?.quoteAsset);
  const [, setBaseAmount] = useState(0);
  const [, setQuoteAmount] = useState(0);
  const [availableBaseAmount, setAvailableBaseAmount] = useState(0);
  const [availableQuoteAmount, setAvailableQuoteAmount] = useState(0);
  const [, setQuoteAmountWillBe] = useState(0);
  const [baseAmountWillBe, setBaseAmountWillBe] = useState(0);
  const [baseAssetOptions, setBaseAssetOptions] = useState([]);
  const [baseAssetDefaultValue, setBaseAssetDefaultValue] = useState();
  const [quoteAssetOptions, setQuoteAssetOptions] = useState([]);
  const [quoteAssetDefaultValue, setQuoteAssetDefaultValue] = useState();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    markets.map((market, index) => {
      setBaseAssetOptions(baseAssetOptions => {
        baseAssetOptions[index] = {
          value: market.marketId?.baseAsset,
          label: market.marketId?.baseAsset,
          image: getAssetImgSrc(market.marketId?.baseAssetId),
        };
        return baseAssetOptions;
      });

      setQuoteAssetOptions(quoteAssetOptions => {
        if (index === 0 || market.marketId?.quoteAsset !== markets[index - 1].marketId?.quoteAsset) {
          quoteAssetOptions[index] = {
            value: market.marketId?.quoteAsset,
            label: market.marketId?.quoteAsset,
            image: getAssetImgSrc(market.marketId?.quoteAssetId),
          };
        }
        return quoteAssetOptions;
      });
    });
  }, [markets, currentMarket]);

  useEffect(() => {
    const found = baseAssetOptions.find((option) => option.value === currentMarket.marketId?.baseAsset);
    if (found)
      setBaseAssetDefaultValue(found);
  }, [currentMarket]);

  useEffect(() => {
    const found = quoteAssetOptions.find((option) => option.value === currentMarket.marketId?.quoteAsset);
    if (found)
      setQuoteAssetDefaultValue(found);
  }, [currentMarket]);

  useEffect(() => {
    if (orderError.length > 0) {
      setError(orderError);
      setShowError(true);
    }
  }, [orderError]);

  useEffect(() => {
    const found = wallets.find((wallet) => wallet.asset === baseAsset);
    if (found) {
      setAvailableBaseAmount(found.amount);
      setBaseAmountWillBe(found.amount);
    }
  }, [baseAsset]);

  useEffect(() => {
    const found = wallets.find((wallet) => wallet.asset === quoteAsset);
    if (found) {
      setAvailableQuoteAmount(found.amount);
    }
  }, [quoteAsset]);

  useEffect(() => {
    setBaseAsset(currentMarket.marketId?.baseAsset);
    setQuoteAsset(currentMarket.marketId?.quoteAsset);
    const quoteAssetFound = wallets.find((wallet) => wallet.asset === quoteAsset);
    const baseAssetFound = wallets.find((wallet) => wallet.asset === baseAsset);
    if (quoteAssetFound) {
      setAvailableQuoteAmount(quoteAssetFound.amount);
      setQuoteAmountWillBe(quoteAssetFound.amount);
    }
    if (baseAssetFound) {
      setAvailableBaseAmount(baseAssetFound.amount);
      setBaseAmountWillBe(baseAssetFound.amount);
    }
    return () => {
      setBaseAsset("");
      setQuoteAsset("");
      setBaseAssetDefaultValue("");
      setQuoteAssetDefaultValue("");
    };
  }, []);

  useEffect(() => {
    const marketFound = markets.find(m => m.pairName === `${baseAsset}/${quoteAsset}`);
    if (marketFound)
      setCurrentMarket(marketFound);
  }, [baseAsset, quoteAsset]);

  useEffect(() => {
    if (error.length === 0) {
      setShowError(false);
    }
  }, [error]);


  return <Formik
    initialValues={{
      baseAmount:availableBaseAmount,
      quoteAmount:availableQuoteAmount
    }}
    validationSchema={Yup.object().shape({
      baseAmount: Yup.string("enter crypto amount").required("amount is required"),
      quoteAmount: Yup.string("enter amount").required("amount is required")
    })}
    onSubmit={(values) => {
      values.market = currentMarket;
      values.type = "buy";
      values.orderType = "market";
      const found = wallets.find((wallet) => wallet.asset === currentMarket.marketId?.quoteAsset);
      if (found?.amount >= values.quoteAmount) {
        if (values.orderType === "market") values.price = null;
        dispatch(makeOrder(values));
      } else {
        // setShowError(true);
        // setError(`not enough ${currentMarket.marketId?.quoteAsset} to buy`);
        dispatch(showErrorNotification(`not enough ${currentMarket.marketId?.quoteAsset} to buy`));

      }
      // actions.resetForm();
      // setBaseAmountWillBe(availableBaseAmount);
    }}
  >
    {({ values, setFieldValue, errors, touched }) => {
      return <RSForm tag={FormikForm}>
        <Row className='p-0'>
          <Col xs={12}>
            <Label for="quoteAmount">{t("I Give")}</Label>
            <FormGroup>
              <InputGroup>
                <Input
                  type="text"
                  name="quoteAmount"
                  className={"mb-2"}
                  tag={FormikField}
                  bsSize="lg"
                  value={values.quoteAmount}
                  invalid={errors.quoteAmount && touched.quoteAmount}
                  onKeyPress={(e) => {
                    if (e.key === "." && e.target.value.length > 0){
                      return true;
                    }
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value ? new BigNumber(e.target.value) : new BigNumber(0);
                    const baseAmount = value.dividedBy(currentMarket.marketPrice.$numberDecimal ? currentMarket.marketPrice.$numberDecimal : currentMarket.marketPrice);
                    const baseAmountWillBe = baseAmount.plus(availableBaseAmount);
                    setBaseAmountWillBe(parseFloat(baseAmountWillBe).toString());
                    setFieldValue("baseAmount", parseFloat(baseAmount).toString());
                    setFieldValue("quoteAmount", e.target.value);
                    setQuoteAmount(e.target.value);
                  }}
                />
                <InputGroupText className="custom-input-group-text mb-2 p-0 border-0">
                  <div style={{
                    width: "127px",
                    height: "100%"
                  }}>
                    {quoteAssetDefaultValue && <CustomSelect
                      name="quoteAsset"
                      options={quoteAssetOptions}
                      defaultValue={quoteAssetDefaultValue}
                      value={values.quoteAsset}
                      onChange={(e) => {
                        setFieldValue("quoteAsset", e);
                        setQuoteAsset(e.value);
                      }}>
                    </CustomSelect>}
                  </div>
                </InputGroupText>
                <FormFeedback tooltip>{errors.quoteAmount}</FormFeedback>
              </InputGroup>
              <FormText>
                {t("Available balance")} {availableQuoteAmount} {t(quoteAsset)}
              </FormText>
            </FormGroup>
          </Col>
          <Swapper toggle1={toggle1}></Swapper>
          <Col xs={12}>
            <Label for="baseAmount">{t("I Get")}</Label>
            <FormGroup>
              <InputGroup>
                <Input
                  type="text"
                  name="baseAmount"
                  className={"mb-2"}
                  tag={FormikField}
                  bsSize="lg"
                  value={values.baseAmount}
                  invalid={errors.baseAmount && touched.baseAmount}
                  onKeyPress={(e) => {
                    if (e.key === "." && e.target.value.length > 0){
                      return true;
                    }
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value ? new BigNumber(e.target.value) : new BigNumber(0);
                    const quoteAmount = value.multipliedBy(currentMarket.marketPrice.$numberDecimal ? currentMarket.marketPrice.$numberDecimal : currentMarket.marketPrice);
                    const baseAmountWillBe = value.plus(availableBaseAmount);
                    setBaseAmountWillBe(parseFloat(baseAmountWillBe).toString());
                    setFieldValue("quoteAmount", parseFloat(quoteAmount).toString());
                    setFieldValue("baseAmount", e.target.value);
                    setBaseAmount(e.target.value);
                  }}
                />
                <InputGroupText className="custom-input-group-text mb-2 p-0 border-0">
                  <div style={{
                    width: "127px",
                    height: "100%"
                  }}>
                    {baseAssetDefaultValue && 
                    <CustomSelect
                      name="basetAsset"
                      options={baseAssetOptions}
                      value={values.baseAsset}
                      defaultValue={baseAssetDefaultValue}
                      onChange={(e) => {
                        setFieldValue("baseAsset", e);
                        setBaseAsset(e.value);
                      }}>
                    </CustomSelect>}
                  </div>
                </InputGroupText>
                <FormFeedback tooltip>{errors.baseAmount}</FormFeedback>
              </InputGroup>
              <FormText>
                {t("Balance Will be")} {baseAmountWillBe} {t(baseAsset)}
              </FormText>
            </FormGroup>
          </Col>
          {/* <Col xs={12}>
            {showError && <Alert
              color="danger"
              className="w-100 my-3"
              isOpen={showError}
              toggle={() => { setShowError(false) }}
            >
              {error}
            </Alert>}
          </Col> */}
          <Col>
            <button type="submit" ref={submitButtonRef} style={{ display:"none" }}></button>
          </Col>
        </Row>
      </RSForm>;
    }}
  </Formik>;

}
export default BuyTab;