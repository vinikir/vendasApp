import api from "../Api/api";

export const Logar = async (login, senha) => {
    let retorno
    const res_api = await api.post('login', { login: login, senha: senha }).then((res) => {
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
            retorno = error.request
        } else {
            // Outro erro ocorreu
            console.log('Erro:', error.message);
            retorno = error.message
        }
        
        return retorno
    })



    return retorno

}

export const buscaVendedores = async () => {
    let retorno
    const res_api = await api.get('vendedor-listar').then((res) => {
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
            retorno = error.request
        } else {
            // Outro erro ocorreu
            console.log('Erro:', error.message);
            retorno = error.message
        }
        
        return retorno
    })



    return retorno
}
