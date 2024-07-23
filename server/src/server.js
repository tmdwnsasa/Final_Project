import net from "net";
import initServer from "./init/index.js";
import { config } from "./config/config.js";
import { onConnection } from "./events/onConnection.js";

const server = net.createServer(onConnection);

initServer().then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(`서버가 ${config.server.host}:${config.server.port}에서 실행 중입니다`)
      console.log(server.address());
    });
}).catch((err) => {
    console.error(err);
    process.exit(1);
})

