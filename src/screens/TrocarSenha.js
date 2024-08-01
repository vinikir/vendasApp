import React, { useState} from "react"
import { 
    Text,
    View,
    Dimensions,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from "react-native"
import Icon from 'react-native-vector-icons/dist/FontAwesome5';


const TrocarSenha = () => {
    const [ senhaRepte, setSenhaRepte ] = useState("")
    const [ senha, setSenha ] = useState('')
    const [ visionIcon, setVision ] = useState('eye-slash')
    const [ seguret, setSeguret ] = useState(true)


    const vision = () =>{

        if(visionIcon == 'eye'){

            setVision('eye-slash')
            setSeguret(true)

        }else{

            setVision('eye') 
            setSeguret(false)
            
        }

    }
    return (
        <View style={styles.container}>
            
            <View style={ styles.viewInput }>
                <View style={{  alignItems:'center',position: 'absolute',marginTop:13,marginLeft:20,  zIndex:999}}>
                    <Icon name="lock" size={18} color="rgba(0, 0, 0, 0.6)"></Icon>
                </View>
                <TouchableOpacity onPress={() => vision()} style={{  alignItems:'center',position: 'absolute',marginTop:10,right:10,  zIndex:999}}>
                    <Icon name={visionIcon} size={20} color="rgba(0, 0, 0, 0.6)"></Icon>
                </TouchableOpacity>
                <TextInput
                    placeholder="Senha"
                    style={ styles.input}
                    value={senha}
                    onChangeText={ (e) => setSenha(e) }
                    placeholderTextColor="rgba(0, 0, 0, 0.6)"
                    autoCapitalize="none"
                    editable={true}
                />
            </View>

            <View style={ styles.viewInput }>
                <View style={{  alignItems:'center',position: 'absolute',marginTop:13,marginLeft:20,  zIndex:999}}>
                    <Icon name="lock" size={20} color="rgba(0, 0, 0, 0.6)"></Icon>
                </View>
                <TouchableOpacity onPress={() => vision()} style={{  alignItems:'center',position: 'absolute',marginTop:10,right:10,  zIndex:999}}>
                    <Icon name={visionIcon} size={20} color="rgba(0, 0, 0, 0.6)"></Icon>
                </TouchableOpacity>
                <TextInput
                    placeholder="Repetir senha"
                    style={ styles.inputSenha}
                    value={senhaRepte}
                    placeholderTextColor="rgba(0, 0, 0, 0.6)"
                    secureTextEntry={seguret}
                    onChangeText={ (e) => setSenhaRepte(e) }
                    editable={true}
                    autoCapitalize="none"
                />
                
            </View>
            <View style={{ alignItems:"center",  marginTop:40}}>
                <TouchableOpacity style={styles.btnLogin} onPress={() => LogarF()}>
                    {/* <Text style={{ color:"#0F2A33", fontWeight:"bold" }}>Entrar</Text> */}
                    <Text style={{ color:"#FFF", fontWeight:"bold" }}>Trocar</Text>
                </TouchableOpacity>
            </View>
            <View style={{ alignItems:"center",  marginTop:40}}>
                <TouchableOpacity style={styles.btnLogin} onPress={() => LogarF()}>
                    {/* <Text style={{ color:"#0F2A33", fontWeight:"bold" }}>Entrar</Text> */}
                    <Text style={{ color:"#FFF", fontWeight:"bold" }}>Cancelar</Text>
                </TouchableOpacity>
            </View>
             
            
        </View>
    )
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center',
        width: windowWidth,
        backgroundColor:"#4a4a4a",
        height:windowHeight
    },
    viewInput:{
        marginTop:10,
        marginBottom:10,
        flexDirection:"row",
    },
    input:{ 
        backgroundColor:"#fff",
        width: windowWidth-90,
        borderRadius:20,
        paddingLeft:55,
        height:45,
        color:"rgba(0, 0, 0, 0.6)"
    },
    inputSenha:{
        backgroundColor:"#fff",
        width: windowWidth-90,
        borderRadius:20,
        paddingLeft:55,
        paddingRight:55,
        height:45,
        color:"rgba(0, 0, 0, 0.6)"
    },
    btnLogin:{
        width:windowWidth-90,
        height: 45,
        backgroundColor: "#2b306e",
        justifyContent: 'center',
        alignItems:'center',
        marginTop:20,
        borderRadius:20
    },
})

export default TrocarSenha