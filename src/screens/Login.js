import React, { useEffect, useState, useContext } from 'react';
import UserModels from '../Models/UserModels';

import { 
    View, 
    StyleSheet,
    Dimensions,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StatusBar,
    Modal,
    Pressable,

} from 'react-native';

import { Logar } from '../Models/UserServerModel';
import { AuthContext } from '../Contexts/auth';
import InfosLoginModel from '../Models/InfosLoginModel';

import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import { checkUpdate, getVersao } from 'versionamento-push'


const Login = ({navigation, route}) => {

    

    const [ loading, setLoading ] = useState(false)
    const img2 = require("../../assets/pulse.gif")

    const  imgLogo = require('../../assets/logoGem.png');
   
    const [ seguret, setSeguret ] = useState(true)
    const [ versao, setVersao] =  useState('') 

    const [ login, setLogin ] = useState("")
    const [ senha, setSenha ] = useState('')
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ msg, setMsg ] = useState('')


    const [ visionIcon, setVision ] = useState('eye-slash')

    const { setUser } = useContext( AuthContext )



    useEffect(() => {
       
        checkUpdate()
        inicializar()
        //  Logar().then((res) => {
        //     console.log(res)
        //  })
    },[])

    const  inicializar = async () => {

        // const versaoApp = await getVersao()
        // console.log(versaoApp)

        await getVersao().then((res) => {
            
            setVersao(res.titulo)

        }).catch((e) => {
            console.log(e)
        })
       
        
        
        const res = UserModels.buscausuraio()

        const res2 = InfosLoginModel.buscaInfosLogin()
        
        if(res2.length > 0){
            setLogin(res2[0].login)
            setSenha(res2[0].senha)
        }
        
    }

    const vision = () =>{

        if(visionIcon == 'eye'){

            setVision('eye-slash')
            setSeguret(true)

        }else{

            setVision('eye') 
            setSeguret(false)
            
        }

    }

    const LogarF = () => {
        
        if(login.trim() == ""){
            setMsg("Login é obrigatorio")
            setModalVisible(true)
            return
        }

        if(senha.trim() == ""){
            setMsg("Senha é obrigatoria")
            setModalVisible(true)
            return
        }
        setLoading(true)
        Logar(login.trim(),senha.trim()).then((res) => {
            console.log("res",res)
            setLoading(false)
            if(res.erro == true){
                setMsg(res.valor)
                setModalVisible(true)
                return
            }

            UserModels.salvarUsuario(res.valor.ID, res.valor.Nome)
            InfosLoginModel.salvarInfos(login.trim(),senha.trim())

            setUser(res.valor)
            return  navigation.navigate('Index')

        }).catch((e) => {
            console.log("e",e)
            setLoading(false)

        })
    }

    const redirecionarSetings = () => {

        setModalVisible(!modalVisible)

    }

    return (
        <View style={styles.container}>
            
            <StatusBar
				animated={true}
				backgroundColor={"#4a4a4a"}
			/>
            <View style={{flex:1, width:windowWidth, alignItems:"center", justifyContent:"center", backgroundColor:"#4a4a4a"}}>
                <View style={{flex:1, alignItems:"center", justifyContent:"center",}}>
                    <View style={ styles.viewImag}>
                        <Image
                            style={[ styles.img, { resizeMode:'contain' } ]}
                            source={imgLogo}
                           
                        />
                    </View>

                    <View style={ styles.viewInput }>
                        <View style={{  alignItems:'center',position: 'absolute',marginTop:13,marginLeft:10,  zIndex:999}}>
                            <Icon name="user-alt" size={18} color="rgba(0, 0, 0, 0.6)"></Icon>
                        </View>
                        <TextInput
                            placeholder="Login"
                            style={ styles.input}
                            value={login}
                            onChangeText={ (e) => setLogin(e) }
                            placeholderTextColor="rgba(0, 0, 0, 0.6)"
                            autoCapitalize="none"
                            editable={true}
                        />
                    </View>

                    <View style={ styles.viewInput }>
                        <View style={{  alignItems:'center',position: 'absolute',marginTop:13,marginLeft:10,  zIndex:999}}>
                            <Icon name="lock" size={20} color="rgba(0, 0, 0, 0.6)"></Icon>
                        </View>
                        <TouchableOpacity onPress={() => vision()} style={{  alignItems:'center',position: 'absolute',marginTop:10,right:10,  zIndex:999}}>
                            <Icon name={visionIcon} size={20} color="rgba(0, 0, 0, 0.6)"></Icon>
                        </TouchableOpacity>
                        <TextInput
                            placeholder="Senha"
                            style={ styles.inputSenha}
                            value={senha}
                            placeholderTextColor="rgba(0, 0, 0, 0.6)"
                            secureTextEntry={seguret}
                            onChangeText={ (e) => setSenha(e) }
                            editable={true}
                            autoCapitalize="none"
                        />
                        
                    </View>
                    <View style={{flex:1, alignItems:"center", marginTop:40}}>
                        {
                            loading ? (
                                <Image
                                    style={styles.img2}
                                    source={img2}
                                />
                            ) : 
                            (
                                <TouchableOpacity style={styles.btnLogin} onPress={() => LogarF()}>
                                    {/* <Text style={{ color:"#0F2A33", fontWeight:"bold" }}>Entrar</Text> */}
                                    <Text style={{ color:"#FFF", fontWeight:"bold" }}>Entrar</Text>
                                </TouchableOpacity>
                            )
                        }
                            
                        
                    </View>

                </View>
               

            </View>
            <View style={
                { 
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 15,
                    textAlign: 'center',    
                    justifyContent: "center",
                }
            }>
                <Text style={{ fontSize:10, color:"#fff", textAlign: 'center', paddingTop: 20}}>{versao}</Text>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{msg}</Text>
                        <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => redirecionarSetings()}
                        >
                            <Text style={styles.textStyle}>OK</Text>
                        </Pressable>
                    </View>
                </View>
            
            </Modal>
        </View>
    )

}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

let heightImage = 300

if(windowHeight < 600){

    heightImage = 180
    
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center',
        width: windowWidth,
        
    },
    viewInput:{
        marginTop:10,
        marginBottom:10,
        flexDirection:"row"
    },
    viewImag:{
        //justifyContent: 'center',
        alignItems:'center',
        borderRadius:10,
        
    },
    img:{
        marginTop:70,
        
        height:heightImage,
        marginBottom:30,
        //borderRadius:20
    },
    img2:{
        width:60,
        height:50,
        
    },
    input:{ 
        backgroundColor: '#4a4a4a', 
        color: '#fff', // Cor do texto
        width: windowWidth-90,
        borderRadius:5,
        paddingLeft:45,
        height:45,
        borderWidth: 1,
        borderColor: '#707070', 
        elevation:5,
        
    },
    inputSenha:{
        backgroundColor: '#4a4a4a', 
        color: '#fff', // Cor do texto
        width: windowWidth-90,
        borderRadius:5,
        paddingLeft:45,
        paddingRight:55,
        height:45,
        borderWidth: 1,
        borderColor: '#707070', 
        elevation:5,
        
    },
    btnLogin:{
        width:windowWidth-90,
        height: 45,
        backgroundColor: "#f0660a",
        justifyContent: 'center',
        alignItems:'center',
        marginTop:20,
        borderRadius:5,
        elevation:5
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color:"#000"
    }
})

export default Login