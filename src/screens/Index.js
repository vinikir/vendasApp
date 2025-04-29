import React, { useEffect, useMemo, useState, useContext } from 'react';
import { 
    Text,
    View,
    Dimensions,
    StyleSheet,
    FlatList,
    StatusBar,
    TouchableOpacity,
    TextInput,
    RefreshControl,
    Animated,
    Easing
} from 'react-native';
import { BuscarProdutosServer } from '../Models/ProdutosServerModel';
import RadioGroup from 'react-native-radio-buttons-group';
import ProdutoListagem from '../Components/ProdutoListagem';
import Bag from '../Components/Bag';
import { AuthContext } from '../Contexts/auth';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import Icon2 from 'react-native-vector-icons/dist/Feather';
import SideMenuComponent from '../Components/SideMenu';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Index = ({ route }) => {
    const [produtos, setProdutos] = useState([]);
    const [itensBag, setItensBag] = useState([]);
    const [busca, setBusca] = useState("");
    const [selectedId, setSelectedId] = useState();
    const [buscaVisivel, setBuscaVisivel] = useState(false);
    const [refreshing, setRefreshing] = useState(false); 
    const [sideMenuAberto, setSidemenuAberto] = useState(false);

    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(-100))[0];

    const { userInfos } = useContext(AuthContext);
    
    useEffect(() => {
        buscaItensServe();
        startAnimations();
    }, []);

    const startAnimations = () => {
        // Animação de fade-in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start();
        
        // Animação de slide
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true
        }).start();
    };

    const buscaItensServe = () => {
        BuscarProdutosServer().then(res => {
            setProdutos(res.valor);
        });
    };

    if (typeof route != "undefined" && typeof route.params != "undefined" && 
        typeof route.params.limparBag != "undefined" && route.params.limparBag == true) {
        setItensBag([]);
        buscaItensServe();
        route.params = {};
    }

    const radioButtons = useMemo(() => ([
        {
            id: '1',
            label: 'Serviço',
            value: 'option1',
            color: "#f0660a",
            selectedColor: "#fff",
            borderColor: "#f0660a",
            labelStyle: { 
                color: "#fff", 
                fontWeight: "bold",
                fontFamily: 'Roboto-Medium'
            },
            containerStyle: {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: '#f0660a',
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginRight: 8
            }
        },
        {
            id: '2',
            label: 'Peças',
            value: 'option2',
            color: "#f0660a",
            selectedColor: "#fff",
            borderColor: "#f0660a",
            labelStyle: { 
                color: "#fff", 
                fontWeight: "bold",
                fontFamily: 'Roboto-Medium'
            },
            containerStyle: {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: '#f0660a',
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginRight: 8
            }
        },
        {
            id: '3',
            label: 'Todos',
            value: 'option3',
            color: "#f0660a",
            selectedColor: "#fff",
            borderColor: "#f0660a",
            labelStyle: { 
                color: "#fff", 
                fontWeight: "bold",
                fontFamily: 'Roboto-Medium'
            },
            containerStyle: {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: '#f0660a',
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 6
            }
        }
    ]), []);


    const adicionarItemBag = (jsonItem) => {
        let i = JSON.parse(JSON.stringify(itensBag));
        const index = i.findIndex((el) => el.produtoId == jsonItem.produtoId);
       
        if (index < 0) {
            i.push(jsonItem);
        } else {
            i[index].qtd = parseInt(i[index].qtd) + parseInt(jsonItem.qtd);
            i[index].valorTotal = i[index].valorTotal + jsonItem.valorTotal;
        } 
       
        setItensBag(i);
    };

    const removerItem = (itemid) => {
        let i = itensBag.filter((el) => el.produtoId != itemid);
        setItensBag(i);
    };

    const onRefresh = () => {
        buscaItensServe();
    };

    const limparBag = (chamaItens) => {
        if (chamaItens == true) {
            buscaItensServe();
        }
        setItensBag([]);
    };

    const MostraBag = () => {
        if (itensBag.length > 0) {
            return (
                <Bag 
                    itensBag={itensBag}
                    countItens={itensBag.length}
                    removerItem={(itemId) => removerItem(itemId)}
                    user={userInfos}
                    limparBag={(chamaItens) => limparBag(chamaItens)}
                />
            );
        }
        return null;
    };

    const BuscarComFiltro = () => {
        let tipoItem;

        if (selectedId == 1) {
            tipoItem = "servico";
        }

        if (selectedId == 2) {
            tipoItem = "venda";
        }

        BuscarProdutosServer(busca, tipoItem).then(res => {
            setProdutos(res.valor);
            setBuscaVisivel(false);
            setBusca("");
        });
    };

    const ComponentBusca = () => {
        if (!buscaVisivel) return null;
        
        return (
            <View style={styles.buscaContainer}>
                <View style={styles.buscaContent}>
                    <View>
                        <RadioGroup 
                            layout="row"
                            radioButtons={radioButtons} 
                            onPress={setSelectedId}
                            selectedId={selectedId}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.input}
                            onChangeText={(tex) => setBusca(tex)}
                            value={busca}
                            placeholder="Digite para buscar..."
                            placeholderTextColor="rgba(0, 0, 0, 0.6)"
                        />
                    </View>
                    <View style={styles.buscaButtons}>
                        <TouchableOpacity 
                            onPress={BuscarComFiltro} 
                            style={[styles.button, styles.buttonPrimary]}
                        >
                            <Text style={styles.buttonText}>Buscar</Text> 
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setBuscaVisivel(false)} 
                            style={[styles.button, styles.buttonSecondary]}
                        >
                            <Text style={styles.buttonText}>Fechar</Text> 
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <Animated.View style={[styles.safeArea, { opacity: fadeAnim }]}>
            <SideMenuComponent abreSideMenu={sideMenuAberto} />
            
            <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
                <TouchableOpacity 
                    onPress={() => setSidemenuAberto(!sideMenuAberto)} 
                    style={styles.menuButton}
                >
                    <Icon2 name="menu" size={24} color="#f0660a" />
                </TouchableOpacity>
                
                <View style={styles.userInfo}>
                    <Text style={styles.userGreeting}>Bem-vindo,</Text>
                    <Text style={styles.userName}>{userInfos?.Nome}</Text>
                </View>
                
                <TouchableOpacity 
                    onPress={() => setBuscaVisivel(!buscaVisivel)} 
                    style={styles.filterButton}
                >
                    <Icon 
                        name={buscaVisivel ? "times" : "filter"} 
                        size={20} 
                        color="#f0660a" 
                    />
                </TouchableOpacity>
            </Animated.View>

            {buscaVisivel && (
                <Animated.View style={[styles.buscaContainer, { opacity: fadeAnim }]}>
                    <View style={styles.buscaContent}>
                        <RadioGroup 
                            radioButtons={radioButtons} 
                            onPress={setSelectedId}
                            selectedId={selectedId}
                            layout="row"
                            containerStyle={styles.radioGroup}
                        />
                        
                        <View style={styles.searchBox}>
                            <Icon name="search" size={16} color="#f0660a" style={styles.searchIcon} />
                            <TextInput 
                                style={styles.input}
                                onChangeText={setBusca}
                                value={busca}
                                placeholder="O que você procura?"
                                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                                selectionColor="#f0660a"
                            />
                        </View>
                        
                        <TouchableOpacity 
                            onPress={BuscarComFiltro} 
                            style={styles.searchButton}
                        >
                            <Text style={styles.searchButtonText}>BUSCAR</Text>
                            <Icon name="arrow-right" size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
            
            <View style={styles.listContainer}>
                <FlatList 
                    data={produtos}
                    ListHeaderComponent={
                        <Text style={styles.sectionTitle}>PRODUTOS DISPONÍVEIS</Text>
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="box-open" size={40} color="#f0660a" />
                            <Text style={styles.emptyText}>Nenhum item encontrado</Text>
                            <Text style={styles.emptySubtext}>Tente ajustar seus filtros</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <ProdutoListagem 
                            item={item}
                            callback={(jsonItem) => adicionarItemBag(jsonItem)}
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            colors={["#f0660a", "#ff8c00"]}
                            refreshing={refreshing}
                            onRefresh={onRefresh} 
                            tintColor="#f0660a"
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            </View>

            <MostraBag />
        </Animated.View>
    );

};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#1a1a1a"
    },
    header: {
        width: '100%',
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#2a2a2a',
        borderBottomWidth: 1,
        borderBottomColor: '#f0660a',
        shadowColor: '#f0660a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
        zIndex: 10
    },
    menuButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(240, 102, 10, 0.1)'
    },
    userInfo: {
        flex: 1,
        marginLeft: 15
    },
    userGreeting: {
        color: '#aaa',
        fontSize: 12,
        fontFamily: 'Roboto-Light'
    },
    userName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Roboto-Medium',
        textTransform: 'capitalize'
    },
    filterButton: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(240, 102, 10, 0.1)'
    },
    buscaContainer: {
        backgroundColor: "#2a2a2a",
        padding: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#f0660a'
    },
    buscaContent: {
        width: '100%'
    },
    radioGroup: {
        justifyContent: 'space-between',
        marginBottom: 20
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 45,
        marginBottom: 15
    },
    searchIcon: {
        marginRight: 10
    },
    input: {
        flex: 1,
        color: "#fff",
        fontSize: 14,
        fontFamily: 'Roboto-Regular'
    },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0660a',
        borderRadius: 25,
        height: 45,
        paddingHorizontal: 20
    },
    searchButtonText: {
        color: "#fff",
        fontWeight: 'bold',
        marginRight: 10,
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        letterSpacing: 1
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: '#1a1a1a',
        
    },
    sectionTitle: {
        color: '#f0660a',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 15,
        fontFamily: 'Roboto-Bold',
        letterSpacing: 1
    },
    listContent: {
        paddingBottom: 100
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        opacity: 0.7
    },
    emptyText: {
        color: "#fff",
        fontSize: 16,
        marginTop: 15,
        fontFamily: 'Roboto-Medium'
    },
    emptySubtext: {
        color: "#aaa",
        fontSize: 14,
        marginTop: 5,
        fontFamily: 'Roboto-Light'
    }
});

export default Index;