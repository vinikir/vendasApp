import moment from "moment"
import { FlatList, View, Text, StyleSheet, Dimensions, Image } from "react-native"
import Botao from "../Components/Botao"
const OrcamentoDetalhe = ({route, navigation}) => {
    const orcamento = route.params.orcamento
    const  imgLogo = require("../../public/img/logoGem.png")

    let valorTotal = 0

    for (let index = 0; index < orcamento.produtos.length; index++) {
        const element = orcamento.produtos[index];
        
        valorTotal+= element.valorTotal
    }

    return (
        <View style={styles.container}>

            <View style={styles.subContainer}>
                <View style={ styles.viewHead}>

                    <View style={{ flexDirection:"row"}}>
                        <View>
                            <Image
                                style={[ styles.img, { resizeMode:'contain' } ]}
                                source={imgLogo}
                            
                            />
                            
                        </View>
                        <View style={{ height:100, marginLeft:10, justifyContent:"center"}}>
                            <View>
                                <Text style={{ color:"#000"}}>G & M Moto Pecas</Text>
                            </View>
                            <View>
                                <Text style={{ color:"#000"}}>CNPJ 55.744.795/0001-34</Text>
                            </View>
                        </View>
                        

                    </View>
                   
                    
                    <View style={{ width:windowWidth, alignItems:"center", marginBottom:10}}>
                        <Text style={{ color:"#000", fontSize:20}}>Orçamento Nº {orcamento.orcamentoId}</Text>
                    </View>
                    
                    <View>
                        <Text style={{ color:"#000"}}>Data {moment(orcamento.data).format("DD/MM/YYYY")}</Text>
                    </View>
                    <View>
                        <Text style={{ color:"#000"}}>Valido até {moment(orcamento.data).add(30, 'days').format("DD/MM/YYYY")}</Text>
                    </View>
                    
                </View>
                <View style={ [styles.viewListagem, {marginTop:20}]}>

                    <View style={styles.viewDividido1} >
                        <Text style={styles.text}>Produto</Text>
                    </View>

                    <View style={styles.viewDividido}>
                        <Text style={styles.text}>Qtd</Text>
                    </View>

                    <View style={styles.viewDividido2}>
                        <Text style={styles.text}>Val. Uni.</Text>
                    </View>

                    <View style={styles.viewDividido}>
                        <Text style={styles.text}>Desc. (%)</Text>
                    </View>

                    <View style={styles.viewDividido2}>
                        <Text style={styles.text}>Val. Tot.</Text>
                    </View>

                </View>

                <View>
                    {
                        orcamento.produtos.map((item) => {
                            return(
                            
                                <View style={ styles.viewListagem}>

                                    <View style={styles.viewDividido1} >
                                        <Text style={styles.text}>{item.produtoNome}</Text>
                                    </View>

                                    <View style={styles.viewDivididoNumero}>
                                        <Text style={styles.text}>{item.qtd}</Text>
                                    </View>

                                    <View style={styles.viewDividido2}>
                                        <Text style={styles.text}>R$ {`${item.valorUnitario.toFixed(2)}`.replace(".",",")}</Text>
                                    </View>

                                    <View style={ styles.viewDivididoNumero }>
                                        <Text style={styles.text}>{item.desconto}</Text>
                                    </View>

                                    <View style={styles.viewDividido2}>
                                        <Text style={styles.text}>R$ {`${item.valorTotal.toFixed(2)}`.replace(".",",")}</Text>
                                    </View>

                                </View>
                                
                            )
                        })
                    }
                </View>

                <View style={{ marginTop:20}}>
                    <Text style={styles.text}> Valor total: R$ {`${valorTotal.toFixed(2)}`.replace(".",",")}</Text>
                </View>

            </View>
            <View>
                <Botao 
                    label="Voltar"
                    backgroundColor="blue"
                    callback={() => navigation.goBack()}
                />
            </View>
            {/* <View style={{ marginTop:20}}>
                <Botao 
                    label="Compartilhar"
                    backgroundColor="blue"
                />
            </View> */}
        </View>
    )

}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    subContainer:{
        marginTop:10,
        height:windowHeight-150,
        width:windowWidth-10,
    },
    viewListagem:{
        flexDirection:"row",
        marginBottom:10
    },
    text:{
        color:"#000"
    },
	viewDividido1:{
        width:((windowWidth-10)/10)*4,
        // alignItems:"center",
        justifyContent:"center"
    },
    
    viewDividido2:{
        width:((windowWidth-10)/10)*2,
        alignItems:"center",
        justifyContent:"center"
    },
   
    viewDividido:{
        width:(windowWidth-10)/10,
        alignItems:"center",
        justifyContent:"center"
    },
    
    viewDivididoNumero:{
        width:(windowWidth-10)/10,
        
        alignItems:"center",
        justifyContent:"center"
    },
	img:{
        height:100,
        width:100
    },
});

export default OrcamentoDetalhe