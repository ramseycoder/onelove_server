import http from 'node:http';
import { startJob } from './lib/event-socket-monitor';
import { logger } from './utils/logger';
const server = http.createServer();

// redirigé les sorits de console vers logor
console.log = (...args) => logger.info(args.join(' '));
console.error = (...args) => logger.error(args?.join(' ')); 

server.listen(5000,() => {
   logger.info('listenning to port 5000');
   startJob();
})
