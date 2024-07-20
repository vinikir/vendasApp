import api from "../Api/api";

export const BuscarProdutosServer = async () => {
    let retorno
    const res_api = await api.get('produtos').then((res) => {
        if (typeof res.data != "undefined" && res.data) {
            retorno = res.data
            return res.data
        }
    }).catch((error) => {
        if (error.response) {
            retorno = error.response.data

        } else if (error.request) {
            // A requisição foi feita, mas nenhuma resposta foi recebida
            console.log(error.request);
        } else {
            // Outro erro ocorreu
            console.log('Erro:', error.message);
        }
        
        return retorno
    })



    return retorno

}
