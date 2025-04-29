import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    Pressable,
    Dimensions,
    TextInput,
    StyleSheet,
    Animated,
    Easing,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import Botao from './Botao';

const ModalConfirmarAdicionarProduto = ({ modalAberto, item, fechaModal, callbackAdicionar }) => {
    const [qtd, setQtd] = useState(0);
    const [desconto, setDesconto] = useState(0);
    const [total, setTotal] = useState("0,00");
    const [msg, setMsg] = useState("");
    const [disabilitado, setDisabilitado] = useState(false);
    const [scaleAnim] = useState(new Animated.Value(0.8));
    const [opacityAnim] = useState(new Animated.Value(0));

    if (typeof item == "undefined" || item.nome == "undefined") {
        return null;
    }

    useEffect(() => {
        if (modalAberto) {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.back(1.2)),
                    useNativeDriver: true
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: 200,
                    useNativeDriver: true
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true
                })
            ]).start();
        }
    }, [modalAberto]);

    const calcularDesconto = (valor, porcentagemDesconto) => {
        const valorDesconto = (valor * porcentagemDesconto) / 100;
        const valorDescontado = valor - valorDesconto;
        return valorDescontado;
    };

    const cancelar = () => {
        setQtd(0);
        setDesconto(0);
        setTotal("0,00");
        setMsg("");
        fechaModal();
    };

    const atualizarValores = (newQtd, newDesc) => {
        let precoFormatado = `${item.valorVenda.toFixed(2)}`.replace('.', ',');
        const t = parseFloat(precoFormatado.replace(',', '.')) * newQtd;
        let precoT = calcularDesconto(t, newDesc);
        precoT = `${precoT.toFixed(2)}`.replace('.', ',');
        setTotal(precoT);
    };

    const atualizarQtd = (qtd2) => {
        if (qtd2 === "") qtd2 = 0;
        const qtdNum = parseInt(qtd2) || 0;

        if (qtdNum > item.estoque && item.tipo != "servico") {
            setMsg("Quantidade maior que o estoque disponível");
            setQtd(0);
            setDisabilitado(true);
            setTotal("0,00");
            return;
        }

        setDisabilitado(false);
        setMsg("");
        setQtd(qtdNum);
        atualizarValores(qtdNum, desconto);
    };

    const atualizarDesconto = (desc) => {
        if (desc === "") desc = 0;
        const descNum = parseInt(desc) || 0;

        if (descNum > item.descontoMaximo) {
            setMsg(`Desconto máximo permitido: ${item.descontoMaximo}%`);
            setDesconto(0);
            setDisabilitado(true);
            setTotal("0,00");
            return;
        }

        setDisabilitado(false);
        setMsg("");
        setDesconto(descNum);
        atualizarValores(qtd, descNum);
    };

    const adicionar = () => {
        if (qtd <= 0) {
            setMsg("Informe a quantidade");
            return;
        }

        const json = {
            produtoId: item._id,
            produtoNome: item.nome,
            qtd: qtd,
            valorUnitario: item.valorVenda,
            valorTotal: parseFloat(total.replace(',', '.')),
            desconto: desconto,
            tipo: item.tipo
        };

        setTotal("0,00");
        setDesconto(0);
        setQtd(0);
        callbackAdicionar(json);
    };

    const precoFormatado = `${item.valorVenda.toFixed(2)}`.replace('.', ',');

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalAberto}
            onRequestClose={cancelar}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
                    <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleAnim }] }]}>
                        <LinearGradient
                            colors={['#2a2a2a', '#1a1a1a']}
                            style={styles.gradientBackground}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            {/* Header do Modal */}
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>ADICIONAR PRODUTO</Text>
                                <Pressable onPress={cancelar} style={styles.closeButton}>
                                    <Icon name="times" size={20} color="#f0660a" />
                                </Pressable>
                            </View>

                            {/* Corpo do Modal */}
                            <View style={styles.modalBody}>
                                {/* Informações do Produto */}
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName}>{item.nome}</Text>
                                    
                                    <View style={styles.priceRow}>
                                        <View style={styles.priceContainer}>
                                            <Text style={styles.priceLabel}>VALOR UNITÁRIO</Text>
                                            <Text style={styles.priceValue}>R$ {precoFormatado}</Text>
                                        </View>
                                        
                                        {item.tipo != "servico" && (
                                            <View style={styles.stockContainer}>
                                                <Text style={styles.stockLabel}>ESTOQUE</Text>
                                                <Text style={styles.stockValue}>{item.estoque}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* Divisor */}
                                <View style={styles.divider} />

                                {/* Campos de Input */}
                                <View style={styles.inputsContainer}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>QUANTIDADE</Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput
                                                style={styles.input}
                                                keyboardType='numeric'
                                                onChangeText={atualizarQtd}
                                                value={qtd.toString()}
                                                placeholder="0"
                                                placeholderTextColor="#666"
                                                selectionColor="#f0660a"
                                            />
                                            <Icon name="hashtag" size={14} color="#f0660a" style={styles.inputIcon} />
                                        </View>
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>DESCONTO (%)</Text>
                                        <View style={styles.inputWrapper}>
                                            <TextInput
                                                style={styles.input}
                                                keyboardType='numeric'
                                                onChangeText={atualizarDesconto}
                                                value={desconto.toString()}
                                                placeholder="0"
                                                placeholderTextColor="#666"
                                                selectionColor="#f0660a"
                                            />
                                            <Icon name="percentage" size={14} color="#f0660a" style={styles.inputIcon} />
                                        </View>
                                    </View>
                                </View>

                                {/* Total */}
                                <View style={styles.totalContainer}>
                                    <Text style={styles.totalLabel}>TOTAL</Text>
                                    <Text style={styles.totalValue}>R$ {total}</Text>
                                </View>

                                {/* Mensagem de erro */}
                                {msg ? <Text style={styles.errorText}>{msg}</Text> : null}
                            </View>

                            {/* Footer do Modal */}
                            <View style={styles.modalFooter}>
                                {/* <Botao 
                                    label="CANCELAR"
                                    color='#fff'
                                    callback={cancelar}
                                    backgroundColor='#ff3a30'
                                    style={styles.cancelButton}
                                    icon="times"
                                    iconColor="#fff"
                                /> */}
                                
                                <Botao 
                                    label="ADICIONAR ITEM"
                                    color='#fff'
                                    callback={adicionar}
                                    disabled={disabilitado}
                                    backgroundColor='#4CAF50'
                                    style={styles.confirmButton}
                                    icon="check"
                                    iconColor="#fff"
                                />
                            </View>
                        </LinearGradient>
                    </Animated.View>
                </Animated.View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContainer: {
        width: windowWidth - 40,
        maxHeight: windowHeight * 0.8,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#f0660a',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10
    },
    gradientBackground: {
        padding: 0
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(240, 102, 10, 0.3)'
    },
    modalTitle: {
        color: '#f0660a',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    closeButton: {
        padding: 5
    },
    modalBody: {
        padding: 20
    },
    productInfo: {
        marginBottom: 20
    },
    productName: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center'
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    priceContainer: {
        flex: 1,
        paddingRight: 10
    },
    stockContainer: {
        flex: 1,
        paddingLeft: 10,
        alignItems: 'flex-end'
    },
    priceLabel: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 5
    },
    priceValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    stockLabel: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 5,
        textAlign: 'right'
    },
    stockValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right'
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(240, 102, 10, 0.2)',
        marginVertical: 15
    },
    inputsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    inputGroup: {
        width: '48%'
    },
    inputLabel: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 5
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0660a',
        paddingBottom: 5
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        paddingVertical: 5,
        paddingRight: 5
    },
    inputIcon: {
        marginLeft: 5
    },
    totalContainer: {
        alignItems: 'center',
        marginBottom: 15
    },
    totalLabel: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 5
    },
    totalValue: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold'
    },
    errorText: {
        color: '#ff3a30',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5
    },
    modalFooter: {
       
        justifyContent: 'space-around',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(240, 102, 10, 0.3)',
        flexDirection:"column"
    },
    cancelButton: {
        flex: 1,
        marginRight: 10
    },
    confirmButton: {
        flex: 1,
        marginLeft: 10
    }
});

export default ModalConfirmarAdicionarProduto;