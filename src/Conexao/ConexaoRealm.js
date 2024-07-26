import Realm from "realm";
import infosLoginSchema from "../Schemas/InfosLogin";
import UserSchema from "../Schemas/UserSchema";

class ConexaoRealm{

    constructor() {
        this.realm = new Realm({
            schema: [UserSchema, infosLoginSchema],
            schemaVersion: 2, // Versão atual do schema (aumente para cada migração)
            migration: (oldRealm, newRealm) => {
              // Realize as operações de migração aqui, por exemplo:
                // if (oldRealm.schemaVersion < 2) {
                //     // Se a versão antiga do schema não tinha a propriedade "email",
                //     // você precisa adicionar a propriedade para os usuários existentes:
                //     oldRealm.objects('InfosLogin').forEach(user => {
                //     newRealm.create('InfosLogin', { ...user, email: '' }, true); 
                //     });
                // }
            }
        });
    }

    conexao () {
        return this.realm
    }

}

export default new ConexaoRealm()