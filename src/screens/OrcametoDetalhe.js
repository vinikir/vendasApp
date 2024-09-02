import React, { useEffect, useState } from "react";
import moment from "moment"
import { FlatList, View, Text, StyleSheet, Dimensions, Image } from "react-native"
import Botao from "../Components/Botao"
import Share from 'react-native-share';
import { WebView } from 'react-native-webview';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import teste from '../../public/img/logoGem_.png'

const OrcamentoDetalhe = ({route, navigation}) => {
    const [ html, setHtml ] = useState()
    const orcamento = route.params.orcamento
    const  imgLogo = require("../../public/img/logoGem_.png")
    let valorTotal = 0

    for (let index = 0; index < orcamento.produtos.length; index++) {
        const element = orcamento.produtos[index];
        
        valorTotal+= element.valorTotal
    }

    
    const exampleImageUri = Image.resolveAssetSource(teste).uri


    useEffect(() => {
        criaHTMLPdf()

    }, [])

    const listagemProdutos = () => {
        let he = ''
        orcamento.produtos.map((item) => {
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

    const criaHTMLPdf = async () => {

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
                        Orçamento Nº ${orcamento.orcamentoId}
                    </div>
                </div>
                <div style="  width:98%; margin-top:20px; ">
                    
                    <div>
                        Data origem do orçamento: ${moment(orcamento.data).format("DD/MM/YYYY")}
                    </div>
                    <br/>
                    <div>
                        Valido até: ${moment(orcamento.data).add(30, 'days').format("DD/MM/YYYY")}
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

                            ${listagemProdutos()}
                        
                        </tbody>
                        <tfoot>
                            <tr style=" height:40px">
                                <td scope="row" colspan=4>Total Orçamento</td>
                                <td style="font-weight:Bold">R$ ${valorTotal.toFixed(2).toString().replace(".",",")}</td>
                            </tr>
                        </tfoot>
                    </table>
                    
                </div>
            </div>
        `;

        
        setHtml(h)
    } 
    

    const comp = async () => {
        const options = {
            html: html,
            fileName: 'GeM_moto_pecas_orcamento_'+orcamento.orcamentoId+"_"+moment().format("DDMMYYYYHm"),
            directory: 'Documents',
        };
        try{
            const file = await RNHTMLtoPDF.convert(options);

            
            const shareOptions = {
                title: 'Compartilhar PDF',
                message: 'Confira este PDF!',
                url: "file://"+file.filePath,
                type: 'application/pdf',
            };
            
            Share.open(shareOptions).then((res) => {

                console.log('Compartilhado com sucesso:', res);

            }).catch((err) => {

                console.log('Erro ao compartilhar:', err);

            });

        } catch (error) {
          console.log('Erro ao gerar PDF:', error);
        }
    }



   

    return (
        <View style={styles.container}>

            {/* <View style={styles.subContainer}>
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
                            <View>
                                <Text style={{ color:"#000"}}>Contato (11) 9 6564-0477</Text>
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

            </View> */}
            <WebView
                source={{ html: html }}
                style={{ flex: 1, top:5, height:windowHeight-185, width:windowWidth }}
            />
            <View>
                <Botao 
                    label="Voltar"
                    backgroundColor="blue"
                    callback={() => navigation.goBack()}
                />
            </View>
            <View style={{ marginTop:20}}>
                <Botao 
                    label="Gerar PDF"
                    backgroundColor="blue"
                    callback={() => comp()}
                />
            </View>
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