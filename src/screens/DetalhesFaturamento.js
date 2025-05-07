import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const DetalhesFaturamento = ({ route }) => {
    const { faturamento } = route.params;
    const navigation = useNavigation();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'faturado': return '#4CAF50';
            case 'cancelado': return '#F44336';
            case 'aberto': return '#FFC107';
            default: return '#9E9E9E';
        }
    };

    const getPaymentIcon = (tipo) => {
        switch (tipo) {
            case 'cartão': return 'credit-card';
            case 'dinheiro': return 'money-bill-wave';
            case 'pix': return 'qrcode';
            default: return 'money-check-alt';
        }
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={20} color="#f0660a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>DETALHES DO FATURAMENTO</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Cabeçalho */}
                <View style={styles.card}>
                    <View style={styles.rowSpaceBetween}>
                        <Text style={styles.idText}>#{faturamento.faturamentoId.toString().padStart(3, '0')}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(faturamento.status) }]}>
                            <Text style={styles.statusText}>{faturamento.status.toUpperCase()}</Text>
                        </View>
                    </View>
                    <Text style={styles.clienteText}>{faturamento.venda.clienteNome}</Text>

                    <Text style={styles.dataText}>{formatarData(faturamento.data)}</Text>
                </View>


                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Produtos</Text>
                    <View style={styles.card}>
                        <View style={styles.productTableHeader}>
                            <Text style={[styles.productCol, styles.headerText]}>Produto</Text>
                            <Text style={[styles.productColSmall, styles.headerText]}>Qtd</Text>
                            <Text style={[styles.productColSmall, styles.headerText]}>Desc</Text>
                            <Text style={[styles.productColSmall, styles.headerText]}>Total</Text>
                        </View>

                        {faturamento.venda.produtos.map((prod, index) => (
                            <View key={index} style={styles.productTableRow}>
                                <Text style={styles.productCol}>{prod.produtoNome}</Text>
                                <Text style={styles.productColSmall}>{prod.qtd}</Text>
                                <Text style={styles.productColSmall}>{prod.desconto}%</Text>
                                <Text style={styles.productColSmall}>
                                    R$ {Number(prod.valorTotal).toFixed(2).replace('.', ',')}
                                </Text>
                            </View>
                        ))}

                        <View style={styles.divider} />

                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>VALOR TOTAL</Text>
                            <Text style={styles.totalValue}>
                                R$ {Number(faturamento.valor).toFixed(2).replace('.', ',')}
                            </Text>
                        </View>
                    </View>
                </View>


                {/* Informações Adicionais */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações</Text>
                    <View style={styles.card}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Venda numero:</Text>
                            <Text style={styles.infoValue}>{faturamento.venda.vendaId}</Text>
                        </View>
                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Data da venda:</Text>
                            <Text style={styles.infoValue}>{formatarData(faturamento.venda.data)}</Text>
                        </View>
                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Vendedor:</Text>
                            <Text style={styles.infoValue}>{faturamento.user}</Text>
                        </View>
                    </View>
                </View>

                {/* Ações */}
                <View style={styles.actionsContainer}>
                    {faturamento.status === 'faturado' && (
                        <TouchableOpacity style={styles.actionButton}>
                            <Icon name="print" size={16} color="#fff" />
                            <Text style={styles.actionText}>Imprimir Recibo</Text>
                        </TouchableOpacity>
                    )}

                    {faturamento.status === 'aberto' && (
                        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                            <Icon name="dollar-sign" size={16} color="#f0660a" />
                            <Text style={[styles.actionText, styles.secondaryActionText]}>Pagar</Text>
                        </TouchableOpacity>
                    )}
                </View>

            </ScrollView>
        </Animated.View>
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#2a2a2a',
        borderBottomWidth: 1,
        borderBottomColor: '#f0660a'
    },
    backButton: {
        padding: 5
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    productHeader: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingBottom: 5,
        marginBottom: 10
    },
    productCol: {
        flex: 1,
        fontSize: 14
    },
    headerRight: {
        width: 30
    },
    content: {
        padding: 15,
        paddingBottom: 30
    },
    card: {
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        padding: 20,
        marginBottom: 15
    },
    rowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    idText: {
        color: '#f0660a',
        fontSize: 16,
        fontWeight: 'bold'
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 15
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
    },
    clienteText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
    },
    dataText: {
        color: '#aaa',
        fontSize: 14
    },
    section: {
        marginBottom: 20
    },
    sectionTitle: {
        color: '#f0660a',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 5
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    paymentIcon: {
        marginRight: 10
    },
    paymentText: {
        color: '#fff',
        fontSize: 16
    },
    noPaymentText: {
        color: '#aaa',
        fontStyle: 'italic',
        marginBottom: 15
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 10
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    totalLabel: {
        color: '#aaa',
        fontSize: 14
    },
    totalValue: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    infoLabel: {
        color: '#aaa',
        fontSize: 14
    },
    infoValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500'
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0660a',
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 5
    },
    actionText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#f0660a'
    },
    secondaryActionText: {
        color: '#f0660a'
    },
    productTableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)',
        paddingBottom: 8,
        marginBottom: 8
      },
      productTableRow: {
        flexDirection: 'row',
        marginBottom: 6
      },
      productCol: {
        flex: 2,
        color: '#fff',
        fontSize: 14
      },
      productColSmall: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
        textAlign: 'center'
      },
      headerText: {
        fontWeight: 'bold',
        color: '#f0660a'
      }
      
});

export default DetalhesFaturamento;