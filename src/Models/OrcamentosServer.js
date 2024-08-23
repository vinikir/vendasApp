import api from "../Api/api";

export const SalvaOrcamentoServer = async (orcamento) => {
    let retorno
    
    const res_api = await api.post('orcamento/salvar',orcamento).then((res) => {
        if (typeof res.data != "undefined" && res.data) {
            retorno = res.data
            return res.data
        }
    }).catch((error) => {
        if (error.response) {
            retorno = error.response.data

        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Erro:', error.message);
        }
        
        return retorno
    })



    return retorno

}

export const BuscaOrcamentoServer = async () => {
    
    let retorno
    
    const res_api = await api.post('orcamentos').then((res) => {
        if (typeof res.data != "undefined" && res.data) {
            retorno = res.data
            return res.data
        }
    }).catch((error) => {
        if (error.response) {
            retorno = error.response.data

        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Erro:', error.message);
        }
        
        return retorno
    })



    return retorno

}

