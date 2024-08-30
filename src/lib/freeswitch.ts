import { FreeSwitchClient, FreeSwitchResponse, once } from 'esl';
import { logger } from '../utils/logger';

let host= "127.0.0.1" //"54.36.181.102"
let port = 8021;

const client: FreeSwitchClient = new FreeSwitchClient({
    host,
    port,
    password: "!Dev_ESLClueCon",
    logger: {
      debug: () => {},
      info: (...args) => console.info(...args),
      error: (...args) => console.error(...args),
    },
  });

export const connect = () => {
  return new Promise((resolve: (value: FreeSwitchResponse) => void, reject) => {
    client.on('connect', (call) => {
      resolve(call);
    });

    client?.on('reconnecting', (number) => {
      logger.info('reconnecting ...', number);
    });

    client?.on('warning', (data) => {
      reject(new Error(data?.message));
    });

    client?.on('end', () => {
      reject(new Error('connection ended'));
    });

    client.on('error', (error: any) => {
      reject(new Error(error?.message));
    });

    logger.info('Connection to ESL ....');
    client?.connect();
  });
};

export const fs_command = async (cmd: string) => {
  const client: FreeSwitchClient = new FreeSwitchClient({
    host,
    port,
    password: "!Dev_ESLClueCon",
    logger: {
      debug: () => {},
      info: (...args) => console.info(...args),
      error: (...args) => console.error(...args),
    },
  });
logger.info(`executing commande :  ${cmd}`);
  const p = once(client, 'connect');
  client.connect();
  const [call] = await p;
  await call.bgapi(cmd);
  await call.exit();
  client.end();
};
