import http from 'node:http';
import { startJob } from './lib/event-socket-monitor';

const server = http.createServer();

server.listen(5000,() => {
   console.log('listenning to port 5000');
   startJob();
})
