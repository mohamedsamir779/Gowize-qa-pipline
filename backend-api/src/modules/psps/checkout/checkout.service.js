const mongoose = require("mongoose");
const kycDoc = require("../../documents/documents.service");
const { CustomError } = require("../../../common/handlers");
const { default: axios } = require("axios");
const {
  keys: { checkout },
} = require("src/common/data");
const crypto = require("crypto");
const { CONSTANTS } = require("src/common/data");
const allServices = require("src/modules/services");
const { fxTransactionService, transactionService, accountService, customerService } =
  allServices;
const azureUpload = require("../../azure-multer/file-handler");

class CheckoutService {
  async pay(params, customer) {
    const customerId = new mongoose.Types.ObjectId(customer._id);
    const isValid = await kycDoc.find({ customerId });

    if (
      !Array.isArray(isValid) ||
      isValid.length <= 1 ||
      isValid[0].status !== "APPROVED" ||
      isValid[1].status !== "APPROVED"
    ) {
      throw new CustomError({ code: 401, message: "Please verify your KYC" });
    }

    // === 🔐 Generate Signature (SHA1 of MD5 encoded string)

    // Prepare the concatenated string as described
    const order_number = params.number;
    const amount = params.amount; // Order amount
    const currency = params.currency; // Order currency
    const description = params.description; // Order description
    const email = params.email; // Required  used in payload
    const walletId = params.walletId; // Required used in payload
    let tradingAccountId = null; // Optional used in payload
    if (params.tradingAccountId) {
      tradingAccountId = params.tradingAccountId; // Required used in payload
    }

    // === Step 1: Create string to hash
    const toUpper = (
      order_number +
      amount +
      currency +
      description +
      checkout.password
    ).toUpperCase();

    // === Step 2: MD5
    const md5Hash = crypto.createHash("md5").update(toUpper).digest("hex");

    // === Step 3: SHA1 of MD5
    const finalHash = crypto.createHash("sha1").update(md5Hash).digest("hex");

    try {
      const response = await axios.post(
        checkout.url,
        {
          merchant_key: checkout.merchantKey,
          operation: "purchase",
          order: {
            number: order_number,
            amount,
            currency,
            description,
          },
          customer: {
            name: "any",
            email,
          },
          custom_data: {
            wallet_id: walletId,
            customerId: customerId,
            tradingAccountId: tradingAccountId,
          },
          success_url: `${process.env.CLIENT_PORTAL_URL}/payment-success`,
          cancel_url: `${process.env.CLIENT_PORTAL_URL}/payment-rejected`,
          hash: finalHash, // Use the generated signature here
        },
        {
          headers: {
            Authorization: checkout.secretKey,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error in checkout:",
        error.response?.data || error.message
      );
      throw new CustomError({
        code: error.response?.status || 500,
        message: error.response?.data?.message || "Payment processing failed",
      });
    }
  }

  async callback(params) {
    if (params.status == "success") {
      
      if (params["custom_data[wallet_id]"]) {
        const transaction = await transactionService.basicDeposit({
          walletId: params["custom_data[wallet_id]"],
          customerId: params["custom_data[customerId]"],
          amount: params.order_amount,
          gateway: CONSTANTS.TRANSACTIONS_GATEWAYS.FINITIC_VISA_MASTER,
          isAutoApprove: true,
          currency: params.order_currency,
        });
      } else if (params["custom_data[tradingAccountId]"]) {
        const tradingAccount = await accountService.findById(
          params["custom_data[tradingAccountId]"]
        );
        const transaction = await fxTransactionService.addApprovedDeposit(
          {
            customerId: params["custom_data[customerId]"],
            currency: params.order_currency,
            gateway: CONSTANTS.TRANSACTIONS_GATEWAYS.FINITIC_VISA_MASTER,
            type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
            tradingAccountId: params["custom_data[tradingAccountId]"],
            amount: params.order_amount,
            rawData: {
              gatewayAmount: params.order_amount,
              gatewayCurrency: params.order_currency,
            },
          },
          { ...tradingAccount }
        );
      }
    } else if (params.status == "fail") {
      if (params["custom_data[wallet_id]"]) {
        const transaction = await transactionService.createPendingTransaction({
          type: "DEPOSIT",
          walletId: params["custom_data[wallet_id]"],
          customerId: params["custom_data[customerId]"],
          amount: params.order_amount,
          gateway: CONSTANTS.TRANSACTIONS_GATEWAYS.FINITIC_VISA_MASTER,
          currency: params.order_currency,
        });
        await transactionService.rejectDeposit({ id: transaction._id });
      } else if (params["custom_data[tradingAccountId]"]) {
        const tradingAccount = await accountService.findById(
          params["custom_data[tradingAccountId]"]
        );
        const transaction = await fxTransactionService.addRejectedDeposit(
          {
            customerId: params["custom_data[customerId]"],
            currency: params.order_currency,
            gateway: CONSTANTS.TRANSACTIONS_GATEWAYS.FINITIC_VISA_MASTER,
            type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
            tradingAccountId: params["custom_data[tradingAccountId]"],
            amount: params.order_amount,
            rawData: {
              gatewayAmount: params.order_amount,
              gatewayCurrency: params.order_currency,
            },
          },
          { ...tradingAccount }
        );
      }
    }
  }

  async uploadProfile(file, customer) {
    try {
      if (!file) throw new Error("File not provided");

      // Validate file type
      if (file.mimetype !== "application/pdf") {
        throw new Error("Only PDF files are allowed");
      }

      // Upload to Azure
      const uploaded = await azureUpload.uploadFile(
        file.buffer,
        file.mimetype,
        file.originalname,
        "visamaster", // folder name in Azure container
        true, // isFileHashRequired
        true, // use UUID
        false // isPublic
      );
      const customerId = new mongoose.Types.ObjectId(customer._id);

      const validateFirstDeposit = await customerService.updateById(customerId, {
        isFirstDeposit: false,});
      return uploaded;
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "File upload failed" });
    }
  }
}
module.exports = new CheckoutService();
