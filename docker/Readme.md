# ESP32 Ticker

Simple Crypto ticker that depends on a locally deployed REST server. The rest server will provide the entire content to be displayed by the ESP32.

## Stage 1 - Server

Build out the NodeJS REST API that will provide the ESP32 with the output it will send to the screen.

- make api calls based on config.toml
- dockerize the server https://www.youtube.com/watch?v=CsWoMpK3EtE&t=336
- deploy on home server

## Stage 2 - ESP32

Get the ESP32 up and running. Must drive the screen and be able to make API calls on the local wifi.

- connect to wifi
- screen working
- display ticker output
