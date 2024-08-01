import React  from 'react';
import {
	ScrollView,
	StyleSheet,
	View,
	Image,
	Text,
    Modal,
    Pressable,
    Dimensions
} from 'react-native';
import RenderHtml from 'react-native-render-html';


const InformativosProduto = ({item, img}) => {

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
            <View style={{flex:1, color:"#000"}}>
                <View style={ styles.viewImgInfo }>
                    <Image
                        style={styles.imgInfo}
                        source={img}
                    />
                </View>
                <View>
                    <ScrollView>
                        <View style={styles.viewInfo}>
                            <View style={{ marginBottom:10 }}>
                                <Text style={{fontWeight:"bold",color:"#000",}}>Produto:</Text>
                                <Text style={{color:"#000",}}>{item.nome}</Text>
                            </View>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                           
                            <View style={{ flexDirection:"row"}}>
                               

                                <View style={{ marginBottom:10, marginTop:10, width:(windowWidth-108)/2 }}>
                                    <Text style={{fontWeight:"bold",color:"#000",}}>Valor:</Text>
                                    <Text style={{color:"#000",}}>R$ {preco}</Text>
                                </View>
                                <View style={{ marginBottom:10, marginTop:10 }}>
                                    <Text style={{fontWeight:"bold",color:"#000",}}>Desconto até (%):</Text>
                                    <Text style={{color:"#000",}}>{item.descontoMaximo}</Text>
                                </View>
                            </View>
                            
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                           
                            
                            <View style={{ marginBottom:10, marginTop:10 }}>
                                <Text style={{color:"#000",fontWeight:"bold"}}>Descrição:</Text>
                                <Text style={{color:"#000",}}> {item.descricao}</Text>
                            </View>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            
                            <View style={{ marginBottom:10, marginTop:10 }}>
                                <Text style={{color:"#000",fontWeight:"bold"}}>Aplicação:</Text>
                                <RenderHtml
									contentWidth={200}
									source={source}
								/>
                            </View>
                            
                        </View>
                        
                    </ScrollView>
                    
                </View>
            </View>
        )

    }else{

        return(
            <View style={{flex:1, color:"#000"}}>
                 <View style={ styles.viewImgInfo }>
                    <Image
                        style={styles.imgInfo}
                        source={img}
                    />
                </View>
                <View>
                    <ScrollView>
                        <View style={styles.viewInfo}>
                            <View style={{ marginBottom:10 }}>
                                <Text style={{fontWeight:"bold",color:"#000",}}>Produto:</Text>
                                <Text style={{color:"#000",}}>{item.nome}</Text>
                            </View>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            <View style={{ marginBottom:10 }}>
                                <Text style={{fontWeight:"bold",color:"#000",}}>Marca:</Text>
                                <Text style={{color:"#000",}}>{item.marca}</Text>
                            </View>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            <View style={{ flexDirection:"row"}}>
                                <View style={{ marginBottom:10, marginTop:10, width:(windowWidth-108)/4 }}>
                                    <Text style={{fontWeight:"bold",color:"#000",}}>Estoque:</Text>
                                    <Text style={{color:"#000",}}>{item.estoque}</Text>
                                </View>

                                <View style={{ marginBottom:10, marginTop:10, width:(windowWidth-108)/3 }}>
                                    <Text style={{fontWeight:"bold",color:"#000",}}>Valor:</Text>
                                    <Text style={{color:"#000",}}>R$ {preco}</Text>
                                </View>
                                <View style={{ marginBottom:10, marginTop:10 }}>
                                    <Text style={{fontWeight:"bold",color:"#000",}}>Desconto até (%):</Text>
                                    <Text style={{color:"#000",}}>{item.descontoMaximo}</Text>
                                </View>
                            </View>
                            
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            <View style={{flexDirection:"row"}}>
                                <View style={{ marginBottom:10, marginTop:10, width:(windowWidth-108)/2 }}>
                                    <Text style={{color:"#000",fontWeight:"bold"}}>SKU:</Text>
                                    <Text style={{color:"#000",}}> {item.sku}</Text>
                                </View>
                                <View style={{ marginBottom:10, marginTop:10, width:((windowWidth-108)/2) }}>
                                    <Text style={{color:"#000",fontWeight:"bold"}}>Codigo de barras:</Text>
                                    <Text style={{color:"#000",}}> {item.codigoBarra}</Text>
                                </View>

                            </View>
                            
                            

                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            
                            <View style={{ marginBottom:10, marginTop:10 }}>
                                <Text style={{color:"#000",fontWeight:"bold"}}>Descrição:</Text>
                                <Text style={{color:"#000",}}> {item.descricao}</Text>
                            </View>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            
                            <View style={{ marginBottom:10, marginTop:10 }}>
                                <Text style={{color:"#000",fontWeight:"bold"}}>Aplicação:</Text>
                                <RenderHtml
									contentWidth={200}
									source={source}
								/>
                            </View>
                            
                        </View>
                        
                    </ScrollView>
                </View>
            </View>
        )


    }

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
        elevation: 5
    },
    viewImgInfo:{
        height:windowWidth-200,
		justifyContent:"center",
		width: windowWidth-108,
        marginBottom:10,
        alignItems:"center",
       
    },
    imgInfo:{
        height:windowWidth-190,
        width: windowWidth-150,
		
        resizeMode: 'stretch',
		borderRadius:10
    },
    viewInfo:{
		width: windowWidth-108,
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
})


export default InformativosProduto