import React, { useState, useMemo,useEffect,useRef }  from 'react';

import { 
    Text,
    View,
    TextInput,
    Dimensions,
    StyleSheet,
    Keyboard,
    Modal,
    FlatList,
    TouchableOpacity,
    Alert,
    Image
} from "react-native"
import Icon from 'react-native-vector-icons/dist/FontAwesome5';

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
import api from '../Api/api';
import GifPagamentoRegeitado from '../Components/GifPagamentoRegeitado';
import GifPagamentoAceito from '../Components/GifPagamentoAceito';
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
    const [ cliente, setCliente ] = useState({})
    const [ existeFaturado, setExisteFaturado ] = useState(false)
    const [ modalCliente, setModalCliente] = useState(false)
    const [ varBuscaClientes, setVarBuscaCliente ] = useState("")
    const [ clientesListagem, setClientesListagem ] = useState([])
    const [carregando, setCarregando] = useState(false);
    const [ modalPerguntaPixAberto, setModalPerguntaPixAberto] = useState(false);
    const [ valorGerarQRPix, setValorGerarQRPix] = useState(0.00);
    const [ modalQrCodeAberto, setModalQrCodeAberto] = useState(false);
    const [ qr_code_base64, setQr_code_base64] = useState("");
    const [ transacaoId, setTransacaoId] = useState();
    const [ mostraErroPagamentoGif, setMostraErroPagamentoGif] = useState(false);
    const [ mostraPagamentoGif, setMostraPagamentoGif] = useState(false);


    const controllerBuscaCliente = useRef<AbortController | null>(null);
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

    const gerarQrCode = () => {

        api.post("/pagamento/pix/qrcode",{valor: valorGerarQRPix}).then((res) => {

            if(typeof res != "undefined" && typeof res.data != "undefined" && typeof res.data.point_of_interaction != "undefined" && typeof res.data.point_of_interaction.transaction_data != "undefined" && typeof res.data.point_of_interaction != "undefined" && typeof res.data.point_of_interaction.transaction_data.qr_code_base64 != "undefined"){
                
                setTransacaoId(res.data.id)
                setQr_code_base64(res.data.point_of_interaction.transaction_data.qr_code_base64)
                setModalQrCodeAberto(true)

            }

            
        }).catch( (e) => {
            Alert.alert("Erro:", JSON.stringify(e.message))
        })

    }

    const confirmarPagamento = () => {

        api.post("/pagamento/status",{id: transacaoId}).then((res) => {

            if(typeof res != "undefined" && typeof res.data != "undefined" && typeof res.data.point_of_interaction != "undefined" && typeof res.data.point_of_interaction.transaction_data != "undefined" && typeof res.data.point_of_interaction != "undefined" && typeof res.data.point_of_interaction.transaction_data.qr_code_base64 != "undefined"){
               
                console.log("status", res.data.status)

            }
            
        }).catch( (e) => {

            Alert.alert("Erro:", JSON.stringify(e.message))

        })

    }
  
    const handleKeyboardDidHide = () => {
        
        setKeyboardHeight(0);
    };

    const buscarClientes = () => {

        if (controllerBuscaCliente.current) {

            controllerBuscaCliente.current.abort();

        }

        const controller = new AbortController();
        controllerBuscaCliente.current = controller;

        setCarregando(true);

        api.get(`/user-buscar?search=${varBuscaClientes}&userid=${user.ID}`,{
            signal:controller.signal
        }).then((res) => {

            setClientesListagem(res.data.valor)

        }).finally(() => {

            setCarregando(false);

        }) 
    }

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
                fileName: 'GeM_moto_pecas_venda_'+venda.vendaId+"_"+moment().format("DDMMYYYYHm"),
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
                voltarLimparBag()
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
    const radioButtons1 = useMemo(() => ([
        
        {
            id: '5',
            label: 'Faturado',
            value: 'faturado',
            color:"#f0660a",
            labelStyle:{ color: "#fff", fontWeight:"bold"}
        }
    ]), []);

    const selecionaCliente = (cliente) => {
        setCliente(cliente)
        setModalCliente(false)
    }


    const abreModalPerguntaPix = () => {

        setModalPerguntaPixAberto(true)
        
    }
    

    const finalizar = (pagamento) => {


        return
        if(existeFaturado && typeof cliente._id == "undefined"){

            setMsg("O Cliente é obrigatorio para faturar.")
            setModalMsgAberto(true)
            return

        }
       
        const jsonFinalizar = {
            userId:vendedor._id,
            tipoVenda:"local",
            user:vendedor.nome,
            status:"finalizado",
            pagamento:pagamento,
            produtos:itensBag,
            valor:parseFloat(valorCobrar.replace(",",".")).toFixed(2),
            clienteId:cliente._id
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

        }).catch((e) => {
            console.log(e)
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

        let formasPagamentos = [ ... radioButtons, ... radioButtons1]

        let p = pagamento
        const metodo = formasPagamentos.find(el => el.id == selectedId)
       
        if(metodo.value == "faturado"){
            setExisteFaturado(true)
        }

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

    const finaliza = (validarPix = true) => {

        let formasPagamentos = [ ... radioButtons, ... radioButtons1]

        let p = pagamento

        const metodo = formasPagamentos.find(el => el.id == selectedId)

        p.push({
            metodo:metodo.value,
            valor:parseFloat(valor.replace(",","."))
        })
      
        limpaVar()

        if( validarPix){
            const pagamentosPix = p.filter(el => el.metodo == "pix")

            if(pagamentosPix.length > 0){
                const soma = p.reduce((total, item) => total + item.valor, 0);
                setValorGerarQRPix(soma)
                abreModalPerguntaPix()
                return
            }
            
        }
       
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
                        backgroundColor="#28a745"
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
                        backgroundColor="#d39e00"
                        color='#fff'
                    
                    />
                   
                </View>
            )
        }


    }

    const adicionarCliente = () => {
        setModalCliente(true)

    }

    const abrirModalVendedores = () => {
        setModalVendedore(true)
    }
    const removerCliente = () => {
        setCliente({})
    }
    return (
        <View style={styles.container}>
                        <Botao 
                                    label="Cancelar"
                                    color='#fff'
                                    callback={() =>  setMostraPagamentoGif(true)}
                                    backgroundColor='#ff001e'
                                />
            <View style={ [ styles.subContainerMenor, {  bottom: keyboardHeight}] }>
                <View style={{ marginTop: 5, marginBottom:5 }}>
                    <Text style={{ fontSize:14, fontWeight:"bold", color:"#fff"}}>Valor total a ser cobrado é de R${valorCobrar}</Text>
                </View>
                <View style={{ marginTop: 5, marginBottom:5 }}>
                    <Text style={{ fontSize:14, fontWeight:"bold", color:"#fff"}}>Valor restante a ser cobrado é de R${valorValtante}</Text>
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
                <View>
                    <RadioGroup 
                        borderColor="#fff"
                        color="#FFF"
                        layout="row"
                        radioButtons={radioButtons1} 
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
                typeof cliente._id != "undefined" && (
                    <View style={styles.infosCliente}>
                        <View style={{ width: windowWidth-75}} >
                            <Text  style={ {color:"#fff"}}>Cliente:  {cliente.nome}</Text>
                        </View>
                        <View >
                            <TouchableOpacity onPress={() => removerCliente()} style={{width:"20px"}}>
                                <Icon name="trash-alt" size={18} color="red" />
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                )
            }
            
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
            <View style={[styles.botoes, {  bottom: keyboardHeight}]}>
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
                {
                    typeof cliente._id == "undefined" && (
                        <View style={{marginTop:15}}>
                            <Botao 
                                label="Adicionar cliente"
                                callback={() => {
                                    adicionarCliente()
                                    
                                }}
                                backgroundColor="#007bff" 
                                color='#fff'
                            
                            />
                            
                        </View>
                    )
                }
                
            </View>

            <ModalMsg 
                modalAberto={modalMsgAberto}
                msg={msg}
                fechaModal={() => { 
                    setModalMsgAberto(false)
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalCliente}
            >
                <View style={styles.centeredView}>

                    <View style={styles.modalViewNota}>
                       

                        <View style={{  width:windowWidth-108, height:150}}>
                           <TextInput  
                                style={ styles.input}
                                onChangeText={(t) => setVarBuscaCliente(t)}
                                value={varBuscaClientes}
                            />
                            <View>
                                <TouchableOpacity onPress={() => { buscarClientes()}} disabled={carregando}>
                                    <Text>Buscar</Text>
                                </TouchableOpacity>
                            </View>

                            
                            <View>
                                {carregando ? 
                                        ( <Text> Buscando...</Text> ) 
                                    : 
                                        <FlatList 
                                            data={clientesListagem}
                                            renderItem={({item}) => {
                                                return (
                                                    <TouchableOpacity style={{flexDirection:"row"}} onPress={() => selecionaCliente(item)}>
                                                        <View style={{ width:(windowWidth-108)/2,overflow:"hidden" }}>
                                                            <Text>{item.nome}</Text>
                                                        </View>
                                                        <View style={{ width:(windowWidth-108)/2, }}>
                                                            <Text>{item.cpfCnpj}</Text>
                                                        </View>
                                                        
                                                    </TouchableOpacity>
                                                )
                                            }}
                                        />
                                }
                            </View>

                            
                        </View>
                      
                    
                    </View>
                </View>
            
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalPerguntaPixAberto}
            >
                <View style={styles.centeredView}>

                    <View style={styles.modalViewNota}>
                        
                        <View style={{ height:150,  alignItems:"center", justifyContent:"center"}}>
                            <Text style={{ fontSize:20, fontWeight:"bold"}}>Deseja criar qr code para o pix no valor: {valorGerarQRPix.toFixed(2).replace(".",",")}</Text>
                        </View>
                       

                        <View style={{  width:windowWidth-108, height:150}}>
                            <View style={{ marginTop:0}}>
                                <Botao 
                                    label="Gerar QR code pix"
                                    color='#fff'
                                    callback={() => {
                                        gerarQrCode()
                                        setModalPerguntaPixAberto(false)
                                    }}
                                    backgroundColor='#13a303'
                                />
                            </View>
                            <View style={{ marginTop:10}}>
                                <Botao 
                                    label="Não gerar"
                                    color='#fff'
                                    callback={() => {
                                        setModalPerguntaPixAberto(false)
                                        finaliza(false)
                                    voltarLimparBag()
                                    }}
                                    backgroundColor='#ff001e'
                                />
                            </View>

                            
                        </View>
                      
                    
                    </View>
                </View>
            
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalQrCodeAberto}
            >
                <View style={styles.centeredView}>

                    <View style={styles.modalViewNotaQR}>
                        <View style={{ width:windowWidth, alignItems: "center"}}>
                            <Text style={{ fontSize:20, fontWeight:"bold"}}>QR code para o pix no valor: </Text>
                            <Text style={{ fontSize:30, fontWeight:"bold"}}>{valorGerarQRPix.toFixed(2).replace(".",",")}</Text>
                        </View>
                        
                        <View style={{ height:windowWidth-50, marginTop:30,  alignItems:"center", justifyContent:"center"}}>
                            <Image
                                source={{ uri: `data:image/png;base64,${qr_code_base64}` }}
                                style={{ width: windowWidth-50, height: windowWidth-50 }}
                                />
                        </View>
                       

                        <View style={{  width:windowWidth-108, height:150}}>
                           
                            <View style={{ marginTop:60}}>
                                <Botao 
                                    label="Pago"
                                    color='#fff'
                                    callback={() => {
                                        setModalQrCodeAberto(false)
                                        confirmarPagamento()
                                    }}
                                    backgroundColor='#13a303'
                                />
                                 
                            </View>
                            <View style={{ marginTop:10}}>
                               
                                 <Botao 
                                    label="Cancelar"
                                    color='#fff'
                                    callback={() =>  setModalQrCodeAberto(false)}
                                    backgroundColor='#ff001e'
                                />
                            </View>


                            
                        </View>
                      
                    
                    </View>
                </View>
            
            </Modal>
            {
                mostraErroPagamentoGif && (

                    <GifPagamentoRegeitado mostrar={mostraErroPagamentoGif} onAnimationEnd={() => setMostraErroPagamentoGif(false)}/>

                ) 
            }
            {
                mostraPagamentoGif && (

                    <GifPagamentoAceito mostrar={mostraPagamentoGif} onAnimationEnd={() => setMostraPagamentoGif(false)}/>

                ) 
            }
        </View>
    )
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container:{
        flex:1,
        //justifyContent: 'center',
        alignItems:'center',
        width: windowWidth,
        backgroundColor:"#4a4a4a"
    },
    infosVendedor:{
        width:windowWidth-20
    },
    infosCliente:{
        width:windowWidth-20,
        flexDirection:"row",
        marginTop:"10px"
    },
    subContainer:{
        height: (windowHeight/10)*3,
        alignItems:"center",
        justifyContent:"center",
        
    },
    botoes:{
        height: (windowHeight/10)*2,
        alignItems:"center",
        justifyContent:"center",
        marginTop:20
    },
    subContainerMenor:{
        height: windowHeight/10,
        alignItems:"center",
        justifyContent:"center",
        
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
    modalViewNotaQR:{
        width:windowWidth-20,
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
        height:windowHeight-50
    }
})
export default TelaPagamentos