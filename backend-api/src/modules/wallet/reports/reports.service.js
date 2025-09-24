const { Cruds, createPagination } = require('src/common/handlers');
const {
  transactionService,
  walletTransferService,
} = require('src/modules/services');

class Service extends Cruds {
  async getPaginate(params) {
    const {
      customerId,
      page,
      limit,
      type,
      currency,
      dateTo,
      dateFrom,
    } = params;
    const query = {
      customerId,
    };
    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
    };
    if (dateFrom && dateTo) {
      query.createdAt = {
        $gte: new Date(dateFrom),
        $lte: new Date(dateTo),
      };
    }
    const transactionQuery = {
      ...query,
    };
    if (type !== 'ALL') {
      transactionQuery.type = type;
    }
    let walletTransferQuery = {
      ...query,
    };
    if (currency !== 'ALL') {
      walletTransferQuery = {
        ...walletTransferQuery,
        $or: [
          { baseCurrency: currency },
          { targetCurrency: currency },
        ],
      };
    }
    if (currency !== 'ALL') {
      transactionQuery.currency = currency;
    }
    if (type === 'TRANSFER') {
      return walletTransferService.getPaginate(walletTransferQuery, options);
    }
    if (type === 'DEPOSIT' || type === 'WITHDRAW') {
      return transactionService.getPaginate(transactionQuery, options);
    }
    const [transactions, walletTransfers] = await Promise.all([
      transactionService.getPaginate(transactionQuery),
      walletTransferService.getPaginate(walletTransferQuery),
    ]);
    const pagination = createPagination(
      (transactions.totalDocs + walletTransfers.totalDocs),
      parseInt(page, 10),
      parseInt(limit, 10),
    );
    const payload = [
      ...transactions.docs,
      ...walletTransfers.docs,
    ].sort((a, b) => b.createdAt - a.createdAt).slice(
      (pagination.page - 1) * pagination.limit,
      pagination.page * pagination.limit,
    );
    const data = {
      ...{
        ...pagination,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      },
      docs: payload,
    };
    return data;
  }
}

module.exports = new Service();
