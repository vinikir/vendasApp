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
import InformativosProduto from './InformativosProdutos';

const ModalInformativosProduto = ({modalAberto, item, fechaModal, img}) => {

    if(typeof item == "undefined" || item.nome == "undefined"){
        return

    }

   

    return(
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalAberto}
        >
            <View style={styles.centeredView}>

                <View style={styles.modalView}>

                    <InformativosProduto 
                        item={item} 
                        img={img}
                    />
                    
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

export default ModalInformativosProduto