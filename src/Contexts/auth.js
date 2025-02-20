import React, { createContext, useState} from "react";

export const AuthContext = createContext({})

function AuthProvider({children}){
    const [userInfos, setUserInfos] = useState()

    function setUser(infos) {
        setUserInfos(infos)
    }

    return(
        <AuthContext.Provider value={{ userInfos, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider