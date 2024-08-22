import Axios, { AxiosResponse } from 'axios';
const inProd = false;
// password;
let key = "09227f15666587269dc9ef2aeac4a40b24c12b84178841d996df1f13c3beef4b628ea4cbf2d624727c0f0b021d39eae83c62b0e667c279bfd36c062ec5331c92"
Axios.defaults.baseURL =  inProd ? "https://onelove-alcall.net" : "https://aa31-160-154-28-88.ngrok-free.app/api/freeswitch";
Axios.defaults.headers.common["Authorization"] =  key;

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
        return request?.data;
    }catch(err){
        console.log("check call verif error: ", err?.message);
    }
}

export const createCall = async ({customerId,callID,offerId,packageId,calleeNumber,calleeName}:Record<string,any>) => {
    try {
        const request:AxiosResponse = await Axios.post('/createCall',{customerId,callID,offerId,packageId,calleeNumber,calleeName});
        return request;
    }catch(err){
        console.log("create call error: ", err?.message);
    }
}

export const getCallData= async (uuid:string): Promise<getCallDataType> => {
    try {
        const request: AxiosResponse<getCallDataType> = await Axios.get('/getCallData/'+uuid);
        return request?.data;
    }catch(err){
        console.log("get call data error: ", err?.message);
    }
}

export const delCallVerif= async (uuid:string,hangupCause:string) => {
    try {
        const request: AxiosResponse= await Axios.post('/delCallVerif',{uuid,hangupCause});
        return request;
    }catch(err){
        console.log("del call verif error: ", err?.message);
    }
}

export const deduceFounds= async (data:Record<string,any>) => {
    try {
        const request:AxiosResponse = await Axios.post('/deduceFounds',{...data});
        return request;
    }catch(err){
        console.log("deduce founds error: ", err?.message);
    }
}