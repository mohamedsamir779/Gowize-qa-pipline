import config from "config";
import usdt from "../../../assets/images/payment-method/USDT.png";
import Epayme from "assets/img/payment-method/epayme.png";
export const allowedMethods = [
  {
    gateway: "WIRE_TRANSFER",
    name: "Wire Transfer",
    image: "/img/payment-method/wire-transfer.png",
    allowed: ["mt5Deposit", "fiatDeposit", "cryptoDeposit"],
    receipt: true,
  },
  // {
  //   gateway: "OLX_FOREX",
  //   name: "Olx Forex",
  //   image: "/img/payment-method/olxforex.jpeg",
  //   allowed: ["fiatDeposit"],
  //   receipt: false,
  // },
  // {
  //   gateway: "PERFECT_MONEY",
  //   name: "Perfect Money",
  //   image: "/img/payment-method/perfect-money.png",
  //   allowed: ["mt5Deposit", "fiatDeposit", "cryptoDeposit"],
  //   receipt: true,
  // },
  {
    gateway: "CRYPTO",
    name: "Crypto",
    image: "/img/payment-method/crypto.png",
    allowed: config.companyCryptoDeposit ? ["mt5Deposit", "fiatDeposit", "cryptoDeposit"] : [],
    receipt: false,
  },
  // {
  //   gateway: "حواله بنكيه",
  //   name: "حواله بنكيه",
  //   image: "/img/payment-method/hawala_bank.png",
  //   allowed: ["mt5Deposit", "fiatDeposit", "cryptoDeposit"],
  //   receipt: true,
  // {
  //   gateway: "Qmmfx",
  //   name: "Qmmfx",
  //   image: "/img/payment-method/logo.png",
  //   allowed: config.companyCryptoDeposit ? ["mt5Deposit", "fiatDeposit"] : [],
  //   receipt: false,
  // },
  {
    gateway: "EPAYME",
    name: "epayme",
    image: Epayme,
    allowed: ["mt5Deposit", "fiatDeposit"],
    receipt: false,
  },
  {
    gateway: "FINITIC_PAY",
    name: "Finitic Pay",
    image: usdt,
    allowed: ["mt5Deposit", "fiatDeposit", "cryptoDeposit"],
    receipt: false,
    isSandbox: false,
  },
  {
    gateway: "PAYMAXIS",
    name: "Paymaxis",
    image: "/img/payment-method/paymaxis.png",
    allowed: ["mt5Deposit", "fiatDeposit", "cryptoDeposit"],
    receipt: false,
    isSandbox: true,
    showForCountries: ["South Africa", "Kenya", "Ghana", "Rwanda", "Nigeria", "Tanzania", "Uganda"]
  },
    {
    gateway: "VISA_MASTER",
    name: "visa and master",
    image: "/img/payment-method/1.png",
    allowed: ["mt5Deposit", "fiatDeposit", "cryptoDeposit"],
    receipt: false,
    isSandbox: false,
  },
];