"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const toml_1 = __importDefault(require("toml"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.get("/ticker-2004", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let configData = toml_1.default.parse(fs_1.default.readFileSync("./config.toml", "utf-8"));
    const COINS_TO_GET = configData.ticker.coins.join("%2C");
    const VS_CURRENCY = configData.ticker.vsCurrency.toLowerCase();
    const SYMBOLS = configData.ticker.symbols;
    var coinPrices = yield getCoinPrices(COINS_TO_GET, VS_CURRENCY);
    var coinRows = [
        `${SYMBOLS[0].toUpperCase()}: ${coinPrices[configData.ticker.coins[0]][VS_CURRENCY]}`,
        `${SYMBOLS[1].toUpperCase()}: ${coinPrices[configData.ticker.coins[1]][VS_CURRENCY]}`,
        `${SYMBOLS[2].toUpperCase()}: ${coinPrices[configData.ticker.coins[2]][VS_CURRENCY]}`,
        `${SYMBOLS[3].toUpperCase()}: ${coinPrices[configData.ticker.coins[3]][VS_CURRENCY]}`,
    ];
    console.log(coinRows);
    res.send(coinRows);
}));
app.listen(port, () => {
    console.log(`⚡️[Ticker-Server]: Server is running at https://localhost:${port}`);
});
const getCoinPrices = (COINS_TO_GET, VS_CURRENCY) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, node_fetch_1.default)(`https://api.coingecko.com/api/v3/simple/price?ids=${COINS_TO_GET}&vs_currencies=${VS_CURRENCY}`);
        const coinPrices = yield res.json();
        return coinPrices;
    }
    catch (err) {
        console.log(`PRICE CALL FAILED: 02 ${err}`);
    }
});
