import { 
    Text, 
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Animated
} from "react-native"
import { useNavigation } from '@react-navigation/native';
import moment from "moment"
import Icon from 'react-native-vector-icons/dist/FontAwesome5';

const ListagemOrcamento = ({ item }) => {
    const data = moment(item.data).format("DD/MM/YYYY");
    const navigation = useNavigation();
    const scaleAnim = new Animated.Value(1);

    const valorTotal = item.produtos.reduce((total, produto) => total + produto.valorTotal, 0);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true
        }).start();
    };

    const redirecionar = () => {
        navigation.navigate("OrcamentoDetalhe", { orcamento: item });
    };

    const getStatusColor = () => {
        switch(item.status.toLowerCase()) {
            case 'aprovado': return '#4CAF50';
            case 'pendente': return '#FFC107';
            case 'cancelado': return '#F44336';
            default: return '#9E9E9E';
        }
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity 
                onPress={redirecionar}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
                style={styles.card}
            >   
                <View style={styles.contentContainer}>
                    {/* Header com número e status */}
                    <View style={styles.header}>
                        <Text style={styles.orcamentoId}>ORÇAMENTO #{item.orcamentoId}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                        </View>
                    </View>

                    {/* Informações principais */}
                    <View style={styles.infoRow}>
                        <Icon name="calendar-alt" size={14} color="#aaa" style={styles.icon} />
                        <Text style={styles.infoText}>{data}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="user-tie" size={14} color="#aaa" style={styles.icon} />
                        <Text style={styles.infoText}>{item.user}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="user" size={14} color="#aaa" style={styles.icon} />
                        <Text style={styles.infoText}>{item.cliente || 'Cliente não informado'}</Text>
                    </View>

                    {/* Footer com valor total */}
                    <View style={styles.footer}>
                        <Text style={styles.valorLabel}>VALOR TOTAL:</Text>
                        <Text style={styles.valorTotal}>R$ {valorTotal.toFixed(2).replace(".",",")}</Text>
                    </View>
                </View>

                <Icon 
                    name="chevron-right" 
                    size={16} 
                    color="#f0660a" 
                    style={styles.arrowIcon} 
                />
            </TouchableOpacity>
        </Animated.View>
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#2a2a2a",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeftWidth: 4,
        borderLeftColor: '#f0660a',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3
    },
    contentContainer: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    orcamentoId: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 10
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
    },
    icon: {
        marginRight: 10,
        width: 20,
        textAlign: 'center'
    },
    infoText: {
        color: '#fff',
        fontSize: 14,
        flex: 1
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#3a3a3a'
    },
    valorLabel: {
        color: '#aaa',
        fontSize: 12,
        fontWeight: 'bold'
    },
    valorTotal: {
        color: '#f0660a',
        fontSize: 18,
        fontWeight: 'bold'
    },
    arrowIcon: {
        marginLeft: 10
    }
});

export default ListagemOrcamento;