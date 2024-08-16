import { FreeSwitchEventData } from 'esl';

import {
  deduceFounds,
  checkCallVerif,
  createCall,
  delCallVerif,
  getCallData,
} from './api';

import { fs_command } from './freeswitch';

const CallDatas: Record<string, any> = {};

export const notify = async ({ body }: FreeSwitchEventData) => {
  const EventName = body['Event-Name'];
  const SafeNumbers = ['990', '5000'];
  try {
        // CHANNEL_CREATE
        if (EventName === 'CHANNEL_CREATE') {
          const uuid = body['Channel-Call-UUID'] as string;
          const answerState = body['Answer-State'];
          const callDirection = body['Call-Direction'];
          const password = body['Caller-Caller-ID-Name'] as string;
          const calleeNumber = body['Caller-Destination-Number'] as string;
          console.log(
            'channel_create',
            uuid,
            answerState,
            callDirection,
            password,
            calleeNumber,
          );

          if (callDirection === 'inbound' && !SafeNumbers.includes(calleeNumber)) {
            const req = await checkCallVerif(uuid, calleeNumber, password);
            if (!req.status) {
              fs_command(`uuid_kill ${uuid} '${req.reason}'`);
            } else {
              // create call
              await createCall({
                customerId: req?.customerId!,
                callID: req?.callID!,
                offerId: req.offerId!,
                packageId: req.packageId!,
                calleeNumber: req.calleeNumber!,
                calleeName: req.calleeName!,
              });
            }
          }
        }

        // CHANNEL_ANSWER
        if (EventName === 'CHANNEL_ANSWER') {
          const callDirection = body['Call-Direction'];
          const uuid = body['Channel-Call-UUID'] as string;
          const calleeNumber = body['Caller-Destination-Number'] as string;
          console.log('Channel answered', uuid, callDirection);
          if (callDirection === 'outbound' && !SafeNumbers.includes(calleeNumber)) {
            // check information
            const custom = await getCallData(uuid); // get CallInfo;m)
            if (custom?.status) {
              CallDatas[uuid] = {
                isPackage: !!custom?.packageId,
                rate: custom?.price,
                customerId: custom?.customerId,
                packageId: custom?.packageId,
                provider: custom?.provider,
              };
              fs_command(`sched_hangup +${custom?.maximumMinutes} ${uuid} ${custom?.packageId ? 'NOT ENOUGHT MINUTES' : 'NOT ENOUGHT MONEY' }`);
            } else {
              fs_command(`uuid_kill ${uuid}`);
            }
          }
        }

        // CHANNEL_HANGUP
        if (EventName === 'CHANNEL_HANGUP') {
          const uuid = body['Channel-Call-UUID'] as string;
          const callDirection = body['Call-Direction'];
          const calleeNumber = body['Caller-Destination-Number'] as string;
          const hangupCause = body['Hangup-Cause'];
          console.log('Channel hangup', uuid, callDirection, hangupCause);
          if (callDirection === 'inbound' && !SafeNumbers.includes(calleeNumber)) {
            return  await delCallVerif(uuid,hangupCause);
          }
        }

        // CHANNEL_HANGUP_COMPLETE
        if (EventName === 'CHANNEL_HANGUP_COMPLETE') {
          const uuid = body['Channel-Call-UUID'] as string;
          const callDirection = body['Call-Direction'];
          const time = body['variable_billsec'] as string;
          console.log('Channel hangup completed', uuid, callDirection);
          if (CallDatas[uuid]) {
            const old = { ...CallDatas[uuid] };
            delete CallDatas[uuid];
            const billSec = parseFloat(time);
            return  await deduceFounds({
              ...old,
              callID:uuid,
              time: billSec,
            });
          }
        }
  }catch(err: any){
    console.log("err: ", err?.message);
    return;
  }
};
