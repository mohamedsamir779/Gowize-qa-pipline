import PerfectMoney from "assets/img/payment-method/perfect-money.png";
export const withdrawalConfig = [
  {
    gateway: "WIRE_TRANSFER",
    name: "Wire Transfer",
    image: "/img/payment-method/wire-transfer.png",
    allowed: {
      wallet: true,
      mt5: true,
    },
    config: {},
  },
  // {
  //   gateway: "PERFECT_MONEY",
  //   name: "Perfect Money",
  //   image: PerfectMoney,
  //   allowed: {
  //     wallet: true,
  //     mt5: true,
  //   },
  //   config: {},
  // },
  // {
  //   gateway: "OLX_FOREX",
  //   name: "Olx Forex",
  //   image: "/img/payment-method/olxforex.jpeg",
  //   allowed: ["fiatDeposit"],
  //   receipt: false,
  // },
  {
    gateway: "CRYPTO",
    name: "Crypto",
    image: "/img/payment-method/crypto.png",
    allowed: {
      wallet: true,
      mt5: true,
    },
    config: {
      methods: [
        {
          network: "TR20",
          coins: ["USDT"]
        }
      ]
    },
  },
  // {
  //   gateway: "حواله بنكيه",
  //   name: "حواله بنكيه",
  //   image: "/img/payment-method/hawala_bank.png",
  //   allowed: {
  //     wallet: true,
  //     mt5: true,
  //   },
  //   config: {      
  //   }
  // },
];