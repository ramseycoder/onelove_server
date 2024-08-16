import { FreeSwitchResponse } from 'esl';

import { notify } from './channel-observer';
import { connect } from './freeswitch';
const events = [
  'CHANNEL_CREATE',
  'CHANNEL_ANSWER',
  'CHANNEL_HANGUP',
  'CHANNEL_HANGUP_COMPLETE',
] as Parameters<FreeSwitchResponse['event_json']>;

export type configParams = {
  host: string | undefined;
  port: any | undefined;
  password: string | undefined;
};

export const startJob = () => {
  connect()
    .then((connection: FreeSwitchResponse) => {
      // Subscribe to all FreeSWITCH events:
      console.log('connected to ESL');
      connection.event_json(...events);
      events.forEach((event) =>
        connection.on(event, (data) =>
          notify(data)
        ),
      );
    })
    .catch((error: unknown) => {
      console.log('ERROR : ', error);
      // An error connecting to FreeSWITCH occurred!
    });
};
