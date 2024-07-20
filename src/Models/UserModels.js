import Realm from 'realm';
import UserSchema from '../Schemas/UserSchema';

class UserController {
    constructor() {
        this.realm = new Realm({
            schema: [UserSchema],
            schemaVersion: 2, // Versão atual do schema (aumente para cada migração)
            migration: (oldRealm, newRealm) => {
              // Realize as operações de migração aqui, por exemplo:
              if (oldRealm.schemaVersion < 2) {
                // Se a versão antiga do schema não tinha a propriedade "email",
                // você precisa adicionar a propriedade para os usuários existentes:
                oldRealm.objects('User').forEach(user => {
                  newRealm.create('User', { ...user, email: '' }, true); 
                });
              }
            }
        });
    }

    salvarUsuario(userId, userName) {
        
        const existingUser = this.realm.objects('User').filtered('id == $0', userId);

        this.realm.write(() => {
            if (existingUser.length > 0) {
                // Se existir, atualiza o usuário
                existingUser[0].name = userName; 
            } else {
                // Se não existir, cria um novo usuário
                this.realm.create('User', { id: userId, name: userName });
            }
        });
       
    }


    buscausuraio() {

        const user = this.realm.objects('User')
        
        return user;
        

    }

    deleteAllUsers() {
        this.realm.write(() => {
          this.realm.delete(this.realm.objects('User'));
        });
    }
}

export default new UserController();