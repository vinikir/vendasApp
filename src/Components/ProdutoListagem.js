import React, { useState } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Dimensions,
    Image,
    Text,
    Animated,
    TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import ModalConfirmarAdicionarProduto from './ModaConfirmarAdicionarProduto';

const ProdutoListagem = React.memo(({ item, callback }) => {
    const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);
    const [scaleAnim] = useState(new Animated.Value(1));
    const navigation = useNavigation();

    if (typeof item.valorVenda == "undefined") {
        return null;
    }

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

    let img = item.img && item.img != null ?
        { uri: item.img } :
        require("../../assets/noimage.png");

    let preco = `${item.valorVenda.toFixed(2)}`.replace('.', ',');

    const abrirDetalhes = () => {
        navigation.navigate("InformativoProduto", { item: item });
    };

    const adicionarItemBag = (jsonItem) => {
        callback(jsonItem);
        setModalConfirmacaoAberto(false);
    };

    // Cores baseadas no tipo de produto
    const backgroundColor = item.tipo === "servico" ? "#3a3a3a" : "#4a4a4a";
    const accentColor = item.tipo === "servico" ? "#f0660a" : "#4CAF50";

    const getLocationIcon = (tipo) => {
        const icons = {
            'corredor': 'road',
            'prateleira': 'layer-group',
            'coluna': 'cube',
            'caixa': 'box-open'
        };
        return icons[tipo.toLowerCase()] || 'map-marker-alt';
    };

    const formatarLocalizacao = () => {
        if (!item.localizacao || item.localizacao.length === 0 || item.tipo === "servico") return null;

        return (
            <View style={styles.locationContainer}>
                <View style={styles.locationLabelContainer}>
                    <Icon name="map-pin" size={10} color="#aaa" solid />
                    <Text style={styles.locationLabel}>Localização</Text>
                </View>
                <View style={styles.locationPath}>
                    {item.localizacao.map((loc, index) => (
                        <React.Fragment key={index}>
                            <View style={styles.locationStep}>
                                <View style={[styles.locationIcon,
                                { backgroundColor: index === item.localizacao.length - 1 ? accentColor : '#666' }]}>
                                    <Icon name={getLocationIcon(loc.tipo)} size={10} color="#fff" />
                                </View>
                                <Text style={styles.locationText}>
                                    {loc.tipo}: {loc.valor}
                                </Text>
                            </View>
                            {index < item.localizacao.length - 1 && (
                                <View style={styles.locationArrow}>
                                    <Icon name="chevron-right" size={10} color="#aaa" />
                                </View>
                            )}
                        </React.Fragment>
                    ))}
                </View>
            </View>
        );
    };


    return (
        <View style={styles.container}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                {/* Card principal */}
                <TouchableWithoutFeedback
                    onPress={abrirDetalhes}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <View style={[styles.card, { backgroundColor }]}>
                        {/* Imagem do produto */}
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} source={img} />
                            {item.tipo === "servico" && (
                                <View style={[styles.serviceBadge, { backgroundColor: accentColor }]}>
                                    <Text style={styles.badgeText}>SERVIÇO</Text>
                                </View>
                            )}
                        </View>

                        {/* Informações do produto */}
                        <View style={styles.infoContainer}>
                            <Text style={styles.productName} numberOfLines={2}>{item.nome}</Text>

                            {item.tipo !== "servico" && (
                                <>
                                    <View style={styles.detailRow}>
                                        <Icon name="tag" size={12} color="#aaa" />
                                        <Text style={styles.detailText}> {item.marca || 'Sem marca'}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Icon name="box-open" size={12} color="#aaa" />
                                        <Text style={styles.detailText}> Estoque: {item.estoque}</Text>
                                    </View>
                                    {formatarLocalizacao()}
                                </>
                            )}
                        </View>

                        {/* Preço */}
                        <View style={styles.priceContainer}>
                            <Text style={styles.priceText}>R$ {preco}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>

                {/* Botão de ação */}
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: accentColor }]}
                    onPress={() => setModalConfirmacaoAberto(true)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.actionButtonText}>ADICIONAR</Text>
                    <Icon name="plus" size={14} color="#fff" />
                </TouchableOpacity>
            </Animated.View>

            {/* Modal de confirmação */}
            <ModalConfirmarAdicionarProduto
                item={item}
                modalAberto={modalConfirmacaoAberto}
                fechaModal={() => setModalConfirmacaoAberto(false)}
                callbackAdicionar={adicionarItemBag}
            />
        </View>
    );
});

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        width: windowWidth - 30,
        marginBottom: 15,
        marginHorizontal: 0,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        backgroundColor: '#2a2a2a',
        overflow: 'hidden',

    },
    card: {
        flexDirection: 'row',
        padding: 12,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        alignItems: 'center'
    },
    imageContainer: {
        position: 'relative',
        width: 80,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#3a3a3a'
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    serviceBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold'
    },
    infoContainer: {
        flex: 1,
        marginHorizontal: 12,
        justifyContent: 'center'
    },
    productName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
    detailText: {
        color: '#ccc',
        fontSize: 12
    },
    priceContainer: {
        width: 70,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    priceText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginRight: 8
    },
    locationContainer: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#333'
    },
    locationPath: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    locationStep: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3a3a3a',
        borderRadius: 12,
        paddingVertical: 3,
        paddingHorizontal: 8,
        marginRight: 4
    },
    locationIcon: {
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 4
    },
    locationText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '500'
    },
    locationArrow: {
        marginHorizontal: 2
    },
    locationLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
    locationLabel: {
        color: '#aaa',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginLeft: 4
    },
});

export default ProdutoListagem;