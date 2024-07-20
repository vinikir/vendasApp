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

const ModalInformativosProduto = ({modalAberto, item, fechaModal, img}) => {

    if(typeof item == "undefined" || item.nome == "undefined"){
        return

    }

    let preco = `${item.valorVenda.toFixed(2)}`

    preco = preco.replace('.', ',')

    return(
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalAberto}
        >
            <View style={styles.centeredView}>

                <View style={styles.modalView}>

                    <View style={ styles.viewImgInfo }>
                        <Image
                            style={styles.imgInfo}
                            source={img}
                        />
                    </View>
                    
                    
                    <ScrollView>
                        <View style={styles.viewInfo}>
                            <View style={{ marginBottom:10 }}>
                                <Text style={{fontWeight:"bold"}}>Produto:</Text>
                                <Text >{item.nome}</Text>
                            </View>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            <View style={{ marginBottom:10, marginTop:10 }}>
                                <Text style={{fontWeight:"bold"}}>Valor:</Text>
                                <Text >R$ {preco}</Text>
                            </View>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            <View style={{ marginBottom:10, marginTop:10 }}>
                                <Text style={{fontWeight:"bold"}}>Estoque:</Text>
                                <Text >{item.estoque}</Text>
                            </View>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />

                            <View style={{ marginBottom:10, marginTop:10 }}>
                                <Text style={{fontWeight:"bold"}}>Desconto maximo:</Text>
                                <Text >{item.descontoMaximo}</Text>
                            </View>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                            <View style={{ marginBottom:10, marginTop:10 }}>
                                <Text style={{fontWeight:"bold"}}>Descrição:</Text>
                                <Text> {item.descricao}</Text>
                            </View>

                        </View>
                        
                    </ScrollView>
                
                    
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => fechaModal()}
                    >
                        <Text style={styles.textStyle}>OK</Text>
                    </Pressable>
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
        elevation: 5
    },
    viewImgInfo:{
        height:windowWidth-108,
		justifyContent:"center",
		width: windowWidth-108,
        marginBottom:10
    },
    imgInfo:{
        height:windowWidth-108,
        width: windowWidth-108,
		
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
        textAlign: "center"
    },
})

export default ModalInformativosProduto