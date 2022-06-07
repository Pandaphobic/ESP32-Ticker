/*********
  Rui Santos
  Complete project details at https://randomnerdtutorials.com  
*********/

#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <HTTPClient.h>

// set the LCD number of columns and rows
int lcdColumns = 20;
int lcdRows = 4;

// set LCD address, number of columns and rows
// if you don't know your display address, run an I2C scanner sketch
LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);  

void setup(){
  // initialize LCD
  lcd.init();
  // turn on LCD backlight                      
  lcd.backlight();
}

void loop(){
  lcd.setCursor(0,0);
  lcd.print("Bitcoin       $40274");
  lcd.setCursor(0,1);
  lcd.print("Ethereum    $2464.93");
  lcd.setCursor(0,2);
  lcd.print("Cardano    $0.800568");
  lcd.setCursor(0,3);
  lcd.print("Fantom     $0.513083");
  delay(10000);
  lcd.clear(); 
  
}