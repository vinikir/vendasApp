import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ModalMsg = ({ modalAberto, msg, fechaModal }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalAberto}
            onRequestClose={fechaModal}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Icon name="info" size={24} color="#f0660a" />
                        <Text style={styles.modalTitle}>Atenção</Text>
                    </View>
                    
                    <Text style={styles.modalMessage}>{msg}</Text>
                    
                    <TouchableOpacity 
                        style={styles.modalButton}
                        onPress={fechaModal}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.modalButtonText}>ENTENDI</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 20,
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        color: '#f0660a',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    modalMessage: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#f0660a',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ModalMsg;