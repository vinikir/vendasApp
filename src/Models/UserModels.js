import ConexaoRealm from '../Conexao/ConexaoRealm';
class UserController {
    constructor() {
        this.con = ConexaoRealm.conexao()
    }

    salvarUsuario(userId, userName) {
        
        const existingUser = this.con.objects('User');

        this.con.write(() => {
            if (existingUser.length > 0) {
                // Se existir, atualiza o usuário
                existingUser[0].id = userId; 
                existingUser[0].name = userName; 
            } else {
                // Se não existir, cria um novo usuário
                this.con.create('User', { id: userId, name: userName });
            }
        });
       
    }


    buscausuraio() {

        const user = this.con.objects('User')
        
        return user;
        

    }

    deleteAllUsers() {
        this.realm.write(() => {
          this.realm.delete(this.realm.objects('User'));
        });
    }
}

export default new UserController();