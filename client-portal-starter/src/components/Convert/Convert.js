import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Modal,
  Form as ReactStrapForm,
  FormFeedback,
  Row,
  Col,
  Alert,
  Spinner
} from "reactstrap";
import {
  Formik, Field as FormikField, Form as FormikForm
} from "formik";
import * as Yup from "yup";
import AssetsListSelect from "components/Common/AssetsListSelect";
import {
  convertStart, previewConversion as previewConversionAction, resetConvert 
} from "store/crypto/convert/actions";
import { useTranslation, withTranslation } from "react-i18next";
import { showErrorNotification } from "store/general/notifications/actions";
import  { BigNumber } from "bignumber.js";

const validationSchema = Yup.object().shape({
  fromAsset: Yup.object().required("From Wallet is required"),
  toAsset: Yup.object().required("To Wallet is required"),
  amountToTransfer: Yup.string().test(
    "Is positive?", 
    "ERROR: Amount is required and must be greater than 0!", 
    (value) => value > 0
  ).required("Amount To Transfer required")
});

const initialValues = {
  amountToTransfer: "",
  fromAsset:"",
  toAsset:""
};

function Convert({ isOpen, toggleOpen }) {
  const { wallets } = useSelector(state => state.crypto.wallets);
  const convertState = useSelector(state=>state.crypto.convert);
  const { previewConversion } = useSelector(state=>state.crypto.convert);
  const [fromAsset, setFromCoin] = useState("");
  const [toAsset, setToCoin] = useState("");
  const [coin, setCoin] = useState("");
  const [amount, setAmount] = useState("");
  const [timer, setTimer] = React.useState(10);
  const id = React.useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const clear = ()=>{
    window.clearInterval(id.current);
  };

  const getComputedValueNew = (fromAsset, toAsset, amount = 1) => {
    if (previewConversion.result && previewConversion.result[`${fromAsset}_${toAsset}`]) {
      const p = new BigNumber(previewConversion.result[`${fromAsset}_${toAsset}`]);
      return parseFloat(p.multipliedBy(amount).toString()).toFixed(5);
    }
    return parseFloat(amount).toFixed(5);
  };

  React.useEffect(()=>{
    if (convertState.step === "convert")
      id.current = window.setInterval(()=>{
        setTimer((time)=>time - 1);
      }, 1000);
    return ()=> clear();
  }, [convertState.step]);

  useEffect(()=>{
    return ()=> {
      clear();
      setTimer(10);
      dispatch(resetConvert());
    };
  }, []);

  useEffect(()=>{
    if (fromAsset && toAsset && fromAsset !== "" && toAsset !== "" && amount !== "" && amount > 0) {
      dispatch(previewConversionAction({
        fromAsset: fromAsset.symbol,
        toAsset: toAsset.symbol,
      }));
    }
  }, [fromAsset, toAsset, amount]);

  React.useEffect(()=>{
    if (timer == 0){
      clear();
    }
  }, [timer]);

  const resetTimer = ()=>{
    clear();
    setTimer(10);
    id.current = window.setInterval(()=>{
      setTimer((time)=>time - 1);
    }, 1000);
  };

  return (<>
    <Modal
      isOpen={isOpen}
      toggle={toggleOpen}
      centered={true}
      size="lg"
      className='custom-modal'
    >
      <div className="modal-header">
        <button
          type="button"
          className="close btn btn-soft-dark waves-effect waves-light btn-rounded m-4"
          data-dismiss="modal"
          aria-label="Close"
          onClick={toggleOpen}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <h4 className="mb-3 text-center">
          {t("Convert")}
        </h4>
        <Container>
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={(values)=>{
              const body = {
                toAsset: values.toAsset.value.symbol,
                fromAsset: values.fromAsset.value.symbol,
                fromAssetId: values.fromAsset.value._id,
                toAssetId: values.toAsset.value._id, 
              };
              const found = wallets.find((wallet) => wallet.asset === body.fromAsset);
              if (found?.amount > 0)
                dispatch(convertStart({
                  ...body,
                  amount: values.amountToTransfer.toString(),
                }));
              else 
                dispatch(showErrorNotification(t(`You don't have enough ${body.fromAsset} to convert`)));
            }}
          >
            {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
              <ReactStrapForm tag={FormikForm}>
                <Row>
                  {/* <Col xs={12}>
                    <div className="mb-3">
                      <InputGroup>
                        <InputGroupText className="custom-input-group-text">
                          Available Balance
                        </InputGroupText>
                        <Input className="form-control border-start-0 text-end" type="text" value={availableBalance} disabled />
                      </InputGroup>
                    </div>
                  </Col> */}
                  <Col xs={12}>
                    <div className="mb-3">
                      <Label className="form-label mb-3">From</Label>
                      <AssetsListSelect
                        name="fromAsset"
                        value={values.fromAsset}
                        wallets={wallets}
                        isOptionDisabled={(option) => option.value === values.toAsset.value}
                        onChange={(e) => {
                          setFieldValue("fromAsset", e);
                          setFieldValue("amountToTransfer", "");
                          setFromCoin(e.value);
                          const found = wallets.find((wallet) => wallet.asset === e.value.symbol);
                          if (found) {
                            setCoin(found);
                          }
                          else
                            setCoin(false);
                        }}
                      >
                      </AssetsListSelect>
                      <FormFeedback tooltip>{errors.fromAsset}</FormFeedback>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="mb-3">
                      <Label className="form-label mb-3">To</Label>
                      <AssetsListSelect
                        name="toAsset"
                        value={values.toAsset}
                        wallets={wallets}
                        // eslint-disable-next-line object-property-newline
                        isOptionDisabled={(option) => option.value === values.fromAsset.value}
                        onChange={(e) => {
                          setFieldValue("toAsset", e);
                          setFieldValue("amountToTransfer", "");
                          setToCoin(e.value);
                        }}
                      >
                      </AssetsListSelect>
                      <FormFeedback tooltip>{t(errors.toAsset)}</FormFeedback>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <div className="mb-3">
                      <Label className="form-contr">{t("Amount")}</Label>
                      <InputGroup>
                        <Input
                          tag={FormikField}
                          placeholder="Amount to transfer"
                          name="amountToTransfer"
                          className="form-control border-end-0"
                          type="text"
                          value={values.amountToTransfer}
                          invalid={errors.amountToTransfer && touched.amountToTransfer}
                          onKeyPress={(e) => {
                            if (e.key === "." && e.target.value.length > 0){
                              return true;
                            }
                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e)=>{
                            setFieldValue("amountToTransfer", e.target.value);
                            setAmount(e.target.value);
                          }}
                        />
                        <InputGroupText className="custom-input-group-text">
                          <button
                            className="btn btn-outline-secondary waves-effect btn-sm w-lg"
                            onClick={(e) => {
                              e.preventDefault();
                              setFieldValue("amountToTransfer", coin.amount);
                            }}
                          >
                            {t("Max amount")}
                          </button>
                        </InputGroupText>
                        {/* <FormFeedback tooltip>{errors.amountToTransfer}</FormFeedback> */}
                      </InputGroup>
                      <span className="text-muted" style={{ fontSize: 10 }}>{`${coin ? `${coin.amount} ${coin.asset}` : "0"}`} Available</span>
                    </div>
                  </Col>
                  {/* <Col>
                    {convertState.error.length > 0 && <Alert color="danger">
                      {convertState.error}
                    </Alert>}
                  </Col> */}
                  {previewConversion.success && <>
                    <div className="d-flex justify-content-between">
                      <div>
                        1 {values.fromAsset.value.symbol} = {t("Approx")} {getComputedValueNew(values.fromAsset.value.symbol, values.toAsset.value.symbol)} {values.toAsset.value.symbol}
                      </div>
                      <div>
                        1 {values.toAsset.value.symbol} = {t("Approx")} {getComputedValueNew(values.toAsset.value.symbol, values.fromAsset.value.symbol)} {values.fromAsset.value.symbol}
                      </div>
                    </div>
                  </>}
                  {previewConversion.success && <>
                    <div className="d-flex justify-content-between">
                      <div>
                        {t("From")}
                      </div>
                      <div>
                        {`${values.amountToTransfer} ${values.fromAsset.value.symbol}`}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div>
                        {t("To")}
                      </div>
                      <div>
                        {`${getComputedValueNew(values.fromAsset.value.symbol, values.toAsset.value.symbol, values.amountToTransfer)} ${values.toAsset.value.symbol}`}
                      </div>
                    </div>
                    {!coin && <div> 
                      <Alert color="danger" className="mb-0 p-2">{t(`Insufficient ${values.fromAsset.value.symbol} at your wallet`)}</Alert>
                    </div>}
                  </>}
                  {convertState.step === "preview_conversion" && <div className="mt-4 text-center">
                    <Button className="btn-sm w-lg" color="primary" disabled={previewConversion.loading}
                      onClick={()=>{
                        setFieldTouched("amountToTransfer", true);
                        if (values && values.fromAsset.value && values.toAsset.value && values.amountToTransfer > 0)
                          dispatch(previewConversionAction({
                            fromAsset:values.fromAsset.value.symbol,
                            toAsset:values.toAsset.value.symbol,
                          }));
                      }}>
                      {previewConversion.loading ? <div className="d-flex align-items-center justify-content-center">
                        <Spinner style={{
                          width:"1rem",
                          height:"1rem" 
                        }}>
                        </Spinner>
                      </div> : t("Preview Conversion") }
                    </Button>
                  </div>}
                  {convertState.step === "convert" && <div className="text-center mt-2">
                    <Button type="submit" className="btn-sm w-lg m-1" color="primary" disabled={convertState.loading || timer === 0}>
                      {convertState.loading ? <div className="d-flex align-items-center justify-content-center">
                        <Spinner style={{
                          width:"1rem",
                          height:"1rem" 
                        }}>
                        </Spinner>
                      </div> : t("Convert") }
                    </Button>
                    <Button className="btn-sm w-lg m-1" color="warning" disabled={convertState.loading || timer > 0} 
                      onClick={()=>{
                        if (values && values.fromAsset.value && values.toAsset.value){
                          resetTimer();
                          dispatch(previewConversionAction({
                            fromAsset:values.fromAsset.value.symbol,
                            toAsset:values.toAsset.value.symbol,
                          }));
                        }
                      }}>{t("Refresh")} {timer}</Button>
                  </div>}
                </Row>
              </ReactStrapForm>
            )}
          </Formik>
        </Container>
      </div>
    </Modal >
  </>);
}
export default withTranslation()(Convert); 
