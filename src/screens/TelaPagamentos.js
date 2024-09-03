import React, { useState, useMemo,useEffect }  from 'react';

import { 
    Text,
    View,
    TextInput,
    Dimensions,
    StyleSheet,
    Keyboard
} from "react-native"

import { SalvaVendaServer } from "../Models/ProdutosServerModel"
import RadioGroup from 'react-native-radio-buttons-group';
import TabelaPagamentos from '../Components/TabelaPagamentos';
import Botao from '../Components/Botao';
import ModalMsg from '../Components/ModalMsg';
import { formatMoney } from '../Controller/Funcoes/Geral';

const TelaPagamentos = ({route, navigation}) => {
    
    const [ pagamento, setPagamento ] = useState([])
    const [ selectedId, setSelectedId] = useState();
    const [ valor ,setvalor ] = useState(route.params.valorTotal)
    const [ valorTotalPago, setvalorTotalPago ] = useState(0.0)
    const [ msg, setMsg ] = useState("")
    const [ modalMsgAberto, setModalMsgAberto ] = useState(false)
    const [ valorValtante, setValorValtante ] = useState(route.params.valorTotal)
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const handleKeyboardDidShow = (event) => {
        
        setKeyboardHeight(-160);
    };
  
    const handleKeyboardDidHide = () => {
        
        setKeyboardHeight(0);
    };
  
    useEffect(() => {
      Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
      Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);
  
     
    }, []);
    
    const valorCobrar = route.params.valorTotal
    const user = route.params.user
    const itensBag = route.params.itensBag
    

    const radioButtons = useMemo(() => ([
        {
            id: '1', 
            label: 'Pix',
            value: 'pix',
            color:"#f0660a",
            labelStyle:{ color: "#fff", fontWeight:"bold"}
        },
        {
            id: '2',
            label: 'Dinheiro',
            value: 'dinheiro',
            color:"#f0660a",
            labelStyle:{ color: "#fff", fontWeight:"bold"}
        },
        {
            id: '3',
            label: 'Débito',
            value: 'debito',
            color:"#f0660a",
            labelStyle:{ color: "#fff", fontWeight:"bold"}
        },
        {
            id: '4',
            label: 'Crédito',
            value: 'credito',
            color:"#f0660a",
            labelStyle:{ color: "#fff", fontWeight:"bold"}
        }
    ]), []);

    

    const finalizar = (pagamento) => {

        const jsonFinalizar = {
            userId:user.ID,
            tipoVenda:"local",
            user:user.Nome,
            status:"finalizado",
            pagamento:pagamento,
            produtos:itensBag,
            valor:parseFloat(valorCobrar.replace(",",".")).toFixed(2)
        }


        SalvaVendaServer(jsonFinalizar).then(( re ) => {
           
            if(re.erro == false){

                setMsg("Venda finalizada com sucesso")
                setModalMsgAberto(true)

            }else{

                setMsg(re.valor)
                setModalMsgAberto(true)

            }

        }).catch(() => {

            setMsg("Erro ao finalizar venda")
            setModalMsgAberto(true)

        })


    }

    const voltar = () => {
        navigation.goBack()
    }

    const voltarLimparBag = () => {
        return  navigation.navigate('Index', {limparBag:true})
    }

    const limpaVar = () => {
        setPagamento([])
        setSelectedId();
        setvalor(valorCobrar)
        setvalorTotalPago(0.0)
        setValorValtante(valorCobrar)
    }

    const adicionarPagamento = () => {
        
        let p = pagamento
        const metodo = radioButtons.find(el => el.id == selectedId)
        p.push({
            metodo:metodo.value,
            valor:parseFloat(valor.replace(",","."))
        })
      
        setvalorTotalPago(valorTotalPago + parseFloat(valor.replace(",",".")))
        let calculo = parseFloat(valorCobrar.replace(",",".")) - (parseFloat(valor.replace(",","."))+valorTotalPago)

        setPagamento(p)
        setSelectedId()
        setvalor(`${calculo.toFixed(2)}`.replace(".",","))
        setValorValtante(`${calculo.toFixed(2)}`.replace(".",","))
    }

    const finaliza = () => {

        let p = pagamento
        const metodo = radioButtons.find(el => el.id == selectedId)
        p.push({
            metodo:metodo.value,
            valor:parseFloat(valor.replace(",","."))
        })
      
        limpaVar()
       
       
        finalizar(p)

    }

    const msgValor = () => {
        if(parseFloat(valor.replace(",",".")) > parseFloat(valorCobrar.replace(",","."))){
            
            return (
                <Text style={{color:"red"}}>O valor cobrado é maior que o valor da compra</Text>
            )
        }
    }

    const Botoes = () => {

        if(selectedId == undefined && valorTotalPago != parseFloat(valorCobrar.replace(",","."))){
            return
        }
        
        if(parseFloat(valor.replace(",",".")) > parseFloat(valorCobrar.replace(",","."))){
            
            return 
        }

        

        if(parseFloat(valor.replace(",",".")) < parseFloat(valorCobrar.replace(",",".")) && valorTotalPago + parseFloat(valor.replace(",",".")) == parseFloat(valorCobrar.replace(",","."))){
            return(
                <View style={{ marginTop:15}}>
                    <Botao 
                        label="Finalizar"
                        callback={() => {
                            finaliza()
                        }}
                        backgroundColor="#13a303"
                        color='#fff'
                    
                    />
                    
                </View>
            )
        }

        

        if(parseFloat(valor.replace(",",".")) == parseFloat(valorCobrar.replace(",","."))){
            return(
                <View style={{ marginTop:15}}>
                    <Botao 
                        label="Finalizar"
                        callback={() => {
                            finaliza()
                        }}
                        backgroundColor="#13a303"
                        color='#fff'
                    
                    />
                    
                </View>
            )
        }
       

        if(parseFloat(valor.replace(",",".")) < parseFloat(valorCobrar.replace(",","."))){
            return(
                <View style={{ marginTop:15}}>
                    <Botao 
                        label="Adicionar pagamento"
                        callback={() => {
                            adicionarPagamento()
                        }}
                        backgroundColor="#2196F3"
                        color='#fff'
                    
                    />
                   
                </View>
            )
        }


    }
    
    return (
        <View style={styles.container}>

            <View style={ [ styles.subContainerMenor, {  bottom: keyboardHeight}] }>
                <View style={{ marginTop: 10, marginBottom:10 }}>
                    <Text style={{ fontSize:18, fontWeight:"bold", color:"#fff"}}>O valor total a ser cobrado é de R${valorCobrar}</Text>
                </View>
                <View style={{ marginTop: 10, marginBottom:10 }}>
                    <Text style={{ fontSize:18, fontWeight:"bold", color:"#fff"}}>O valor restante a ser cobrado é de R${valorValtante}</Text>
                </View>
            </View>

            <View style={[styles.subContainer, {  bottom: keyboardHeight}]}>
                <View>
                    <RadioGroup 
                        borderColor="#fff"
                        color="#FFF"
                        layout="row"
                        radioButtons={radioButtons} 
                        onPress={setSelectedId}
                        selectedId={selectedId}
                    />
                </View>
                
                <View style={{   height:90}}>
               
                    <View style={{ alignItems:"center", justifyContent:"center", height:30}}>
                        { 
                            msgValor()
                        }
                        
                    </View>
               
                    <TextInput 
                        style={ styles.input}
                        onChangeText={(t) => setvalor(formatMoney(t))}
                        value={valor}
                        keyboardType='numeric'
                    />
                </View>
               
            </View>

            <View style={[styles.subContainer, {  bottom: keyboardHeight}]}>
                <TabelaPagamentos 
                    pagamentos={pagamento}
                />
            </View>
            
            <View style={[styles.subContainer, {  bottom: keyboardHeight}]}>
                {
                    Botoes()
                }
                <View style={{marginTop:15}}>
                    <Botao 
                        label="Cancelar"
                        callback={() => {
                            limpaVar()
                            voltar()
                        }}
                        backgroundColor="red"
                        color='#fff'
                    
                    />
                    
                </View>
            </View>

            <ModalMsg 
                modalAberto={modalMsgAberto}
                msg={msg}
                fechaModal={() => { 
                    setModalMsgAberto(false)
                    voltarLimparBag()
                }} 
            />
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
        backgroundColor:"#4a4a4a"
    },
    subContainer:{
        height: windowHeight/4,
        alignItems:"center",
        justifyContent:"center"
    },
    subContainerMenor:{
        height: windowHeight/8,
        alignItems:"center",
        justifyContent:"center"
    },
    input: {
        backgroundColor: '#4a4a4a', 
        color: '#fff', // Cor do texto
        padding: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#707070', // Cor da borda
        width: windowWidth-90,
        elevation:5
    },
    input2:{ 
        backgroundColor:"#fff",
        width: windowWidth-90,
        borderRadius:5,
        paddingLeft:45,
        height:45,
        color:"rgba(0, 0, 0, 0.6)"
    },
})
export default TelaPagamentos