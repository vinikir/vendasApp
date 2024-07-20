import { Realm } from "realm";

const UserSchema = {
  name: 'User',
  properties: {
    id: 'string',
    name: 'string',
  }
};

export default UserSchema;