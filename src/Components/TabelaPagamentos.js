import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TabelaPagamentos = ({ pagamentos }) => {
    if (pagamentos.length === 0) return null;

    // Calcula o total
    const total = pagamentos.reduce((sum, item) => sum + item.valor, 0);
    const totalFormatado = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Ícones e cores para cada método
    const getPaymentIcon = (metodo) => {
        switch(metodo.toLowerCase()) {
            case 'pix': return ['qr-code', '#32BCAD'];
            case 'dinheiro': return ['money', '#4CAF50'];
            case 'débito':
            case 'debito': return ['credit-card', '#2196F3'];
            case 'crédito':
            case 'credito': return ['payment', '#9C27B0'];
            case 'faturado': return ['receipt', '#F44336'];
            default: return ['attach-money', '#607D8B'];
        }
    };

    // Renderiza cada item
    const renderItem = ({ item }) => {
        const [iconName, iconColor] = getPaymentIcon(item.metodo);
        
        return (
            <View style={styles.itemContainer}>
                <View style={styles.itemLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: '#2a2a2a' }]}>
                        <Icon name={iconName} size={20} color={iconColor} />
                    </View>
                    <Text style={[styles.metodoText, { color: '#FFF' }]}>
                        {item.metodo.charAt(0).toUpperCase() + item.metodo.slice(1)}
                    </Text>
                </View>
                <Text style={styles.valorText}>{item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Cabeçalho */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>PAGAMENTOS</Text>
                <View style={styles.headerDivider} />
            </View>
            
            {/* Lista */}
            <FlatList 
                data={pagamentos}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContent}
                style={styles.list}
                scrollEnabled={pagamentos.length > 3}
            />
            
            {/* Total */}
            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>TOTAL PAGO:</Text>
                <Text style={styles.totalValue}>{totalFormatado}</Text>
            </View>
        </View>
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
        width: windowWidth - 40,
        maxHeight: (windowHeight / 10) * 4,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#2a2a2a',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    header: {
        marginBottom: 12,
    },
    headerTitle: {
        color: "#f0660a",
        fontWeight: '700',
        fontSize: 16,
        textAlign: 'center',
        letterSpacing: 1,
    },
    headerDivider: {
        height: 2,
        backgroundColor: '#f0660a',
        width: '30%',
        alignSelf: 'center',
        marginTop: 8,
        borderRadius: 2,
        opacity: 0.5
    },
    list: {
        flexGrow: 0,
    },
    listContent: {
        paddingBottom: 8,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#333'
    },
    metodoText: {
        fontSize: 14,
        fontWeight: '500',
    },
    valorText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: '600',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#2a2a2a',
    },
    totalLabel: {
        color: "#f0660a",
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    totalValue: {
        color: "#4CAF50",
        fontSize: 15,
        fontWeight: '700',
    },
});

export default TabelaPagamentos;