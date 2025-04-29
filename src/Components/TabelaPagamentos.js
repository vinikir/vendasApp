import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Dimensions
} from 'react-native';

const TabelaPagamentos = ({ pagamentos }) => {
    if (pagamentos.length === 0) return null;

    // Calcula o total
    const total = pagamentos.reduce((sum, item) => sum + item.valor, 0);
    const totalFormatado = `${total.toFixed(2)}`.replace(".", ",");

    // Renderiza cada item da lista
    const renderItem = ({ item }) => {
        const valorFormatado = `${item.valor.toFixed(2)}`.replace(".", ",");
        
        return (
            <View style={styles.itemContainer}>
                <View style={styles.colunaMetodo}>
                    <Text style={styles.label}>Método</Text>
                    <Text style={styles.valor}>{item.metodo}</Text>
                </View>
                <View style={styles.colunaValor}>
                    <Text style={styles.label}>Valor</Text>
                    <Text style={styles.valor}>R$ {valorFormatado}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Cabeçalho */}
            <View style={styles.cabecalho}>
                <Text style={styles.titulo}>PAGAMENTOS</Text>
            </View>
            
            {/* Lista de pagamentos */}
            <FlatList 
                data={pagamentos}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listaContent}
                style={styles.lista}
            />
            
            {/* Total */}
            <View style={styles.totalContainer}>
                <Text style={styles.totalTexto}>Total Pago:</Text>
                <Text style={styles.totalValor}>R$ {totalFormatado}</Text>
            </View>
        </View>
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#2a2a2a",
        borderRadius: 8,
        padding: 15,
        width: windowWidth - 40,
        maxHeight: (windowHeight / 10)*4,
        marginVertical: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cabecalho: {
        borderBottomWidth: 1,
        borderBottomColor: '#f0660a',
        paddingBottom: 8,
        marginBottom: 10,
    },
    titulo: {
        color: "#f0660a",
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    lista: {
        flexGrow: 0, // Impede que a lista cresça indefinidamente
    },
    listaContent: {
        paddingBottom: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#3a3a3a',
    },
    colunaMetodo: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    colunaValor: {
        flex: 1,
        alignItems: 'flex-end',
    },
    label: {
        color: "#aaa",
        fontSize: 14,
        marginRight: 10,
    },
    valor: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: '500',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#3a3a3a',
    },
    totalTexto: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalValor: {
        color: "#4CAF50",
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TabelaPagamentos;