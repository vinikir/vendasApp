import { 
    View,
    StyleSheet,
    Dimensions,
    StatusBar,
    Image,
    TouchableOpacity,
    Text,
    ScrollView,
    FlatList
 } from "react-native"
 import RenderHtml from 'react-native-render-html';
import CarrocelImagens from "../Components/CarrocelImagens";
import { useEffect, useState } from "react";

const InformativoProduto = ({route, navigation}) => {
   
    const item = route.params.item

    let  img = ''
    if(item.img && item.img != null){

        img = {
            uri: item.img,
        }

    }else{

        img = require("../../assets/noimage.png")

    }
   
    useEffect(() => {
        
            if(item.imgAdicional && item.imgAdicional.length > 0 && typeof img != "number"){

                if(item.imgAdicional[0] != item.img){

                    item.imgAdicional.unshift(item.img)

                }

            }
       
    }, [])
   
    
    
    const [mostrarImagem, setMostraImagem ] = useState(img)
    
    let preco = `${item.valorVenda.toFixed(2)}`

    preco = preco.replace('.', ',')

    let aplic = ""

    if(typeof item.aplicacao != "undefined"){
        aplic = item.aplicacao
    }

    const source = {
		html:  `<div style="color:#000; ">`+aplic+`</div>`
	};

    

    if(item.tipo == "servico"){

        return(
            <View style={styles.container}>
                <StatusBar
                    animated={true}
                    backgroundColor={"#4a4a4a"}
                />
                <View style={{flex:1, width:windowWidth, alignItems:"center"}}>
                    
                    

                    <View style={styles.viewInfo2}>

                        <ScrollView style={styles.viewInfo2}>
                            <View style={ styles.viewImgInfo }>
                                <Image
                                    style={styles.imgInfo}
                                    source={img}
                                />
                            </View>
                            
                           
                            <View style={{ marginBottom:10 }}>
                                <Text style={{fontWeight:"bold",color:"#FFF",}}>Produto:</Text>
                                <Text style={{color:"#FFF",}}>{item.nome}</Text>
                            </View>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                        
                            <View style={{ flexDirection:"row"}}>
                            

                                <View style={{ marginBottom:10, marginTop:10, width:(windowWidth-108)/2 }}>
                                    <Text style={{fontWeight:"bold",color:"#FFF",}}>Valor:</Text>
                                    <Text style={{color:"#FFF",}}>R$ {preco}</Text>
                                </View>
                                <View style={{ marginBottom:10, marginTop:10 }}>
                                    <Text style={{fontWeight:"bold",color:"#FFF",}}>Desconto até (%):</Text>
                                    <Text style={{color:"#FFF",}}>{item.descontoMaximo}</Text>
                                </View>
                            </View>
                            
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                        
                            
                            <View style={{ marginBottom:10, marginTop:10 }}>
                                <Text style={{color:"#FFF",fontWeight:"bold"}}>Descrição:</Text>
                                <Text style={{color:"#FFF",}}> {item.descricao}</Text>
                            </View>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            
                            <View style={{ marginBottom:10, marginTop:10 }}>
                                <Text style={{color:"#FFF",fontWeight:"bold"}}>Aplicação:</Text>
                                <RenderHtml
                                    contentWidth={200}
                                    source={source}
                                />
                            </View>
                            
                        </ScrollView>
                       
                    </View>
                    <View>
                        <TouchableOpacity style={styles.btnLogin} onPress={() => navigation.goBack()}>
                            <Text style={{ color:"#FFF", fontWeight:"bold" }}> Voltar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    const m = ((windowWidth-80))
    return (
        <View style={styles.container}>
            <StatusBar
				animated={true}
				backgroundColor={"#4a4a4a"}
			/>
            
            <View style={{flex:1, width:windowWidth, alignItems:"center", top:20}}>
              
                <View style={styles.viewInfo3}>

                    <ScrollView style={styles.viewInfo3}>
                        <View style={ styles.viewImgInfo }>
                           
                            <Image
                                style={styles.imgInfo}
                                source={mostrarImagem}
                            />
                        </View>
                         
                        <View>
                            <CarrocelImagens item={item}  atualziarImagem={(imgval) => { 
                                setMostraImagem({uri:imgval})
                                
                            }}/>
                        </View>
                        <View style={{ marginBottom:10 }}>
                            <Text style={{fontWeight:"bold",color:"#FFF",}}>Produto:</Text>
                            <Text style={{color:"#FFF",}}>{item.nome}</Text>
                        </View>
                        <View
                            style={{
                                borderBottomColor: 'black',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                            <View style={{ flexDirection:"row"}}>

                            <View style={{ marginBottom:10, marginTop:10, width:(windowWidth-40)/2 }}>
                                <Text style={{fontWeight:"bold",color:"#FFF",}}>Marca:</Text>
                                <Text style={{color:"#FFF",}}>{item.marca}</Text>
                            </View>

                            <View style={{ marginBottom:10, marginTop:10, width:(windowWidth-40)/2 }}>
                                <Text style={{fontWeight:"bold",color:"#FFF",}}>Estoque:</Text>
                                <Text style={{color:"#FFF",}}>{item.estoque}</Text>
                            </View>

                        </View>
                        
                        <View
                            style={{
                                borderBottomColor: 'black',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                        <View style={{ flexDirection:"row"}}>
                            

                            <View style={{ marginBottom:10, marginTop:10, width:(windowWidth-40)/2 }}>
                                <Text style={{fontWeight:"bold",color:"#FFF",}}>Valor:</Text>
                                <Text style={{color:"#FFF",}}>R$ {preco}</Text>
                            </View>
                            <View style={{ marginBottom:10, marginTop:10 }}>
                                <Text style={{fontWeight:"bold",color:"#FFF",}}>Desconto até (%):</Text>
                                <Text style={{color:"#FFF",}}>{item.descontoMaximo}</Text>
                            </View>
                        </View>
                        
                        <View
                            style={{
                                borderBottomColor: 'black',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                        <View style={{flexDirection:"row", }}>

                            <View style={{ marginBottom:10, marginTop:10, width:(windowWidth-40)/2 }}>
                                <Text style={{color:"#FFF",fontWeight:"bold"}}>SKU:</Text>
                                <Text style={{color:"#FFF",}}> {item.sku}</Text>
                            </View>

                            <View style={{ marginBottom:10, marginTop:10, width:((windowWidth-40)/2) }}>
                                <Text style={{color:"#FFF",fontWeight:"bold"}}>Codigo de barras:</Text>
                                <Text style={{color:"#FFF",}}> {item.codigoBarra}</Text>
                            </View>

                        </View>

                        <View
                            style={{
                                borderBottomColor: 'black',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                        
                        <View style={{ marginBottom:10, marginTop:10}}>
                            <Text style={{color:"#FFF",fontWeight:"bold"}}>Descrição:</Text>
                            <Text style={{color:"#FFF",}}> {item.descricao}</Text>
                        </View>
                        <View
                            style={{
                                borderBottomColor: 'black',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                        
                        <View style={{ marginBottom:10, marginTop:10 }}>
                            <Text style={{color:"#FFF",fontWeight:"bold"}}>Aplicação:</Text>
                            <RenderHtml
                                contentWidth={200}
                                source={source}
                            />
                        </View>
                    
                    </ScrollView>
                    
                </View>
                <View>
                    <TouchableOpacity style={styles.btnLogin} onPress={() => navigation.goBack()}>
                        <Text style={{ color:"#FFF", fontWeight:"bold" }}> Voltar</Text>
                    </TouchableOpacity>
                </View>
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
        backgroundColor:"#4a4a4a"
        
    },
    viewImgInfo:{
        height:270,
		justifyContent:"center",
		width: windowWidth-40,
        marginBottom:10,
        alignItems:"center",
        
    },
    imgInfo:{
        height:250,
        width: windowWidth-40,
		
        resizeMode: 'stretch',
		borderRadius:10
    },
    viewInfo:{
		width: windowWidth-40,
        height:200,
    },
    viewInfo2:{
		width: windowWidth-40,
        height:windowHeight-100,
    },
    viewInfo3:{
		width: windowWidth-40,
        height:windowHeight-100
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    button: {
        borderRadius: 30,
        padding: 20,
        elevation: 2,
        marginTop:30
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        color:"#000",
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
})
export default InformativoProduto