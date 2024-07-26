import React, { useState }  from 'react';
import {
	ScrollView,
	StyleSheet,
	View,
	Image,
	Text,
    Modal,
    Pressable,
    Dimensions,
    TextInput
} from 'react-native';

const ModalConfirmarAdicionarProduto = ({modalAberto, item, fechaModal, callbackAdicionar}) => {

    if(typeof item == "undefined" || item.nome == "undefined"){
        return

    }

    const [ qtd, setqtd ] = useState(0)
    const [ desconto, setDesconto ] = useState(0)
    const [ total, setTotal ] = useState("0,00")
    const [ msg, setMsg ] = useState("")
    const [ disabilitado, setDisabilitado ] = useState(false)


    let preco = `${item.valorVenda.toFixed(2)}`

    preco = preco.replace('.', ',')

    function calcularDesconto(valor, porcentagemDesconto) {
        // Calcula o valor do desconto
        const valorDesconto = (valor * porcentagemDesconto) / 100;
      
        // Subtrai o desconto do valor original
        const valorDescontado = valor - valorDesconto;
      
        // Retorna o valor descontado
        return valorDescontado;
    }

    const atualizarQtd = (qtd2) => {
        if(qtd2 == ""){
            qtd2 = 0
        }


        if(qtd2 > item.estoque && item.tipo != "servico"){
            setMsg("A quantidade é maior que o estoque atual")
            setqtd(0)
            setDisabilitado(true)
            setTotal("0,00")
            return
        }
        setDisabilitado(false)
        setMsg("")
        setqtd(qtd2)

        const t = parseFloat(preco.replace(',', '.'))*qtd2

        let precoT = calcularDesconto(t, desconto)
        precoT = `${precoT.toFixed(2)}`

        precoT = precoT.replace('.', ',')
        setTotal(precoT)
        
    }

    const atualizarDesconto = (desc) => {
        
        if(desc == ""){
            desc = 0
        }

        
        if(desc > item.descontoMaximo){
            setMsg("O valor do desconto é maior que o permitido")
            setDesconto(0)
            setDisabilitado(true)
            setTotal("0,00")
            return
        }
        setDisabilitado(false)
        setMsg("")
        setDesconto(desc)

        const t = parseFloat(preco.replace(',', '.'))*qtd

        let precoT = calcularDesconto(t, desc)
        precoT = `${precoT.toFixed(2)}`

        precoT = precoT.replace('.', ',')
        setTotal(precoT)
        
    }

    const adicionar = () => {
        const json = {
            produtoId:item._id,
            produtoNome:item.nome,
            qtd:qtd,
            valorUnitario:item.valorVenda,
            valorTotal: parseFloat(total.replace(',', '.')),
            desconto:desconto,
            tipo:item.tipo
        }
        setTotal("0,00")
        setDesconto(0)
        setqtd(0)
        callbackAdicionar(json)
    }

    return(
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalAberto}
        >
            <View style={styles.centeredView}>

                <View style={styles.modalView}>
                    
                    
                    <ScrollView>
                        <View style={styles.viewInfo}>
                            <View style={{ marginBottom:10 }}>
                                <Text style={{fontWeight:"bold", color:"#000", fontSize:22}}>{item.nome}</Text>
                            </View>
                          
                            <View style={{ marginBottom:40, marginTop:10}}>
                                <View style={{  flexDirection:'row', marginBottom:10 }}>
                                    <View style={{width: (windowWidth-108)/2,}}>
                                        <Text style={{fontWeight:"bold" , color:"#000", fontSize:18 }}>Valor:</Text>
                                        <Text style={{fontWeight:"bold" , color:"#000", fontSize:18 }}> R$ {preco}</Text>
                                    </View>
                                    {
                                        item.tipo != "servico" && (
                                            <View style={{width: (windowWidth-108)/2,}}>
                                                <Text style={{fontWeight:"bold", color:"#000" , fontSize:18}}>Estoque: </Text>
                                                <Text style={{fontWeight:"bold", color:"#000" , fontSize:18}}>{item.estoque}</Text>
                                            </View>
                                        )
                                    }
                                    
                                </View>
                                

                                <View
                                    style={{
                                        borderBottomColor: 'black',
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                    }}
                                />
                                
                            </View>
                           

                           
                            <View style={{ marginBottom:10, marginTop:10, flexDirection:"row" }}>
                                 <View style={{width: (windowWidth-112)/2, marginRight:2}}>
                                    <Text style={{fontWeight:"bold", color:"#000"}}>Quantidade</Text>
                                    <TextInput 
                                        style={{
                                            borderBottomColor: 'black',
                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                            color:"rgba(0, 0, 0, 0.6)"
                                        }}
                                        keyboardType = 'numeric'
                                        onChangeText = {(text)=> { atualizarQtd(text)}}
                                        value = {qtd}
                                        placeholderTextColor="rgba(0, 0, 0, 0.6)"
                                    />
                                </View>
                                <View style={{width: (windowWidth-112)/2, marginLeft:2}}>
                                    <Text style={{fontWeight:"bold", color:"#000"}}>Desconto (%)</Text>
                                    <TextInput 
                                        style={{
                                            borderBottomColor: 'black',
                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                            color:"rgba(0, 0, 0, 0.6)"
                                        }}
                                        keyboardType = 'numeric'
                                        onChangeText = {(text)=> atualizarDesconto(text)}
                                        value = {desconto}
                                        placeholderTextColor="rgba(0, 0, 0, 0.6)"
                                        
                                    />
                                </View>
                            </View>

    
                            <View style={{ marginBottom:10, marginTop:10,}}>
                                <View style={{width: (windowWidth-108) }}>
                                    <Text style={{fontWeight:"bold",color:"#000", fontSize:30}}>Total: R$ {total}</Text>
                                </View>
                            </View>
                            

                        </View>
                        
                    </ScrollView>

                    <View>
                        <Text style={{ fontSize:15, color:"red"}}>{msg}</Text>
                    </View>
                
                    <View style={{  width:windowWidth-108, height:100}}>
                        <View >
                            <Pressable
                                style={styles.buttonAdicionar}
                                onPress={() => adicionar()}
                                disabled={disabilitado}
                            >
                                <Text style={styles.textStyle}>Adicionar</Text>
                            </Pressable>
                        </View>

                        <View>
                            
                            <Pressable
                                style={styles.buttonCancelar}
                                onPress={() => fechaModal()}
                            >
                                <Text style={styles.textStyle}>Cancelar</Text>
                            </Pressable>
                        </View>

                        
                    </View>
                   
                </View>
            </View>
        
        </Modal>
    )

}


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
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
        elevation: 5,
        height:(windowHeight/5)*3
    },
    viewImgInfo:{
        height:windowWidth-108,
		justifyContent:"center",
		width: windowWidth-108,
        marginBottom:10
    },
    imgInfo:{
        height:windowWidth-108,
        width: windowWidth-108,
		
        resizeMode: 'stretch',
		borderRadius:10
    },
    viewInfo:{
		
        width:windowWidth-108,
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    buttonCancelar: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop:10,
        alignItems:"center",
        backgroundColor: "#ff001e",
    },
    buttonAdicionar: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop:10,
        alignItems:"center",
        backgroundColor: "#05ad02",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        color:"#000",
    },
})

export default ModalConfirmarAdicionarProduto