/*******************Esp8266_Websocket.ino****************************************/

#include <ESP8266WiFi.h>
#include <WebSocketClient.h>

boolean handshakeFailed = 0;
int val = 0;
String dados = "";

char path[] = "/";   //identifier of this device

const char* ssid     = "Familia Moura";
const char* password = "F4m1l14@";
char* host = "192.168.1.9";
const int espport = 3003;

WebSocketClient webSocketClient;


WiFiClient client;


void setup() {
  Serial.begin(9600);
  delay(10);
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  delay(1000);

  wsconnect();
}

void loop() {

  if (client.connected()) {
    val = analogRead(A0);
    val = map(val, 0, 1023, 200, 10000);
    dados = "nome'Sensor da Caldeira'valor'" + (String)val + "'unidade'ppm";
    webSocketClient.sendData(dados);//send sensor data to websocket server
  }

  delay(1000);
}


void wsconnect() {
  // Connect to the websocket server
  if (client.connect(host, espport)) {
    Serial.println("Connected");
  } else {
    Serial.println("Connection failed.");
    delay(1000);

    if (handshakeFailed) {
      handshakeFailed = 0;
      ESP.restart();
    }
    handshakeFailed = 1;
  }

  // Handshake with the server
  webSocketClient.path = path;
  webSocketClient.host = host;
  if (webSocketClient.handshake(client)) {
    Serial.println("Handshake successful");
  } else {

    Serial.println("Handshake failed.");
    delay(4000);

    if (handshakeFailed) {
      handshakeFailed = 0;
      ESP.restart();
    }
    handshakeFailed = 1;
  }
}
