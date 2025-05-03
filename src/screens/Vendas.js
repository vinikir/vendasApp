import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    TextInput,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../Api/api';
import { AuthContext } from '../Contexts/auth';
const Vendas = ({ navigation }) => {
    // Estados
    const [vendas, setVendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filtroAberto, setFiltroAberto] = useState(false);
    const [dataInicio, setDataInicio] = useState(new Date());
    const [dataFim, setDataFim] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(null);
    const [busca, setBusca] = useState('');
    const [buscando, setBuscando] = useState(false);

    const { userInfos } = useContext(AuthContext);

    // Simulação de busca de vendas (substitua pela sua API real)
    const buscarVendas = async () => {
        setLoading(true);
        setBuscando(true)
        try {
            // Formata as datas para o formato YYYY-MM-DD
            const dataInicioFormatada = moment(dataInicio).format('YYYY-MM-DD');
            const dataFimFormatada = moment(dataFim).format('YYYY-MM-DD');

            api.post('/venda/buscar/vendedor', {
                "dataInicio": dataInicioFormatada,
                "dataFim": dataFimFormatada,
                "userId": userInfos.id
            }).then((res) => {

                setVendas(res.data.valor)
            })


        } catch (error) {
            console.error('Erro ao buscar vendas:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setBuscando(false)
        }
    };

    // Atualiza a lista quando o componente é montado
    useEffect(() => {
        buscarVendas();
    }, []);

    // Atualiza a lista quando as datas de filtro são alteradas
    useEffect(() => {
        if (!loading) {
            buscarVendas();
        }
    }, [dataInicio, dataFim]);

    // Função para lidar com o refresh
    const onRefresh = () => {
        setRefreshing(true);
        buscarVendas();
    };

    // Função para formatar o valor monetário
    const formatarValor = (valor) => {
        return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    };

    // Função para lidar com a seleção de data
    const onChangeDate = (event, selectedDate, tipo) => {
        setShowDatePicker(null);
        if (selectedDate) {
            if (tipo === 'inicio') {
                setDataInicio(selectedDate);
            } else {
                setDataFim(selectedDate);
            }
        }
    };


    function primeiraLetraMaiuscula(texto) {
        if (!texto) return "";
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    // Componente de item da lista
    const ItemVenda = ({ item }) => {

        return (

            <TouchableOpacity
                style={[
                    styles.itemContainer,
                    item.status === 'Cancelada' && styles.itemCancelado
                ]}
                onPress={() => navigation.navigate('DetalheVenda', { venda: item })}
            >
                <View style={styles.itemHeader}>
                    <Text style={styles.itemId}>#{item.vendaId}</Text>
                    <Text style={[
                        styles.itemStatus,
                        item.status === 'Finalizada' ? styles.statusFinalizada : styles.statusCancelada
                    ]}>
                        {primeiraLetraMaiuscula(item.status)}
                    </Text>
                </View>

                <Text style={styles.itemCliente}>{item.cliente}</Text>

                <View style={styles.itemFooter}>
                    <Text style={styles.itemData}>
                        {moment(item.data).format('DD/MM/YYYY')}
                    </Text>
                    <Text style={styles.itemValor}>
                        {formatarValor(item.valor)}
                    </Text>
                </View>
            </TouchableOpacity>
        );

    }
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Icon name="arrow-left" size={20} color="#f0660a" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>VENDAS</Text>
                </View>

                <TouchableOpacity
                    onPress={() => setFiltroAberto(!filtroAberto)}
                    style={styles.filterButton}
                >
                    <Icon
                        name={filtroAberto ? "times" : "filter"}
                        size={20}
                        color="#f0660a"
                    />
                </TouchableOpacity>
            </View>

            {/* Filtros */}
            {filtroAberto && (
                <View style={styles.filtroContainer}>
                    <Text style={styles.filtroTitulo}>Filtrar por período</Text>

                    <View style={styles.dateInputContainer}>

                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => setShowDatePicker('inicio')}
                        >
                            <Icon name="calendar-alt" size={16} color="#f0660a" />
                            <Text style={styles.dateText}>
                                {moment(dataInicio).format('DD/MM/YYYY')}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.dateSeparator}>à</Text>

                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => setShowDatePicker('fim')}
                        >
                            <Icon name="calendar-alt" size={16} color="#f0660a" />
                            <Text style={styles.dateText}>
                                {moment(dataFim).format('DD/MM/YYYY')}
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <TextInput
                        style={styles.buscaInput}
                        placeholder="Buscar por cliente..."
                        placeholderTextColor="#aaa"
                        value={busca}
                        onChangeText={setBusca}
                    />
                    <TouchableOpacity
                        style={styles.buscarButton}
                        onPress={buscarVendas}
                        disabled={buscando}
                    >
                        {buscando ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buscarButtonText}>
                                <Icon name="search" size={14} color="#fff" /> BUSCAR
                            </Text>
                        )}
                    </TouchableOpacity>

                </View>
            )}

            {/* DatePicker */}
            {showDatePicker && (
                <DateTimePicker
                    value={showDatePicker === 'inicio' ? dataInicio : dataFim}
                    mode="date"
                    display="default"
                    onChange={(event, date) => onChangeDate(event, date, showDatePicker)}
                />
            )}

            {/* Lista de vendas */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#f0660a" />
                </View>
            ) : (
                <FlatList
                    // data={vendas.filter(venda =>
                    //     venda?.cliente?.toLowerCase().includes(busca.toLowerCase())
                    // )}
                    data={vendas}
                    renderItem={({ item }) => <ItemVenda item={item} />}
                    keyExtractor={item => item._id.toString()}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["#f0660a"]}
                            tintColor="#f0660a"
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="receipt" size={40} color="#aaa" />
                            <Text style={styles.emptyText}>Nenhuma venda encontrada</Text>
                            <Text style={styles.emptySubtext}>Ajuste seus filtros ou tente novamente</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
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
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    filterButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(240, 102, 10, 0.1)'
    },
    filtroContainer: {
        padding: 15,
        backgroundColor: '#2a2a2a',
        borderBottomWidth: 1,
        borderBottomColor: '#333'
    },
    filtroTitulo: {
        color: '#aaa',
        fontWeight: 'bold',
        marginBottom: 10
    },
    dateInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    dateInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#444',
        backgroundColor: '#3a3a3a',
        borderRadius: 5
    },
    dateText: {
        marginLeft: 10,
        color: '#fff'
    },
    dateSeparator: {
        marginHorizontal: 10,
        color: '#aaa'
    },
    buscaInput: {
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 10,
        color: '#333'
    },
    listContainer: {
        paddingBottom: 20
    },
    itemContainer: {
        borderRadius: 8,
        padding: 15,
        marginHorizontal: 15,
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        backgroundColor: '#2a2a2a',  // Card escuro
        borderLeftWidth: 4,          // Borda lateral
        borderLeftColor: '#f0660a',
    },
    itemCancelado: {
        opacity: 0.7
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    itemId: {
        color: '#f0660a',
        fontWeight: 'bold',
        fontSize: 16
    },
    itemStatus: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10
    },
    statusFinalizada: {
        backgroundColor: '#e8f5e9',
        color: '#2e7d32'
    },
    statusCancelada: {
        backgroundColor: '#ffebee',
        color: '#c62828'
    },
    itemCliente: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    itemData: {
        color: '#fff',
        fontSize: 14
    },
    itemValor: {
        color: '#2a2a2a',
        fontWeight: 'bold',
        fontSize: 16
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40
    },
    emptyText: {
        color: '#555',
        fontSize: 16,
        marginTop: 15
    },
    emptySubtext: {
        color: '#aaa',
        fontSize: 14,
        marginTop: 5
    },
    backButton: {
        padding: 8,
        marginRight: 15
    },
    buscarButton: {
        backgroundColor: '#f0660a',
        borderRadius: 5,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    buscarButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14
    }
});

export default Vendas;