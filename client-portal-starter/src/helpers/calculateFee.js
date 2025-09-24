import BigNumber from "bignumber.js";

export default (feeDetails, amount) => {
  if (amount == 0 || !amount) return 0;
  let {
    value,
    isPercentage,
    minValue,
    maxValue,
  } = feeDetails;
  let fee = new BigNumber(0);
  value = new BigNumber(value?.$numberDecimal || value);
  minValue = new BigNumber(minValue?.$numberDecimal || minValue);
  maxValue = new BigNumber(maxValue?.$numberDecimal || maxValue);
  amount = new BigNumber(amount);
  if (!isPercentage) return parseFloat(fee.plus(value).toString());
  fee = fee.plus(amount.multipliedBy(value.dividedBy(100)));
  if (fee.isLessThan(minValue)) {
    fee = minValue;
  } else if (fee.isGreaterThan(maxValue)) {
    fee = maxValue;
  }
  return parseFloat(fee.toString());
};
