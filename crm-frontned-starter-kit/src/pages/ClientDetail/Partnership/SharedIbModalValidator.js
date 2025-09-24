import { debounce } from "lodash";

const validateAccountRebates = (isRebate, id, account, rebateTotals) => {
  let error = 0;
  if (
    rebateTotals[account.accountTypeId] &&
    parseFloat(rebateTotals[account.accountTypeId][id] || 0) == 0
  ) {
    return true;
  }

  if (
    isRebate &&
    rebateTotals[account.accountTypeId] &&
    parseFloat(account.rebate) <
      parseFloat(rebateTotals[account.accountTypeId][id])
  ) {
    error += 1;
  } else if (
    !isRebate &&
    rebateTotals[account.accountTypeId] &&
    parseFloat(account.commission) <
      parseFloat(rebateTotals[account.accountTypeId][id])
  ) {
    error += 1;
  }

  const accountRebatesTotal = {};

  Object.keys(rebateTotals).forEach((key) => {
    const accountId = key;
    let accountIdRebateTotal = 0;
    Object.keys(rebateTotals[accountId]).forEach((rebateKey) => {
      if (isRebate && rebateKey.indexOf("#rebate") > 0) {
        accountIdRebateTotal += parseFloat(rebateTotals[accountId][rebateKey]);
      } else if (!isRebate && rebateKey.indexOf("#commission") > 0) {
        accountIdRebateTotal += parseFloat(rebateTotals[accountId][rebateKey]);
      }
    });

    accountRebatesTotal[`${accountId}`] = accountIdRebateTotal;
  });

  if (
    isRebate &&
    parseFloat(account.rebate) < accountRebatesTotal[account.accountTypeId]
  ) {
    error += 1;
  } else if (
    !isRebate &&
    parseFloat(account.commission) < accountRebatesTotal[account.accountTypeId]
  ) {
    error += 1;
  }
  console.log("error", error);
  return error == 0;
};

export const validate = debounce((value, ctx, input, cb,  memberIndex, valueIndex, rebateId, ibRebateTotals) => {
  const ID = `members-${memberIndex}#values-${valueIndex}#rebate`;

  const rebate = rebateId == "rebate";

  const accountTypeId =
    ctx.members[memberIndex].values[valueIndex].accountTypeId;

  const account = ctx.totals.find(
    (total) => total.accountTypeId == accountTypeId
  );

  if (validateAccountRebates(rebate, ID, account, ibRebateTotals)) {
    cb(true);
  } else {
    cb(false);
  }
}, 100);

export const validateMembers = debounce(
  (value, ctx, input, cb, memberIndex, valueIndex, rebateId, ibRebateTotals) => {
    let error = 0;

    const memberRebate = rebateId == "rebate";

    const accountTypeId =
      ctx.members[memberIndex].values[valueIndex].accountTypeId;
    const account = ctx.totals.find(
      (total) => total.accountTypeId == accountTypeId
    );
    const accRebateId = `members-${memberIndex}#values-${valueIndex}#rebate`;

    if (ibRebateTotals) {
      if (
        memberRebate &&
        ibRebateTotals[account.accountTypeId] &&
        !isNaN(parseFloat(ibRebateTotals[account.accountTypeId][accRebateId] || 0))
      ) {
        if (
          value == 0
        ) {
          return true;
        }

        if (
          parseFloat(
            ibRebateTotals[account.accountTypeId][accRebateId] || 0
          ) < value
        ) {
          error += 1;
        }
      }
    }

    return cb(error == 0);
  },
  100
);

export const validateCommMembers = debounce(
  (value, ctx, input, cb, memberIndex, valueIndex, rebateId, ibRebateTotals) => {
    let error = 0;

    const memberRebate = rebateId == "commission";

    const accountTypeId =
      ctx.members[memberIndex].values[valueIndex].accountTypeId;
    const account = ctx.totals.find(
      (total) => total.accountTypeId == accountTypeId
    );

    const accCommissionId = `members-${memberIndex}#values-${valueIndex}#commission`;

    if (ibRebateTotals) {
      if (
        memberRebate &&
        ibRebateTotals[account.accountTypeId] &&
        !isNaN(parseFloat(ibRebateTotals[account.accountTypeId][accCommissionId] || 0))
      ) {
        if (
          value == 0
        ) {
          return true;
        } else if (
          parseFloat(
            ibRebateTotals[account.accountTypeId][accCommissionId] || 0
          ) < value
        ) {
          error += 1;
        }
      }
    }

    return cb(error == 0);
  },
  100
);

export const updateRebateProducts = (
  e,
  memberIdx,
  accIdx,
  accountTypes,
  products,
  productsModel,
  ibRebateTotals,
  setIBRebateTotals,
  setProductsModel,
  accountsTypeId
) => {
  const accountTypeId = accountsTypeId || accountTypes[accIdx]._id;
  const rebateId = `members-${memberIdx}#values-${accIdx}#rebate`;

  if (!ibRebateTotals[accountTypeId]) {
    ibRebateTotals[accountTypeId] = {};
  }

  ibRebateTotals[accountTypeId][rebateId] =
    parseFloat(e.target.value || 0) || 0;

  products.forEach((prod) => {
    productsModel[
      `members[${memberIdx}]#values[${accIdx}]#products#${prod}#rebate`
    ] = parseFloat(e.target.value || 0);
  });

  setIBRebateTotals({
    ...ibRebateTotals,
  });

  setProductsModel({
    ...productsModel,
  });
};

export const updateComissionProducts = (
  e,
  memberIdx,
  accIdx,
  accountTypes,
  products,
  productsModel,
  ibRebateTotals,
  setIBRebateTotals,
  setProductsModel,
  accountsTypeId
) => {
  const accountTypeId = accountsTypeId || accountTypes[accIdx]._id;
  const comissionId = `members-${memberIdx}#values-${accIdx}#commission`;

  if (!ibRebateTotals[accountTypeId]) {
    ibRebateTotals[accountTypeId] = {};
  }

  ibRebateTotals[accountTypeId][comissionId] =
    parseFloat(e.target.value || 0) || 0;

  products.forEach((prod) => {
    productsModel[
      `members[${memberIdx}]#values[${accIdx}]#products#${prod}#commission`
    ] = parseFloat(e.target.value || 0);
  });

  setIBRebateTotals({
    ...ibRebateTotals,
  });

  setProductsModel({
    ...productsModel,
  });
};
