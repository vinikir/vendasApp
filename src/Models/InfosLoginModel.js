import ConexaoRealm from '../Conexao/ConexaoRealm';

class InfosLoginModel{

    constructor() {

        this.con = ConexaoRealm.conexao()

    }

    salvarInfos(login, senha) {
        
        const existingUser = this.con.objects('InfosLogin');

        this.con.write(() => {
            if (existingUser.length > 0) {
                // Se existir, atualiza o usuário
                existingUser[0].login = login; 
                existingUser[0].senha = senha; 
            } else {
                // Se não existir, cria um novo usuário
                this.con.create('InfosLogin', { login: login, senha: senha });
            }
        });
       
    }

    buscaInfosLogin() {

        const user = this.con.objects('InfosLogin')
        
        return user;
        

    }

}

export default new InfosLoginModel();