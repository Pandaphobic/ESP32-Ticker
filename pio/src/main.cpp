/*********
  Rui Santos
  Complete project details at https://randomnerdtutorials.com  
*********/

#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>

// set the LCD number of columns and rows
int lcdColumns = 20;
int lcdRows = 4;

// set LCD address, number of columns and rows
// if you don't know your display address, run an I2C scanner sketch
LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);  

// Wifi Setup
const char* ssid = "figureitout";
const char* password = "idontknow";
// server call stirng
const char* serverName = "http://192.168.0.21:9000/ticker-2004";
// init timer
unsigned long lastTime = 0;
// Set timer to 5 seconds (5000)
unsigned long timerDelay = 10000;

String tickerData;

String httpGETRequest(const char* serverName) {
  WiFiClient client;
  HTTPClient http;
    
  // Your Domain name with URL path or IP address with path
  http.begin(client, serverName);
  
  // Send HTTP POST request
  int httpResponseCode = http.GET();
  
  String payload = "{}"; 
  
  if (httpResponseCode>0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    payload = http.getString();
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  // Free resources
  http.end();

  return payload;
}

void setup(){
  Serial.begin(115200); 
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
 
  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");

  // initialize LCD
  lcd.init();
  // turn on LCD backlight                      
  lcd.backlight();

}

void loop(){
  //Send an HTTP POST request every timerDelay miliseconds
  if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
              
      tickerData = httpGETRequest(serverName);
      Serial.println(tickerData);
      JSONVar myObject = JSON.parse(tickerData);
  
      // JSON.typeof(jsonVar) can be used to get the type of the var
      if (JSON.typeof(myObject) == "undefined") {
        Serial.println("Parsing input failed!");
        return;
      }
    
      Serial.print("JSON object = ");
      Serial.println(myObject);
    
      // myObject.keys() can be used to get an array of all the keys in the object
      JSONVar keys = myObject.keys();

      lcd.clear(); 
    
      for (int i = 0; i < keys.length(); i++) {
        String value = JSONVar::stringify(myObject[keys[i]]);
        String substring1 = "_";
        String substring2 = " ";

        value.remove(0,1);
        value.remove(20,1);
        value.replace(substring1,substring2);
      
        lcd.setCursor(0,i);
        // lcd.print(keys[i]);
        // lcd.print(" : ");
        lcd.print(value);

      }

    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}
