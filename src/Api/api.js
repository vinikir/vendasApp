import axios, { CancelToken } from 'axios';

export const TokenAxios = () => {
    return CancelToken.source();
} 

export const validaCancelamentoRequisicao = (err) => {
    return axios.isCancel(err)
}


var api = axios.create({
    
    baseURL: 'http://18.117.229.55/',
    //baseURL: 'http://192.168.0.59:3300/',
    timeout: 30000,
    headers: {
        'Content-Type':'application/json; charset=utf-8',
    }
});


export default api;