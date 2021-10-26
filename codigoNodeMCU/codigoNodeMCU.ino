#include <ESP8266WiFi.h>
#include <WebSocketClient.h>

boolean conexaoWS = 0;
int val = 0;
String dados = "";
char path[] = "/";
const char* ssid     = "Familia Moura";
const char* password = "F4m1l14@";
char* host = "192.168.1.14";
const int espport = 3003;
unsigned long tempo;


WiFiClient client;
WebSocketClient webSocketClient;

void conecta() {
  Serial.print("Iniciando a conexão: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("...tentando se conectar");
  }
  Serial.println("Conexão WiFi realizada com sucesso!!!");
  Serial.print("Endereço IP: ");
  Serial.println(WiFi.localIP());
  realizaConexaoWS();
}

void realizaConexaoWS() {
  if (client.connect(host, espport)) {
    Serial.println("Iniciando conexao WebSocket!!!!");
    webSocketClient.path = path;
    webSocketClient.host = host;
    if (webSocketClient.handshake(client)) {
      conexaoWS = true;
      Serial.println("Conexao WebSocket realizado com sucesso!!!!");
    } else {
      Serial.println("Houve falha na conexão WebSocket, tentaremos novamente ...");
      conexaoWS = false;
    }
  } else {
    Serial.println("Cade o servidor ???");
    conexaoWS = false;
  }
}


void setup() {
  Serial.begin(9600);
  delay(10);
  conecta();
  delay(500);
  tempo = millis();
}

void loop() {

  if (client.connected()) {
    if ((millis() - tempo) >= 1000) {
      if (conexaoWS == true) {
        Serial.println("chegou aqui!!! depois do conexaoWS");
        val = analogRead(A0);
        val = map(val, 0, 1023, 200, 10000);
        dados = "nome'Sensor da Caldeira'valor'" + (String)val + "'unidade'ppm";
        Serial.println(dados);
        webSocketClient.sendData(dados);//send sensor data to websocket server
        tempo = millis();
      }
    }
  }
}
