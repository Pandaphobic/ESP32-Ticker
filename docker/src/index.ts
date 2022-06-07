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
  const COINS_TO_GET = configData.ticker.coins;
  const VS_CURRENCY = configData.ticker.vsCurrency.toLowerCase();
  const SYMBOLS = configData.ticker.symbols;

  var coinPrices = await getCoinPrices(COINS_TO_GET.join("%2C"), VS_CURRENCY);
  var coinNames = COINS_TO_GET.map((coin: string) => {
    return capitalizeFirstLetter(coin);
  });

  function getCoinStrings() {
    let coins: String[] = [];

    for (let i = 0; i <= 3; i++) {
      let key: String = `${coinNames[i]}`;
      let price: String = `${coinPrices[COINS_TO_GET[i]][VS_CURRENCY]}`;
      let spaceCount = 20 - key.length - price.length;

      const coinString = key + "_".repeat(Number(spaceCount - 1)) + "$" + price;
      coins.push(coinString);
      console.log(spaceCount);
    }

    return coins;
  }

  const coinStrings = getCoinStrings();

  var coinsObject = {
    0: coinStrings[0],
    1: coinStrings[1],
    2: coinStrings[2],
    3: coinStrings[3],
  };

  console.log(coinsObject);

  res.send(JSON.stringify(coinsObject));
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

function capitalizeFirstLetter(string: String) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
