import React, { useState, useMemo }  from 'react';
import {
	StyleSheet,
	View,
	Text,
    Modal,
    Pressable,
    Dimensions,
    TextInput,
    FlatList
} from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
import TabelaPagamentos from './TabelaTapamentos';

const ModalPagamento = ({modalAberto, fechaModal, concluir, valorCobrar}) => {

    const [ pagamento, setPagamento ] = useState([])
    const [ selectedId, setSelectedId] = useState();
    const [ valor ,setvalor ] = useState(valorCobrar)
    const [ valorTotalPago, setvalorTotalPago ] = useState(0.0)

    const radioButtons = useMemo(() => ([
        {
            id: '1', 
            label: 'Pix',
            value: 'pix',
            color:"#fff"
        },
        {
            id: '2',
            label: 'Dinheiro',
            value: 'dinheiro',
            color:"#fff"
        },
        {
            id: '3',
            label: 'Débito',
            value: 'debito',
            color:"#fff"
        },
        {
            id: '4',
            label: 'Crédito',
            value: 'credito',
            color:"#fff"
        }
    ]), []);

    const adicionarPagamento = () => {
        console.log("asdasd")
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
    }

    const finaliza = () => {

        let p = pagamento
        const metodo = radioButtons.find(el => el.id == selectedId)
        p.push({
            metodo:metodo.value,
            valor:parseFloat(valor.replace(",","."))
        })
      
        limpaVar()
        fechaModal()
        concluir(p)

    }

    const Botoes = () => {

        

        if(selectedId == undefined && valorTotalPago != parseFloat(valorCobrar.replace(",","."))){
            return
        }

        if(parseFloat(valor.replace(",",".")) > parseFloat(valorCobrar.replace(",","."))){
            return ( 
            <View style={{ alignItems:"center", justifyContent:"center",marginTop:20}}>
                <Text style={{color:"red"}}>O valor cobrado é maior que o valor da compra</Text>
            </View>)
        }


        if(parseFloat(valor.replace(",",".")) < parseFloat(valorCobrar.replace(",",".")) && valorTotalPago + parseFloat(valor.replace(",",".")) == parseFloat(valorCobrar.replace(",","."))){
            return(
                <View>
                    <Pressable
                        style={[styles.button, styles.buttonFinalizar]}
                        onPress={() => finaliza()}
                    >
                        <Text style={styles.textStyle}>Finalizar</Text>
                    </Pressable>
                </View>
            )
        }

        

        if(parseFloat(valor.replace(",",".")) == parseFloat(valorCobrar.replace(",","."))){
            return(
                <View>
                    <Pressable
                        style={[styles.button, styles.buttonFinalizar]}
                        onPress={() => finaliza()}
                    >
                        <Text style={styles.textStyle}>Finalizar</Text>
                    </Pressable>
                </View>
            )
        }
       

        if(parseFloat(valor.replace(",",".")) < parseFloat(valorCobrar.replace(",","."))){
            return(
                <View>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={ () => adicionarPagamento()}
                    >
                        <Text style={styles.textStyle}>Adicionar pagamento</Text>
                    </Pressable>
                </View>
            )
        }


    }

    const limpaVar = () => {
        setPagamento([])
        setSelectedId();
        setvalor(valorCobrar)
        setvalorTotalPago(0.0)
    }

    return(
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalAberto}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View>
                        <View>
                            <View style={{ marginTop: 10, marginBottom:10 }}>
                                <Text style={{ fontSize:18, fontWeight:"bold"}}>O valor a ser cobrado é de R${valorCobrar}</Text>
                            </View>
                            
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
                            <View style={{ marginTop:10}}>
                                <TextInput 
                                    style={ {
                                        backgroundColor:"#fff",
                                        
                                        width: windowWidth-90,
                                    
                                        paddingLeft:2,
                                        paddingRight:2,
                                        height:35 ,
                                        color:"rgba(0, 0, 0, 0.6)"
                                    }}
                                    onChangeText={(t) => setvalor(t)}
                                    value={valor}
                                />
                            </View>
                        </View>
                        <TabelaPagamentos 
                            pagamentos={pagamento}
                        />
                        <View>
                            
                        </View>
                        <View >
                            {
                                Botoes()
                            }
                            <View>
                                <Pressable
                                    style={[styles.button, styles.buttonCancelar]}
                                    onPress={() => { 
                                        limpaVar()
                                        fechaModal()
                                    }}
                                >
                                    <Text style={styles.textStyle}>Cancelar</Text>
                                </Pressable>
                            </View>
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
        elevation: 5,
        backgroundColor:"#dedede"
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    buttonFinalizar: {
        backgroundColor: "#13a303",
    },
    buttonCancelar: {
        backgroundColor: "red",
    },
    button: {
        borderRadius: 30,
        padding: 20,
        elevation: 5,
        marginTop:30
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        color:"#fff",
    },
})

export default ModalPagamento