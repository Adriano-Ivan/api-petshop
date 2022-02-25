const http = require("http");
const app = require("./../config/app");
const server = http.createServer(app);
const config = require("config");

const PORT = 3000;
server.listen(config.get("api.porta"), () => {
  console.log(`API rodando na porta ${PORT}`);
});
