import React , { useEffect, useState, useContext } from 'react';

import {
	StyleSheet,
	TouchableOpacity,
	View,
	Dimensions,
	Image,
	Text,
} from 'react-native';

import ModalConfirmarAdicionarProduto from './ModaConfirmarAdicionarProduto';
import { useNavigation } from '@react-navigation/native';

const ProdutoListagem = React.memo( ( { item, callback } )  => {

    const [ modalDetalhesAberto, setModalDetalhesAberto] = useState(false)
    const [ modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false)

	const navigation = useNavigation();
	
    let  img = ''

    let preco = `${item.valorVenda.toFixed(2)}`

    preco = preco.replace('.', ',')

	if(item.img && item.img != null){
		img = {
			uri: item.img,
		}
	}else{
		img = require("../../public/img/noimage.png")
	}

    const abrirDetalhes = () => {
		
		navigation.navigate("InformativoProduto",{item:item})
        // setModalDetalhesAberto(true)
    }

    const adicionarItemBag = (jsonItem) => {
        callback(jsonItem)
        
        setModalConfirmacaoAberto(false)
    }

	//let backgroundColor = "#4a4a4a"
	let backgroundColor = "#707070"
	let tamanho = 50
	
	if(item.tipo == "servico"){
		backgroundColor = "#ffc48a"
		tamanho = "100%"
	}

	

    return(
        <View style={{ marginBottom:10, width:windowWidth, alignItems:"center" }} >
            <TouchableOpacity 
				onPress={ () => {
					abrirDetalhes()
				}} 
				style={ [ styles.card, { backgroundColor:backgroundColor}] }
			>
                <View style={ styles.viewImg }>
					<Image
						style={styles.img}
						source={img}
					/>
				</View>
                <View style={styles.viewText}> 
                    <View style={{ height:tamanho, justifyContent:"center", }}> 
						<Text style={ { color:"#ffff", fontWeight:"bold"}}>{item.nome}</Text>
					</View>
					{
						item.tipo != "servico" && (
							<View>
								<View style={{ height:25,  }}> 
									<Text style={ {color:"#ffff"}}>Marca: {item.marca}</Text>
								</View>
								<View style={{ height:25,  }}> 
									<Text style={ {color:"#ffff"}}>Estoque: {item.estoque}</Text>
								</View>
							</View>
						)
					}
					
                </View>
                <View>
                    <View style={{justifyContent:"center", height:100, width:75,  alignItems:"center" }}> 
						<Text style={ {color:"#ffff"}}>R$ {preco}</Text>
					</View>
                </View>
					
            </TouchableOpacity>
            <View style={ styles.subCard}>
                <TouchableOpacity style={{ 
						backgroundColor:"#f0660a",
						flex:1,
						justifyContent:"center",
						alignItems:"center",
						borderBottomLeftRadius:10,
						borderBottomRightRadius:10, 
						width: windowWidth-18,
						elevation:5,
						height:45,
					}}
                    onPress={() => setModalConfirmacaoAberto(true)}
                >
							
                    <Text style={{color:"#ffff", fontWeight:"bold"}}>Adicionar</Text>
                </TouchableOpacity>	
            </View>
            

            <ModalConfirmarAdicionarProduto
                item={item}
                modalAberto={modalConfirmacaoAberto}
                fechaModal={() => setModalConfirmacaoAberto(false)}
                callbackAdicionar={(jsonItem) => {
                   
                    adicionarItemBag(jsonItem)

                } }
            /> 
        </View>
    )

})

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    
	subCard:{
		marginTop:-2,
		borderBottomLeftRadius:10,
		borderBottomRightRadius:10,
		justifyContent:"center",
		width: windowWidth-18
	},
	viewText:{ 
		height:105,
		width:windowWidth-200,
		justifyContent:"center",
		marginLeft:5,
       
	},
	viewImg:{
        height:100,
		borderRadius:10,
		width:100,
		alignItems:"center",
		justifyContent:"center",
		
    },
    img:{
        height:100,
        width:100,
        resizeMode: 'cover',
		borderTopLeftRadius:10
    },
    card:{
        
        height:102, 
        flexDirection: 'row',        
        // borderWidth:1,
		// borderBlockColor:"#707070",
		borderTopLeftRadius:10,
		borderTopRightRadius:10,
		width: windowWidth-18,
    },
	
	
});

export default ProdutoListagem