import React, { useState, useMemo,useEffect }  from 'react';

import { 
    Text,
    View,
    TextInput,
    Dimensions,
    StyleSheet,
    Keyboard,
    Modal,
    FlatList,
    TouchableOpacity
} from "react-native"

import { SalvaVendaServer } from "../Models/ProdutosServerModel"
import RadioGroup from 'react-native-radio-buttons-group';
import TabelaPagamentos from '../Components/TabelaPagamentos';
import Botao from '../Components/Botao';
import ModalMsg from '../Components/ModalMsg';
import { formatMoney } from '../Controller/Funcoes/Geral';
import { buscaVendedores } from '../Models/UserServerModel';
import moment from 'moment';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';


const TelaPagamentos = ({route, navigation}) => {
    
    const [ pagamento, setPagamento ] = useState([])
    const [ selectedId, setSelectedId] = useState();
    const [ valor ,setvalor ] = useState(route.params.valorTotal)
    const [ valorTotalPago, setvalorTotalPago ] = useState(0.0)
    const [ msg, setMsg ] = useState("")
    const [ modalMsgAberto, setModalMsgAberto ] = useState(false)
    const [ valorValtante, setValorValtante ] = useState(route.params.valorTotal)
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [ modalVendedore, setModalVendedore] = useState(false);
    const [ vendedores, setVendedores ] = useState([])
    const [ modalSalvoSucesso, setModalSalvoSucesso] = useState(false)
    const [ venda, setVenda ] = useState(undefined)
    const user = route.params.user
    const valorCobrar = route.params.valorTotal
    const itensBag = route.params.itensBag

    const [ vendedor, setVendedor ] = useState({
        _id:user.ID,
        nome:user.Nome
    })

    const handleKeyboardDidShow = (event) => {
        
        setKeyboardHeight(-160);
    };
  
    const handleKeyboardDidHide = () => {
        
        setKeyboardHeight(0);
    };

    const listagemProdutos = (orcamento) => {
        let he = ''
       
        orcamento.map((item) => {
            he += `
            
                <tr style="width:100%; height:40px">

                    
                    <td >${item.produtoNome}</td>
                

                
                    <td >${item.qtd}</td>
                

                
                    <td >R$ ${item.valorUnitario.toFixed(2).toString().replace(".",",")}</td>
                

                
                    <td >${item.desconto}</td>
                

                
                    <td >R$ ${item.valorTotal.toFixed(2).toString().replace(".",",")}</td>
                    

                </tr>
            `
            
        })

        
        return he
    }

    const criaHTMLPdf = async (itens) => {

        let h = `
            <div style="display:flex; align-items:center; flex-direction:column; width:100%; height:100%">
                <div style=" display:flex; flex-direction:row; width:98%">
                  
                    <div style=" width:200px; height:200px ">
                        <img src='https://i.imgur.com/9Hv8LYj.png' width="200px" height="200px"/>
                    </div>
                    <div style="display:flex; align-items:center; justify-content:center; height: 200px; width:40%; font-size:30px"> 
                        
                        G & M Moto Pecas
                       
                       
                    </div>
                    <div style="display:flex; align-items:center; justify-content:center; height: 200px; font-size:15px; flex-direction:column">
                        <div>
                            CNPJ 55.744.795/0001-34
                        </div>
                        <div>
                            Contato (11) 9 6564-0477
                        </div>
                    </div>
                    
                </div>
                <div style="display:flex; align-items:center; justify-content:center;width:100%; height:50px; margin-top:20px">
                    <div style="display:flex; align-items:center; justify-content:center; width:98%; height:60px; font-size:40px; background-color:#4a4a4a; color:#fff">
                        Venda Nº ${venda.vendaId}
                    </div>
                </div>
                <div style="  width:98%; margin-top:20px; ">
                    
                    <div>
                        Data da venda: ${moment().format("DD/MM/YYYY")}
                    </div>
                     <div>
                        Vendedor: ${vendedor.nome}
                    </div>
                    
                </div>
                <div style="  width:98%; margin-top:20px; ">
                    <table style="  width:100%; ">
                        <thead >
                            <tr style="background-color:rgba(50,50,50,0.3); height:40px">
                                <td>
                                    Produto
                                </td>
                                <td>
                                    
                                    Qtd
                                    
                                </td>
                                <td>
                                    Val. Uni.
                                </td>
                                <td>
                                    Desc. (%)
                                </td>
                                <td>
                                    Val. Tot.
                                </td>
                            </tr>
                        </thead>
                        <tbody>

                            ${listagemProdutos(itens)}
                        
                        </tbody>
                        <tfoot>
                            <tr style=" height:40px">
                                <td scope="row" colspan=4>Total venda</td>
                                <td style="font-weight:Bold">R$ ${venda.valor.toFixed(2).toString().replace(".",",")}</td>
                            </tr>
                        </tfoot>
                    </table>
                    
                </div>
            </div>
        `;
        
        return h
    } 
    
    const gerarNota = async (itensBag) => {
        
        
        try{
            const options = {
                html: await criaHTMLPdf(itensBag),
                fileName: 'GeM_moto_pecas_orcamento_'+venda.vendaId+"_"+moment().format("DDMMYYYYHm"),
                directory: 'Documents',
            };

            const file = await RNHTMLtoPDF.convert(options);
            
            
            const shareOptions = {
                title: 'Compartilhar PDF',
                message: 'Confira este PDF!',
                url: "file://"+file.filePath,
                type: 'application/pdf',
            };
            
            Share.open(shareOptions).then((res) => {
                voltarLimparBag()
                console.log('Compartilhado com sucesso:', res);

            }).catch((err) => {

                console.log('Erro ao compartilhar:', err);

            });

        } catch (error) {
          console.log('Erro ao gerar PDF:', error);
        }
    }
    

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
        Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);
        if(user.Nome == "Vinicius Kiritschenco Costa"){
            buscaVendedores().then((res) => {
                if(res.erro == false){
                    setVendedores(res.valor)
                }
            })
        }
        
     
    }, []);
    
    

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
            userId:vendedor._id,
            tipoVenda:"local",
            user:vendedor.nome,
            status:"finalizado",
            pagamento:pagamento,
            produtos:itensBag,
            valor:parseFloat(valorCobrar.replace(",",".")).toFixed(2)
        }


        SalvaVendaServer(jsonFinalizar).then(( re ) => {

            if(re.erro == false){

                setVenda(re.valor)
                setMsg("Venda finalizada com sucesso")
                setModalSalvoSucesso(true)
                

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

    const abrirModalVendedores = () => {
        setModalVendedore(true)
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
            <View style={styles.infosVendedor}>
                <View >
                    <Text  style={ {color:"#fff"}}>Venda realizada para o vendedor:  {vendedor.nome}</Text>
                </View>
                
            </View>
                {
                    user.Nome == "Vinicius Kiritschenco Costa" && (
                        <View style={{marginTop:15}}>
                            <Botao 
                                label="Troca vendedor"
                                callback={() => {
                                    abrirModalVendedores()
                                    
                                }}
                                backgroundColor="grey"
                                color='#fff'
                            
                            />
                        </View>
                    )
                }
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalSalvoSucesso}
            >
                <View style={styles.centeredView}>

                    <View style={styles.modalViewNota}>
                        
                        <View style={{ height:150,  alignItems:"center", justifyContent:"center"}}>
                            <Text style={{ fontSize:20, fontWeight:"bold"}}>{msg}</Text>
                        </View>
                       

                        <View style={{  width:windowWidth-108, height:150}}>
                            <View style={{ marginTop:0}}>
                                <Botao 
                                    label="Gerar nota"
                                    color='#fff'
                                    callback={() => {
                                        setModalSalvoSucesso(false)
                                        gerarNota(itensBag)
                                    }}
                                    backgroundColor='#f0660a'
                                />
                            </View>
                            <View style={{ marginTop:10}}>
                                <Botao 
                                    label="Finalizar"
                                    color='#fff'
                                    callback={() => {
                                        setModalSalvoSucesso(false)
                                    voltarLimparBag()
                                    }}
                                    backgroundColor='#13a303'
                                />
                            </View>

                            
                        </View>
                      
                    
                    </View>
                </View>
            
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVendedore}
            >
                <View style={styles.centeredView}>

                    <View style={styles.modalView}>
                        
                        
                        <FlatList 
                            data={vendedores}
                            renderItem={({item}) => {
                                return (
                                    <TouchableOpacity onPress={() => { 
                                        setVendedor(item)
                                        setModalVendedore(false)
                                    }}
                                        style={{ flex:1, alignItems:"center", justifyContent:"center", height:40, marginBottom:2, marginTop:2, width:windowWidth-110, borderWidth:0.5, borderColor:"blue"  }}
                                    >
                                        <Text style={{color:"#000"}}>{item.nome}</Text>
                                    </TouchableOpacity>
                                )
                            }}
                        />

                    
                        <View style={{  width:windowWidth-108, height:60}}>
                            <View style={{ marginTop:10}}>
                                <Botao 
                                    label="Cancelar"
                                    color='#fff'
                                    callback={() => setModalVendedore(false)}
                                    backgroundColor='#ff001e'
                                />
                            </View>

                            
                        </View>
                    
                    </View>
                </View>
            
            </Modal>
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
    infosVendedor:{
        width:windowWidth-20
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"rgba(50,50,50,0.8)"
        // marginTop: 22,
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
        height:windowHeight -50
    },
    modalViewNota: {
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
        height:300
    },
})
export default TelaPagamentos