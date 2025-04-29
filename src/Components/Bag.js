import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { SalvaOrcamentoServer } from '../Models/OrcamentosServer';
import MenuBag from './MenuBag';
import Botao from './Botao';
import ModalMsg from './ModalMsg';

const Bag = ({ itensBag, countItens, removerItem, user, limparBag, atualizarItem }) => {
    // Estados
    const height = useSharedValue(0);
    const [expanded, setExpanded] = useState(false);
    const [totalItens, setTotalItens] = useState(0);
    const [valorTotal, setValorTotal] = useState("0,00");
    const [temServico, setTemServico] = useState(false);
    const [menuVisivel, setMenuVisivel] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [itemEditando, setItemEditando] = useState(null);
    const [qtdEditando, setQtdEditando] = useState("");
    const [descontoEditando, setDescontoEditando] = useState("");

    const navigation = useNavigation();
    const alturaBag = Dimensions.get('window').height - 200;
    const larguraColuna = (Dimensions.get('window').width - 20) / 6;

    // Animação
    const animacao = useAnimatedStyle(() => ({
        height: height.value
    }));

    // Efeitos
    useEffect(() => calcularTotais(itensBag), [itensBag]);

    // Funções
    const toggleBag = () => {
        height.value = withTiming(expanded ? 0 : alturaBag, { duration: 300 });
        setExpanded(!expanded);
    };

    const calcularTotais = (itens) => {
        let total = 0;
        let qtd = 0;
        let servico = false;

        itens.forEach(item => {
            qtd += parseInt(item.qtd);
            total += item.valorTotal;
            if (item.tipo === "servico") servico = true;
        });

        setValorTotal(total.toFixed(2).replace('.', ','));
        setTotalItens(qtd);
        setTemServico(servico);
    };

    const abrirEdicao = (item) => {
        setItemEditando(item);
        setQtdEditando(item.qtd.toString());
        setDescontoEditando(item.desconto.toString());
    };

    const salvarEdicao = () => {
        const novaQtd = parseInt(qtdEditando) || 0;
        const novoDesconto = parseInt(descontoEditando) || 0;

        if (novaQtd <= 0) {
            setMensagem("Quantidade inválida!");
            setModalAberto(true);
            return;
        }

        const valorComDesconto = itemEditando.valorUnitario * (1 - (novoDesconto / 100));
        const novoTotal = valorComDesconto * novaQtd;

        atualizarItem({
            ...itemEditando,
            qtd: novaQtd,
            desconto: novoDesconto,
            valorTotal: novoTotal
        });

        setItemEditando(null);
    };

    const salvarOrcamento = () => {
        const orcamento = {
            userId: user.ID,
            tipoVenda: "local",
            user: user.Nome,
            produtos: itensBag
        };

        SalvaOrcamentoServer(orcamento).then((res) => {
            if (res.erro === false) {
                setMensagem("Orçamento salvo com sucesso");
                setModalAberto(true);
            }
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => abrirEdicao(item)}
        >
            <View style={[styles.coluna, { width: larguraColuna * 2 }]}>
                <Text style={styles.textoItem}>{item.produtoNome}</Text>
            </View>
            <View style={styles.coluna}>
                <Text style={styles.textoItem}>{item.valorUnitario.toFixed(2).replace('.', ',')}</Text>
            </View>
            <View style={styles.coluna}>
                <Text style={styles.textoItem}>{item.qtd}</Text>
            </View>
            <View style={styles.coluna}>
                <Text style={styles.textoItem}>{item.desconto}%</Text>
            </View>
            <View style={styles.coluna}>
                <Text style={styles.textoItem}>{item.valorTotal.toFixed(2).replace('.', ',')}</Text>
            </View>
            <TouchableOpacity
                style={styles.coluna}
                onPress={() => removerItem(item.produtoId)}
            >
                <Icon name="trash-alt" size={16} color="#ff3a30" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Cabeçalho */}
            <TouchableOpacity onPress={toggleBag} style={styles.botaoCabecalho}>
                <View style={styles.cabecalho}>
                    {expanded && (
                        <TouchableOpacity
                            style={styles.botaoMenu}
                            onPress={() => setMenuVisivel(!menuVisivel)}
                        >
                            <Icon name="bars" size={18} color="#fff" />
                        </TouchableOpacity>
                    )}

                    <Icon name="shopping-bag" size={18} color="#fff" />

                    <View style={styles.contador}>
                        <Text style={styles.textoContador}>{countItens}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Conteúdo */}
            <Animated.View style={[styles.conteudo, animacao]}>
                <MenuBag
                    visivel={menuVisivel}
                    callback={(acao) => {
                        if (acao === "limparBag") limparBag();
                        if (acao === "orcamento") salvarOrcamento();
                    }}
                />


                

                {/* Lista de itens */}
                <View style={styles.listaContainer}>
                    <View style={styles.cabecalhoLista}>
                        <Text style={styles.textoCabecalho}>Produto</Text>
                        <Text style={styles.textoCabecalho}>Valor</Text>
                        <Text style={styles.textoCabecalho}>Qtd</Text>
                        <Text style={styles.textoCabecalho}>Desc</Text>
                        <Text style={styles.textoCabecalho}>Total</Text>
                        <Text style={styles.textoCabecalho}>Ação</Text>
                    </View>
                    <View style={styles.listaWrapper}>
                        <FlatList
                            data={itensBag}
                            renderItem={renderItem}
                            keyExtractor={item => item.produtoId}
                            ListEmptyComponent={
                                <Text style={styles.listaVazia}>Nenhum item na sacola</Text>
                            }
                            contentContainerStyle={styles.listaContent}
                        />
                    </View>

                    {/* <FlatList
                        data={itensBag}
                        renderItem={renderItem}
                        keyExtractor={item => item.produtoId}
                        ListEmptyComponent={
                            <Text style={styles.listaVazia}>Nenhum item na sacola</Text>
                        }
                        style={{ maxHeight: alturaBag - 320 }}
                    /> */}

                    {/* Resumo */}
                    <View style={styles.resumo}>
                        <Text style={styles.textoResumo}>Total: R$ {valorTotal}</Text>
                        <Text style={styles.textoResumo}>Itens: {totalItens}</Text>
                    </View>

                    {/* Ações */}
                    <View style={styles.acoes}>
                        <View>
                            <Botao
                                label="Finalizar Venda"
                                color="#fff"
                                backgroundColor="#4CAF50"
                                callback={() => navigation.navigate('TelaPagamento', {
                                    valorTotal,
                                    user,
                                    itensBag
                                })}

                            />
                        </View>

                        {temServico && (
                            <View style={{ marginTop: 10 }}>
                                <Botao
                                    label="Ordem de Serviço"
                                    color="#fff"
                                    backgroundColor="#2196F3"
                                    callback={() => navigation.navigate('OrdemServico', {
                                        valorTotal,
                                        user,
                                        itensBag
                                    })}

                                />
                            </View>
                        )}
                    </View>
                </View>
            </Animated.View>

            {/* Modal de edição */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={!!itemEditando}
                onRequestClose={() => setItemEditando(null)}
            >
                <View style={styles.modalFundo}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalContainer}
                    >
                        <Text style={styles.modalTitulo}>Editar Item</Text>
                        <Text style={styles.modalProduto}>{itemEditando?.produtoNome}</Text>

                        <View style={styles.grupoInput}>
                            <Text style={styles.rotuloInput}>Quantidade:</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={qtdEditando}
                                onChangeText={setQtdEditando}
                            />
                        </View>

                        <View style={styles.grupoInput}>
                            <Text style={styles.rotuloInput}>Desconto (%):</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={descontoEditando}
                                onChangeText={setDescontoEditando}
                            />
                        </View>

                        <View style={styles.botoesModal}>
                            <Botao
                                label="Cancelar"
                                color="#fff"
                                backgroundColor="#f44336"
                                callback={() => setItemEditando(null)}

                            />

                            <Botao
                                label="Salvar"
                                color="#fff"
                                backgroundColor="#4CAF50"
                                callback={salvarEdicao}

                            />
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* Modal de mensagem */}
            {/* <ModalMsg
                modalAberto={modalAberto}
                msg={mensagem}
                fechaModal={() => {
                    setModalAberto(false);
                    if (mensagem.includes("sucesso")) {
                        setExpanded(false);
                        limparBag(true);
                    }
                }}
            /> */}
        </View>
    );
};

// Estilos
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    botaoCabecalho: {
        width: '100%',
    },
    cabecalho: {
        backgroundColor: "#4a4a4a",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: 20,
    },
    botaoMenu: {
        position: 'absolute',
        left: 15,
    },
    listaWrapper: {
        flex: 1,  // Isso permite que o FlatList cresça
        maxHeight: '60%',  // Ajuste conforme necessário
    },
    listaContent: {
        paddingBottom: 20,  // Espaço no final da lista
    },
    contador: {
        position: 'absolute',
        right: 15,
        backgroundColor: '#f0660a',
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoContador: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    conteudo: {
        width: '100%',
        backgroundColor: '#f8f8f8',
        overflow: 'hidden',
    },
    listaContainer: {
        flex: 1,
        padding: 15,
    },
    cabecalhoLista: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    textoCabecalho: {
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        flex: 1,
    },
    item: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    coluna: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    textoItem: {
        color: '#444',
        fontSize: 14,
    },
    listaVazia: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
    resumo: {
        marginTop: 10,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
    },
    textoResumo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 5,
    },
    acoes: {
        marginTop: 15,
        alignItems: 'center',
        flexDirection: "column"
    },
    botaoAcao: {
        marginBottom: 10,
    },
    modalFundo: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxWidth: 400,
    },
    modalTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        color: '#333',
    },
    modalProduto: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
        color: '#555',
    },
    grupoInput: {
        marginBottom: 15,
    },
    rotuloInput: {
        marginBottom: 5,
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
    },
    botoesModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    botaoModal: {
        width: '48%',
    },
});

export default Bag;