module.exports = {
  google: {
    API_KEY: "",
    CLIENT_ID: "",
    SECRET: "",
  },
  facebook: {
    APP_ID: "",
  },
  SOCKET_URL: process.env.REACT_APP_API_CP_DOMAIN,
  BACKEND_CP_URL: process.env.REACT_APP_SOCKET_URL,
  MAX_UNAPPROVED_ACCOUNTS: 3,
  enableFX: process.env.REACT_APP_ENABLE_FX === "true" || true,
  enableCrypto: process.env.REACT_APP_ENABLE_CRYPTO === "true" || false,
  enableCryptoWallets: process.env.REACT_APP_ENABLE_CRYPTO_WALLETS === "true" || false,
  defaultPortal: process.env.REACT_APP_DEFAULT_PORTAL || "FOREX",
  companyCryptoDeposit: process.env.REACT_APP_COMPANY_CRYPTO_DEPOSIT === "true" || false,
  showDefaultSlider: process.env.DEFAULT_BANNER === "true" || false,
  COMPANY_WALLETS: [
    {
      name:"USDT",
      networks: [
        {
          name: "TRC20",
          address: "TQsfPq5TS5nc9ucx4uT9jz7NQoPhD9wxcz",
          tag: "usdt",
        }
      ],
    }
  ],

  ENABLE_DARK_MODE: true,
  ENABLE_GLOBAL_SEARCH: false,
  LEVERAGES: [1, 50, 100],
  PLATFORMS: [
    {
      name: "Windows Trader",
      // logo: "https://marketing.spotware.com/download/user/data/logos/ctrader_round.png", 
      logo: "https://my.gowize.co/static/media/logo.5e756188.png",
      image: "/images/platforms/platform-windows.png",
      isLocalImg: false,
      isLogoLocalImg: false,
      downloadLink: "https://getctrader.com/gowize/ctrader-gowize-setup.exe",
    },
    {
      name: "MacOS Trader",
      // logo: "https://marketing.spotware.com/download/user/data/logos/ctrader_round.png",
      logo: "https://my.gowize.co/static/media/logo.5e756188.png",
      image: "/images/platforms/paltform-mcos.png",
      isLocalImg: false,
      isLogoLocalImg: false,
      downloadLink: "https://getctradermac.com/gowize/ctrader-gowize-setup.dmg",

    },
    {
      name: "Web Trader",
      // logo: "https://marketing.spotware.com/download/user/data/logos/ctrader_round.png",
      logo: "https://my.gowize.co/static/media/logo.5e756188.png",
      image: "/images/platforms/platform-web.png",
      isLocalImg: false,
      isLogoLocalImg: false,
      downloadLink: "https://ct.gowize.co",

    },
    {
      name: "Android mobile Trader",
      // logo: "https://marketing.spotware.com/download/user/data/logos/ctrader_round.png",
      logo: "https://my.gowize.co/static/media/logo.5e756188.png",
      image: "https://www.spotware.com/user/pages/01.products/01.traders/05.ctrader-mobile-trading-platform/_a-for_mobile/top_mobile.webp",
      isLocalImg: false,
      isLogoLocalImg: false,
      downloadLink: "https://play.google.com/store/apps/details?id=com.spotware.ct",
      isLastChild:true,
    },
    {
      name: "iOS mobile Trader",
      // logo: "https://marketing.spotware.com/download/user/data/logos/ctrader_round.png",
      logo: "https://my.gowize.co/static/media/logo.5e756188.png",
      image: "/images/platforms/platform-iphone.png",
      isLocalImg: false,
      isLogoLocalImg: false,
      downloadLink: "https://apps.apple.com/cy/app/ctrader/id767428811",
      isLastChild:true,
    },
  ],
  finiticPayFees: {
    depositFee: 0.0025,
    minimumDepositAmount: 50,
  },
};
