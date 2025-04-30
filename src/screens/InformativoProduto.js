import { 
    View,
    StyleSheet,
    Dimensions,
    StatusBar,
    Image,
    TouchableOpacity,
    Text,
    ScrollView,
    SafeAreaView
} from "react-native"
import RenderHtml from 'react-native-render-html';
import CarrocelImagens from "../Components/CarrocelImagens";
import { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';

const InformativoProduto = ({route, navigation}) => {
    const item = route.params.item;
    const [mostrarImagem, setMostraImagem] = useState(null);

    useEffect(() => {
        const img = item.img ? { uri: item.img } : require("../../assets/noimage.png");
        setMostraImagem(img);
        
        if(item.imgAdicional?.length > 0 && typeof img !== "number" && item.imgAdicional[0] !== item.img){
            item.imgAdicional.unshift(item.img);
        }
    }, []);

    const precoFormatado = item.valorVenda.toFixed(2).replace('.', ',');
    const aplicacaoHtml = {
        html: `<div style="color:#FFF; font-size:14px;">${item.aplicacao || ''}</div>`
    };

    // Componente de campo de informação
    const CampoInfo = ({ label, value, halfWidth = false }) => (
        <View style={[styles.campoContainer, halfWidth && { width: '48%' }]}>
            <Text style={styles.campoLabel}>{label}</Text>
            <Text style={styles.campoValue}>{value || '-'}</Text>
        </View>
    );

    // Tela para produtos físicos
    if(item.tipo !== "servico") {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar backgroundColor="#4a4a4a" barStyle="light-content" />
                
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Icon name="arrow-back" size={24} color="#f0660a" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>INFORMAÇÕES DO PRODUTO</Text>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        {/* Imagem principal */}
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.mainImage}
                                source={mostrarImagem}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Carrossel (se tiver imagens adicionais) */}
                        {item.imgAdicional?.length > 0 && (
                            <CarrocelImagens 
                                item={item}  
                                atualziarImagem={(imgval) => setMostraImagem({uri: imgval})}
                            />
                        )}

                        {/* Nome e Preço */}
                        <View style={styles.card}>
                            <Text style={styles.productName}>{item.nome}</Text>
                            <View style={styles.divider} />
                            
                            <View style={styles.row}>
                                <CampoInfo 
                                    label="PREÇO" 
                                    value={`R$ ${precoFormatado}`} 
                                    halfWidth 
                                />
                                <CampoInfo 
                                    label="DESCONTO MÁX" 
                                    value={`${item.descontoMaximo}%`} 
                                    halfWidth 
                                />
                            </View>
                        </View>

                        {/* Informações básicas */}
                        <View style={styles.card}>
                            <View style={styles.row}>
                                <CampoInfo 
                                    label="MARCA" 
                                    value={item.marca} 
                                    halfWidth 
                                />
                                <CampoInfo 
                                    label="ESTOQUE" 
                                    value={item.estoque} 
                                    halfWidth 
                                />
                            </View>
                            
                            <View style={styles.row}>
                                <CampoInfo 
                                    label="SKU" 
                                    value={item.sku} 
                                    halfWidth 
                                />
                                <CampoInfo 
                                    label="CÓD. BARRAS" 
                                    value={item.codigoBarra} 
                                    halfWidth 
                                />
                            </View>
                        </View>

                        {/* Descrição */}
                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>DESCRIÇÃO</Text>
                            <View style={styles.divider} />
                            <Text style={styles.descriptionText}>{item.descricao}</Text>
                        </View>

                        {/* Aplicação */}
                        {item.aplicacao && (
                            <View style={styles.card}>
                                <Text style={styles.sectionTitle}>APLICAÇÃO</Text>
                                <View style={styles.divider} />
                                <RenderHtml
                                    contentWidth={Dimensions.get('window').width - 80}
                                    source={aplicacaoHtml}
                                />
                            </View>
                        )}
                    </ScrollView>

                    {/* Botão Voltar */}
                    <TouchableOpacity 
                        style={styles.backButtonBottom}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>VOLTAR</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // Tela para serviços (mantendo seu padrão)
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#4a4a4a" barStyle="light-content" />
            
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={24} color="#f0660a" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>INFORMAÇÕES DO SERVIÇO</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Imagem do serviço */}
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.serviceImage}
                            source={mostrarImagem}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Nome e Preço */}
                    <View style={styles.card}>
                        <Text style={styles.productName}>{item.nome}</Text>
                        <View style={styles.divider} />
                        
                        <CampoInfo 
                            label="VALOR" 
                            value={`R$ ${precoFormatado}`} 
                        />
                        <CampoInfo 
                            label="DESCONTO MÁXIMO" 
                            value={`${item.descontoMaximo}%`} 
                        />
                    </View>

                    {/* Descrição */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>DESCRIÇÃO</Text>
                        <View style={styles.divider} />
                        <Text style={styles.descriptionText}>{item.descricao}</Text>
                    </View>

                    {/* Aplicação */}
                    {item.aplicacao && (
                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>APLICAÇÃO</Text>
                            <View style={styles.divider} />
                            <RenderHtml
                                contentWidth={Dimensions.get('window').width - 80}
                                source={aplicacaoHtml}
                            />
                        </View>
                    )}
                </ScrollView>

                {/* Botão Voltar */}
                <TouchableOpacity 
                    style={styles.backButtonBottom}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>VOLTAR</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#4a4a4a'
    },
    container: {
        flex: 1,
        backgroundColor: '#4a4a4a'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#2a2a2a',
        borderBottomWidth: 1,
        borderBottomColor: '#333'
    },
    backButton: {
        marginRight: 16
    },
    headerTitle: {
        color: '#f0660a',
        fontSize: 16,
        fontWeight: '700',
        textTransform: 'uppercase'
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 80
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        padding: 8
    },
    mainImage: {
        width: '100%',
        height: 250,
        borderRadius: 4
    },
    serviceImage: {
        width: '100%',
        height: 180,
        borderRadius: 4
    },
    card: {
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#333'
    },
    productName: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 12
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    campoContainer: {
        marginBottom: 12
    },
    campoLabel: {
        color: '#f0660a',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase'
    },
    campoValue: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '500'
    },
    sectionTitle: {
        color: '#f0660a',
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 4
    },
    descriptionText: {
        color: '#FFF',
        fontSize: 14,
        lineHeight: 20
    },
    backButtonBottom: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#f0660a',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5
    },
    backButtonText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16,
        textTransform: 'uppercase'
    }
});

export default InformativoProduto;