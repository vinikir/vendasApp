import React, { useState, useMemo }  from 'react';
import {
	StyleSheet,
	View,
	Text,
    Modal,
    Pressable,
    Dimensions,
    TextInput
} from 'react-native';

const ModalMsg = ({modalAberto , msg, fechaModal }) => {

    return(
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalAberto}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{msg}</Text>
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
        elevation: 5,
        backgroundColor:"#fff"
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color:"#000"
    }
})

export default ModalMsg