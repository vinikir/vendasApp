import React, { useEffect, useState, useContext } from 'react';
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
import { BuscaOrcamentoServer } from '../Models/OrcamentosServer';
import ListagemOrcamento from '../Components/ListagemOrcamento';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const Orcamentos = () => {
    const [orcamentos, setOrcamentos] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const navigation = useNavigation();

    useEffect(() => {
        carregarOrcamentos();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start();
    }, []);

    const carregarOrcamentos = () => {
        setRefreshing(true);
        BuscaOrcamentoServer()
            .then((res) => {
                if(res.erro == false) {
                    setOrcamentos(res.valor);
                }
            })
            .catch((er) => {
                console.log("er", er);
            })
            .finally(() => setRefreshing(false));
    };

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
                
                <Text style={styles.title}>MEUS ORÇAMENTOS</Text>
                
                <View style={styles.headerRight} />
            </View>

            {/* Lista de orçamentos */}
            <FlatList 
                data={orcamentos}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        colors={["#f0660a", "#ff8c00"]}
                        refreshing={refreshing}
                        onRefresh={carregarOrcamentos}
                        tintColor="#f0660a"
                    />
                }
                ListHeaderComponent={
                    <Text style={styles.sectionSubtitle}>
                        {orcamentos.length} orçamentos encontrados
                    </Text>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="file-invoice-dollar" size={40} color="#f0660a" />
                        <Text style={styles.emptyText}>Nenhum orçamento encontrado</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <ListagemOrcamento 
                        item={item}
                        onPress={() => navigation.navigate('DetalhesOrcamento', { orcamento: item })}
                    />
                )}
                keyExtractor={(item) => item._id.toString()}
            />
        </Animated.View>
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
    sectionSubtitle: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 15,
        marginBottom: 10,
        paddingLeft: 5
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
    }
});

export default Orcamentos;