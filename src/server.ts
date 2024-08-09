import http from 'node:http';
import { FreeSwitchServer } from 'esl'

 const call = async () => {
    const server = new FreeSwitchServer();
    await server.listen({port:7000,host:"51.91.97.8"})
 }
 call()
