import React, { useEffect, useState } from 'react';
import { 
    Text, 
    View,
    FlatList,
    Dimensions,
    StyleSheet,
    Animated,
    RefreshControl,
    TouchableOpacity
} from "react-native";
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import api from '../Api/api';


const Faturados = () => {
    const [faturados, setFaturados] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const navigation = useNavigation();

    useEffect(() => {
        carregarFaturados();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start();
    }, []);

    const carregarFaturados = () => {
        setRefreshing(true);
        

        api.get('/faturados').then( (res) => {
            
            setFaturados(res.data.valor)
        }).finally( () => {
            setRefreshing(false);
        })
        
        
    };

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'faturado': return '#4CAF50';
            case 'cancelado': return '#F44336';
            case 'aberto': return '#FFC107';
            default: return '#9E9E9E';
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.itemContainer}
            onPress={() => navigation.navigate('DetalhesFaturamento', { faturamento: item })}
        >
            <View style={styles.itemHeader}>
                <View>
                    <Text style={styles.clienteNome}>Cliente:{item.venda.clienteNome}</Text>
                    <Text style={styles.clienteNome}>Vendedor:{item.user}</Text>
                    <Text style={styles.itemId}>Fatura #00{item.faturamentoId}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
            </View>
            
            <View style={styles.itemBody}>
                <View style={styles.infoColumn}>
                    <Text style={styles.infoLabel}>Data</Text>
                    <Text style={styles.infoValue}>{formatarData(item.data)}</Text>
                </View>
                
                <View style={styles.infoColumn}>
                    <Text style={styles.infoLabel}>Valor</Text>
                    <Text style={styles.valorText}>R$ {item.valor.toFixed(2)}</Text>
                </View>
            </View>
            
            {item.pagamento.length > 0 && (
                <View style={styles.pagamentoContainer}>
                    <Icon 
                        name={item.pagamento[0] === 'cartão' ? 'credit-card' : 'money-bill-wave'} 
                        size={14} 
                        color="#f0660a" 
                    />
                    <Text style={styles.pagamentoText}>
                        {item.pagamento[0]}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon name="arrow-left" size={20} color="#f0660a" />
                </TouchableOpacity>
                
                <Text style={styles.title}>FATURADOS</Text>
                
                <View style={styles.headerRight} />
            </View>

            {/* Lista de faturados */}
            <FlatList 
                data={faturados}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        colors={["#f0660a", "#ff8c00"]}
                        refreshing={refreshing}
                        onRefresh={carregarFaturados}
                        tintColor="#f0660a"
                    />
                }
                ListHeaderComponent={
                    <View style={styles.headerList}>
                        <Text style={styles.sectionSubtitle}>
                            {faturados.length} faturamentos encontrados
                        </Text>
                        <TouchableOpacity style={styles.filterButton}>
                            <Text style={styles.filterText}>Filtrar</Text>
                            <Icon name="filter" size={12} color="#f0660a" />
                        </TouchableOpacity>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="file-invoice" size={40} color="#f0660a" />
                        <Text style={styles.emptyText}>Nenhum faturamento encontrado</Text>
                    </View>
                }
                renderItem={renderItem}
                keyExtractor={(item) => item._id.toString()}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a1a1a"
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
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    headerRight: {
        width: 30
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 20
    },
    headerList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 10
    },
    sectionSubtitle: {
        color: '#aaa',
        fontSize: 12,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#f0660a',
        borderRadius: 15
    },
    filterText: {
        color: '#f0660a',
        fontSize: 12,
        marginRight: 5
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        opacity: 0.7
    },
    emptyText: {
        color: "#fff",
        fontSize: 16,
        marginTop: 15
    },
    itemContainer: {
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#f0660a'
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    clienteNome: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2
    },
    itemId: {
        color: '#aaa',
        fontSize: 12
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold'
    },
    itemBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    infoColumn: {
        flex: 1
    },
    infoLabel: {
        color: '#aaa',
        fontSize: 10,
        marginBottom: 2
    },
    infoValue: {
        color: '#fff',
        fontSize: 12
    },
    valorText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    },
    pagamentoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)'
    },
    pagamentoText: {
        color: '#f0660a',
        fontSize: 12,
        marginLeft: 5,
        textTransform: 'capitalize'
    }
});

export default Faturados;