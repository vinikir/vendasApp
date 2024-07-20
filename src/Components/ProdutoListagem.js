import React , { useEffect, useState, useContext } from 'react';

import {
	StyleSheet,
	TouchableOpacity,
	View,
	Dimensions,
	Image,
	Text,
} from 'react-native';
import ModalInformativosProduto from './ModalInformativosProtudo';
import ModalConfirmarAdicionarProduto from './ModaConfirmarAdicionarProduto';

const ProdutoListagem = ({item, callback}) => {

    const [ modalDetalhesAberto, setModalDetalhesAberto] = useState(false)
    const [ modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false)


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
        setModalDetalhesAberto(true)
    }


    const adicionarItemBag = (jsonItem) => {
        callback(jsonItem)
        
        setModalConfirmacaoAberto(false)
    }

    return(
        <View style={{ marginBottom:10, width:windowWidth, alignItems:"center" }} >
            <TouchableOpacity 
				onPress={ () => {
					abrirDetalhes()
				}} 
				style={ styles.card }
			>
                <View style={ styles.viewImg }>
					<Image
						style={styles.img}
						source={img}
					/>
				</View>
                <View style={styles.viewText}> 
                    <View style={{ height:53,marginTop:2, }}> 
						<Text style={ { color:"#000", fontWeight:"bold"}}>{item.nome}</Text>
					</View>
                    <View style={{ height:25,  }}> 
						<Text style={ {color:"#000"}}>Estoque: {item.estoque}</Text>
					</View>
                </View>
                <View>
                    <View style={{justifyContent:"center", height:80 }}> 
						<Text style={ {color:"#000"}}>R$ {preco}</Text>
					</View>
                </View>
					
            </TouchableOpacity>
            <View style={ styles.subCard}>
                <TouchableOpacity style={{ 
						backgroundColor:"#5059bf",
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
            <ModalInformativosProduto
                item={item}
                modalAberto={modalDetalhesAberto}
                fechaModal={() => setModalDetalhesAberto(false)}
                img={img}
            />

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

}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
	
   
    
    
    
	subCard:{
		//backgroundColor:'#15404A',
		borderBottomLeftRadius:10,
		borderBottomRightRadius:10,
		justifyContent:"center",
		width: windowWidth-18
	},
	viewText:{ 
		height:80,
		width:windowWidth-200,
		justifyContent:"center",
       
	},
	viewImg:{
        height:80,
		borderRadius:10,
		justifyContent:"center",
		width:100,
		
    },
    
    
	
    img:{
        height:80,
        width:100,
		
        resizeMode: 'stretch',
		borderRadius:10
    },
    
	
    card:{
        backgroundColor:"#fff",
        height:80, 
        flexDirection: 'row',        
       
		borderTopLeftRadius:10,
		borderTopRightRadius:10,
		width: windowWidth-18,
		elevation:5,
    },
	
	
	
});

export default ProdutoListagem