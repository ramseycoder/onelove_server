import { FreeSwitchClient, FreeSwitchResponse, once } from 'esl';

const client: FreeSwitchClient = new FreeSwitchClient({
    host: "127.0.0.1",
    port: 8021,
    password: "!Prod_ESLClueCon",
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
      console.log('reconnecting ...', number);
    });

    client?.on('warning', (data) => {
      reject(new Error(data?.message));
    });

    client?.on('end', () => {
      reject(new Error('connection ended'));
    });

    client.on('error', (error: any) => {
      console.log('error', error);
      reject(new Error(error?.message));
    });

    console.log('Connection to ESL ....');
    client?.connect();
  });
};

export const fs_command = async (cmd: string) => {
  const client: FreeSwitchClient = new FreeSwitchClient({
    host: "127.0.0.1",
    port: 8021,
    password: "!Dev_ESLClueCon",
    logger: {
      debug: () => {},
      info: (...args) => console.info(...args),
      error: (...args) => console.error(...args),
    },
  });
  console.log('executing commande : ', cmd);
  const p = once(client, 'connect');
  client.connect();
  const [call] = await p;
  await call.bgapi(cmd);
  await call.exit();
  client.end();
};
