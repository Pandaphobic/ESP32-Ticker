import express, { Express, Request, Response } from "express";
import dotenv, { config } from "dotenv";
import fetch from "node-fetch";
import TOML from "toml";
import fs from "fs";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/ticker-2004", async (req: Request, res: Response) => {
  let configData = TOML.parse(fs.readFileSync("./config.toml", "utf-8"));
  const COINS_TO_GET = configData.ticker.coins.join("%2C");
  const VS_CURRENCY = configData.ticker.vsCurrency.toLowerCase();
  const SYMBOLS = configData.ticker.symbols;

  var coinPrices = await getCoinPrices(COINS_TO_GET, VS_CURRENCY);
  var coinRows = [
    `${SYMBOLS[0].toUpperCase()}: ${
      coinPrices[configData.ticker.coins[0]][VS_CURRENCY]
    }`,
    `${SYMBOLS[1].toUpperCase()}: ${
      coinPrices[configData.ticker.coins[1]][VS_CURRENCY]
    }`,
    `${SYMBOLS[2].toUpperCase()}: ${
      coinPrices[configData.ticker.coins[2]][VS_CURRENCY]
    }`,
    `${SYMBOLS[3].toUpperCase()}: ${
      coinPrices[configData.ticker.coins[3]][VS_CURRENCY]
    }`,
  ];

  console.log(coinRows);

  res.send(coinRows);
});

app.listen(port, () => {
  console.log(
    `⚡️[Ticker-Server]: Server is running at https://localhost:${port}`
  );
});

const getCoinPrices = async (COINS_TO_GET: string, VS_CURRENCY: string) => {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${COINS_TO_GET}&vs_currencies=${VS_CURRENCY}`
    );
    const coinPrices = await res.json();
    return coinPrices;
  } catch (err) {
    console.log(`PRICE CALL FAILED: 02 ${err}`);
  }
};
