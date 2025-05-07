import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Switch,
    Dimensions,
    Image,
    Modal,
    Button
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const OrdemServico = () => {
    // Dados básicos da moto
    const [placa, setPlaca] = useState('');
    const [cor, setCor] = useState('');
    const [modelo, setModelo] = useState('');
    const [ano, setAno] = useState('');
    const [quilometragem, setQuilometragem] = useState('');

    // Checklist dinâmico
    const checklistItems = [
        { id: 1, label: "Foto da placa", tipo: "foto", value: null },
        { id: 2, label: "Moto liga?", tipo: "boolean", value: false },
        { id: 3, label: "Faróis funcionando?", tipo: "boolean", value: false },
        { id: 4, label: "Pneus em bom estado?", tipo: "boolean", value: false },
        { id: 5, label: "Foto do hodômetro", tipo: "foto", value: null },
        { id: 6, label: "Documentação OK?", tipo: "boolean", value: false },
        { id: 7, label: "Foto geral da moto", tipo: "foto", value: null },
        { id: 8, label: "Possui arranhões/amassados?", tipo: "boolean", value: false },
        { id: 9, label: "Foto dos danos (se houver)", tipo: "foto", value: null },
        { id: 10, label: "Combustível suficiente?", tipo: "boolean", value: false }
    ];

    const [checklist, setChecklist] = useState(checklistItems);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPhotoItem, setCurrentPhotoItem] = useState(null);
    const scrollViewRef = useRef();

    // Manipuladores
    const handleBooleanChange = (id, value) => {
        setChecklist(checklist.map(item =>
            item.id === id ? { ...item, value } : item
        ));
    };

    const handleTakePhoto = (item) => {
        setCurrentPhotoItem(item);
        setModalVisible(true);
    };

    const takePhoto = () => {
        launchCamera({
            mediaType: 'photo',
            quality: 0.8,
        }, (response) => {
            if (!response.didCancel && !response.error) {
                const updatedChecklist = checklist.map(item =>
                    item.id === currentPhotoItem.id
                        ? { ...item, value: response.assets[0].uri }
                        : item
                );
                setChecklist(updatedChecklist);
            }
            setModalVisible(false);
        });
    };

    const selectFromGallery = () => {
        launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
        }, (response) => {
            if (!response.didCancel && !response.error) {
                const updatedChecklist = checklist.map(item =>
                    item.id === currentPhotoItem.id
                        ? { ...item, value: response.assets[0].uri }
                        : item
                );
                setChecklist(updatedChecklist);
            }
            setModalVisible(false);
        });
    };

    const renderInput = (item) => {
        switch (item.tipo) {
            case 'boolean':
                return (
                    <Switch
                        value={item.value}
                        onValueChange={(value) => handleBooleanChange(item.id, value)}
                        thumbColor={item.value ? "#f0660a" : "#f5dd4b"}
                        trackColor={{ false: "#444", true: "rgba(240, 102, 10, 0.5)" }}
                    />
                );
            case 'foto':
                return (
                    <TouchableOpacity
                        style={styles.photoButton}
                        onPress={() => handleTakePhoto(item)}
                    >
                        {item.value ? (
                            <Image source={{ uri: item.value }} style={styles.photoPreview} />
                        ) : (
                            <Icon name="camera" size={20} color="#f0660a" />
                        )}
                    </TouchableOpacity>
                );
            default:
                return null;
        }
    };

    const handleSubmit = () => {
        // Lógica para enviar a ordem de serviço
        console.log({
            placa, cor, modelo, ano, quilometragem,
            checklist
        });
        // navigation.navigate('ProximaTela');
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollContainer}
            >
                {/* Seção de Informações Básicas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>INFORMAÇÕES DA MOTO</Text>
                    <View style={styles.card}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Placa</Text>
                            <TextInput
                                style={styles.input}
                                value={placa}
                                onChangeText={setPlaca}
                                placeholder="ABC-1234"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Cor</Text>
                            <TextInput
                                style={styles.input}
                                value={cor}
                                onChangeText={setCor}
                                placeholder="Ex: Vermelha"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Modelo</Text>
                            <TextInput
                                style={styles.input}
                                value={modelo}
                                onChangeText={setModelo}
                                placeholder="Ex: CG 160 Titan"
                                placeholderTextColor="#aaa"
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                <Text style={styles.label}>Ano</Text>
                                <TextInput
                                    style={styles.input}
                                    value={ano}
                                    onChangeText={setAno}
                                    placeholder="2023"
                                    placeholderTextColor="#aaa"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Quilometragem</Text>
                                <TextInput
                                    style={styles.input}
                                    value={quilometragem}
                                    onChangeText={setQuilometragem}
                                    placeholder="15000"
                                    placeholderTextColor="#aaa"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Seção de Checklist */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>CHECKLIST DE AVALIAÇÃO</Text>
                    <View style={styles.card}>
                        {checklist.map((item, index) => (
                            <View
                                key={item.id}
                                style={[
                                    styles.checklistItem,
                                    index !== checklist.length - 1 && styles.itemBorder
                                ]}
                            >
                                <Text style={styles.checklistLabel}>{item.label}</Text>
                                {renderInput(item)}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Botão de Envio */}
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>GERAR ORDEM DE SERVIÇO</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Modal para upload de foto */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Adicionar {currentPhotoItem?.label}</Text>

                        <TouchableOpacity
                            style={[styles.modalButton, styles.cameraButton, { backgroundColor: '#f0660a' }]}
                            onPress={takePhoto}
                        >
                            <Icon name="camera" size={20} color="#fff" />
                            <Text style={styles.modalButtonText}>Tirar Foto</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#333' }]}
                            onPress={selectFromGallery}
                        >
                            <Icon name="image" size={20} color="#fff" />
                            <Text style={styles.modalButtonText}>Escolher da Galeria</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalCancelText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    scrollContainer: {
        padding: 15,
        paddingBottom: 30
    },
    section: {
        marginBottom: 20
    },
    sectionTitle: {
        color: '#f0660a',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 5,

    },
    card: {
        backgroundColor: '#2a2a2a',  // Card escuro
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        borderLeftWidth: 3,
        borderLeftColor: '#f0660a'
    },
    inputGroup: {
        marginBottom: 15
    },
    label: {
        color: '#fff',  // Texto branco
        marginBottom: 5,
        fontWeight: '500'
    },
    input: {
        backgroundColor: '#333',  // Input escuro
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#fff'
    },
    row: {
        flexDirection: 'row'
    },
    checklistItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15
    },
    itemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    checklistLabel: {
        color: '#fff',  // Texto branco
        fontSize: 15,
        flex: 1,
        marginRight: 15
    },
    photoButton: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#333',
        borderWidth: 1,
        borderColor: '#f0660a',  // Borda laranja
        justifyContent: 'center',
        alignItems: 'center'
    },
    photoPreview: {
        width: '100%',
        height: '100%',
        borderRadius: 7
    },
    submitButton: {
        backgroundColor: '#f0660a',  // Botão laranja
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#2a2a2a',  // Modal escuro
        borderRadius: 10,
        padding: 20,
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff'
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 8,
        width: '100%',
        justifyContent: 'center',
        marginBottom: 10
    },
    cameraButton: {
        backgroundColor: '#f0660a'
    },
    galleryButton: {
        backgroundColor: '#4CAF50'
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10
    },
    modalCancelButton: {
        marginTop: 10,
        padding: 10
    },
    modalCancelText: {
        color: '#f0660a',
        fontWeight: 'bold'
    }
});

export default OrdemServico;