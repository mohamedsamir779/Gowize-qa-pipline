import {
	normalizedData
} from "./priceData";

// DatafeedConfiguration implementation
const configurationData = {
	// Represents the resolutions for bars supported by your datafeed
	// supported_resolutions: ["1", "5", "15", "30", "1H", "1D", "1W", "1M"],
	supported_resolutions: ["1"],
	// The `exchanges` arguments are used for the `searchSymbols` method if a user selects the exchange
	exchanges: [
		{
			value: "Binance",
			name: "Binance",
			desc: "Binance"
		},
		{
			value: "Bitfinex",
			name: "Bitfinex",
			desc: "Bitfinex"
		},
		{
			value: "Kraken",
			name: "Kraken",
			desc: "Kraken bitcoin exchange"
		},
		{
			value: "CME",
			name: "CME",
			desc: "Chicago Merchentile Exchange"
		},
	],
	// The `symbols_types` arguments are used for the `searchSymbols` method if a user selects this symbol type
	symbols_types: [
		{
			name: "crypto",
			value: "crypto"
		},
		{
			name: "fx",
			value: "fx"
		},
		{
			name: "cfd",
			value: "cfd"
		},
	]
};
const dummySymbols = [{
	symbol: "ETH/USDT",
	full_name: "ETHER vs USDT",
	description: "",
	exchange: "Binance",
	type: "crypto",
	pricescale: 100,
	minmov: 1,
}, {
	symbol: "EUR/USD",
	full_name: "EURO VS USD",
	description: "",
	exchange: "CME",
	type: "fx"
}, {
	symbol: "GBP/USD",
	full_name: "GBP VS USD",
	description: "",
	exchange: "CME",
	type: "fx"
}, {
	symbol: "AUD/USD",
	full_name: "AUD VS USD",
	description: "",
	exchange: "CME",
	type: "fx"
},

];
function onReady(callback) {
	console.log("[onReady]: Method call");
	setTimeout(() => callback(configurationData));
}
async function searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
	console.log("[searchSymbols]: Method call");
	// const symbols = await getAllSymbols();
	const symbols = dummySymbols;
	const newSymbols = symbols.filter(symbol => {
		const isExchangeValid = exchange === "" || symbol.exchange === exchange;
		const isFullSymbolContainsInput = symbol.full_name
			.toLowerCase()
			.indexOf(userInput.toLowerCase()) !== -1;
		return isExchangeValid && isFullSymbolContainsInput;
	});
	onResultReadyCallback(newSymbols);
}
async function resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension) {
	console.log("[resolveSymbol]: Method call", symbolName);
	const symbols = dummySymbols;
	const symbolItem = symbols.find(({ full_name, symbol }) => { return (symbolName === full_name || symbolName === symbol) });
	if (!symbolItem) {
		console.log("[resolveSymbol]: Cannot resolve symbol", symbolName);
		onResolveErrorCallback("Cannot resolve symbol");
		return;
	}
	// Symbol information object
	const symbolInfo = {
		ticker: symbolItem.full_name,
		name: symbolItem.symbol,
		description: symbolItem.description,
		type: symbolItem.type,
		session: "24x7",
		timezone: "Etc/UTC",
		exchange: symbolItem.exchange,
		minmov: 1,
		pricescale: 100,
		has_intraday: true,
		has_no_volume: true,
		has_weekly_and_monthly: false,
		supported_resolutions: configurationData.supported_resolutions,
		volume_precision: 2,
		//data_status: "streaming",
		data_status: "historical",
	};
	console.log("[resolveSymbol]: Symbol resolved", symbolName);
	onSymbolResolvedCallback(symbolInfo);
}
async function getBars(symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) {
	const bars = normalizedData;
	console.log({ bars });
	const { from, to, firstDataRequest } = periodParams;
	console.log("[getBars]: Method call", symbolInfo, resolution, from, to);
	try {
		//priceData;
		console.log("[getBars]: bars=> ", { bars });
		if (!bars) onHistoryCallback([], { noData: true });
		else {
			console.log(`[getBars]: returned ${bars.length} bar(s)`);
			onHistoryCallback(bars, { noData: false });
		}

	} catch (error) {
		console.log("[getBars]: Get error", error);
		onErrorCallback(error);
	}
}
function subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
	console.log("[subscribeBars]: Method call with subscriberUID:", subscriberUID);
}
function unsubscribeBars(subscriberUID) {
	console.log("[unsubscribeBars]: Method call with subscriberUID:", subscriberUID);
}
export default ({
	onReady: onReady,
	searchSymbols: searchSymbols,
	resolveSymbol: resolveSymbol,
	getBars: getBars,
	subscribeBars: subscribeBars,
	unsubscribeBars: unsubscribeBars
});