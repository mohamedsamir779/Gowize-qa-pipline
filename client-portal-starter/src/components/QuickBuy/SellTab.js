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
require("dotenv").config();


const Swapper = ({ toggle1 }) => {
  return <div className='icon-swap-container'>
    <div className="icon-swap">
      <button type="button" className='btn btn-light' onClick={(e) => {
        e.preventDefault();
        toggle1("buy");
      }}>
        <i className='mdi mdi-sync' style={{ fontSize: "1rem" }}></i>
      </button>
    </div>
  </div>;
};

function SellTab({ toggle1, currentMarket, setCurrentMarket, submitButtonRef }) {
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
  const [quoteAmountWillBe, setQuoteAmountWillBe] = useState(0);
  const [, setBaseAmountWillBe] = useState(0);
  const [baseAssetOptions, setBaseAssetOptions] = useState([]);
  const [baseAssetDefaultValue, setBaseAssetDefaultValue] = useState();
  const [quoteAssetOptions, setQuoteAssetOptions] = useState([]);
  const [quoteAssetDefaultValue, setQuoteAssetDefaultValue] = useState();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const getBaseAsset = () => {
    const found = wallets.find((wallet) => wallet.asset === baseAsset);
    if (found) {
      return found.amount;
    } else
      return 0;
  };

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
    setAvailableBaseAmount(getBaseAsset());
    setBaseAmountWillBe(availableBaseAmount);
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


  return <>
    <Formik
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
        values.type = "sell";
        values.orderType = "market";
        const found = wallets.find((wallet) => wallet.asset === currentMarket.marketId?.baseAsset);
        if (found?.amount >= values.baseAmount) {
          dispatch(makeOrder(values));
        } else {
          // setShowError(true);
          // setError(`not enough ${currentMarket.marketId?.baseAsset} to sell`);
          dispatch(showErrorNotification(t(`not enough ${currentMarket.marketId?.baseAsset} to sell`)));
        }      
        // actions.resetForm();
        // setQuoteAmountWillBe(availableQuoteAmount);
      }}
    >
      {({ values, setFieldValue, errors, touched }) => {
        return <RSForm tag={FormikForm}>
          <Row className='p-0'>
            <Col xs={12}>
              <Label for="baseAmount">I Give</Label>
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
                      let quoteAmount = new BigNumber(value.multipliedBy(currentMarket.marketPrice.$numberDecimal ? currentMarket.marketPrice.$numberDecimal : currentMarket.marketPrice));
                      let quoteAmountWillBe = new BigNumber(quoteAmount.plus(availableQuoteAmount));
                      setQuoteAmountWillBe(parseFloat(quoteAmountWillBe.toString()));
                      setFieldValue("quoteAmount", parseFloat(quoteAmount.toString()));
                      setFieldValue("baseAmount", e.target.value);
                      setBaseAmount(e.target.value);
                    }}    
                  />
                  <InputGroupText className="custom-input-group-text mb-2 p-0 border-0">
                    <div style={{
                      width: "127px",
                      height: "100%"
                    }}>
                      {baseAssetDefaultValue && <CustomSelect
                        name="basetAsset"
                        options={baseAssetOptions}
                        value={values.baseAsset}
                        defaultValue={baseAssetDefaultValue}
                        onChange={(e) => {
                          setFieldValue("baseAsset", e.value);
                          setBaseAsset(e.value);
                        }}>
                      </CustomSelect>}       
                    </div>
                  </InputGroupText>
                  <FormFeedback tooltip>{errors.baseAmount}</FormFeedback>
                </InputGroup>
                <FormText>
                  {t("Available balance")} {availableBaseAmount} {t(baseAsset)}
                </FormText>
              </FormGroup>
            </Col>
            <Swapper toggle1={toggle1}></Swapper>
            <Col xs={12}>
              <Label for="quoteAmount">{t("I Get")}</Label>
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
                      let baseAmount = value.dividedBy(currentMarket.marketPrice.$numberDecimal ? currentMarket.marketPrice.$numberDecimal : currentMarket.marketPrice);
                      let quoteAmountWillBe = value.plus(availableQuoteAmount);
                      setQuoteAmountWillBe(parseFloat(quoteAmountWillBe.toString()));
                      setFieldValue("baseAmount", parseFloat(baseAmount.toString()));
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
                  {t("Balance Will be")} {quoteAmountWillBe} {t(quoteAsset)}
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
            <button type="submit" ref={submitButtonRef} style={{ display:"none" }}></button>
          </Row>
        </RSForm>;
      }}
    </Formik>
  </>;
}
export default SellTab;