import Axios, { AxiosResponse } from 'axios';

Axios.defaults.baseURL = "https://concertlive";

type checkcCallVerifType = {
    status: boolean;
    reason?: string;
    customerId:number;
    callID:string;
    offerId?:number;
    packageId?:number;
    calleeNumber:string;
    calleeName:string 
}

type getCallDataType = {
    status: boolean;
    packageId?:number;
    price?: number;
    customerId?:number;
    provider?:number;
    maximumMinutes?:number;
}


export  const checkCallVerif = async (uuid: string,calleeNumber:string,password:string): Promise<checkcCallVerifType> => {
    try {
        const request: AxiosResponse<checkcCallVerifType>= await Axios.post('/checkCallVerif',{uuid,calleeNumber,password});
        console.log("check call verif: ", request?.data);
        return request?.data;
    }catch(err){
        console.log("check call verif error: ", err?.message);
    }
}

export const createCall = async ({customerId,callID,offerId,packageId,calleeNumber,calleeName}:Record<string,any>) => {
    try {
        const request:AxiosResponse = await Axios.post('/createCall',{customerId,callID,offerId,packageId,calleeNumber,calleeName});
        console.log("create call : ", request?.data)
        return true;
    }catch(err){
        console.log("create call error: ", err?.message);
    }
}

export const getCallData= async (uuid:string): Promise<getCallDataType> => {
    try {
        const request: AxiosResponse<getCallDataType> = await Axios.get('/getCallData/'+uuid);
        console.log("get call data: ", request?.data)
        return request?.data;
    }catch(err){
        console.log("get call data error: ", err?.message);
    }
}

export const delCallVerif= async (uuid:string,hangupCause:string) => {
    try {
        const request: AxiosResponse= await Axios.post('/delCallVerif',{uuid,hangupCause});
        console.log("del call verif: ", request?.data);
        return true;
    }catch(err){
        console.log("del call verif error: ", err?.message);
    }
}

export const deduceFounds= async (data:Record<string,any>) => {
    try {
        const request:AxiosResponse = await Axios.post('/deduceFounds',{...data});
        console.log("deduce founds: ", request?.data)
        return true;
    }catch(err){
        console.log("deduce founds error: ", err?.message);
    }
}