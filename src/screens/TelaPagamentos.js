import React, { useState, useMemo, useEffect, useRef } from 'react';

import {
    Text,
    View,
    TextInput,
    Dimensions,
    StyleSheet,
    Keyboard,
    Modal,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView
} from "react-native"
import Icon from 'react-native-vector-icons/dist/FontAwesome5';

import { SalvaVendaServer } from "../Models/ProdutosServerModel"
import RadioGroup from 'react-native-radio-buttons-group';
import TabelaPagamentos from '../Components/TabelaPagamentos';
import Botao from '../Components/Botao';
import ModalMsg from '../Components/ModalMsg';
import { formatMoney } from '../Controller/Funcoes/Geral';
import { buscaVendedores } from '../Models/UserServerModel';
import moment from 'moment';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import api from '../Api/api';


const TelaPagamentos = ({ route, navigation }) => {

    const [pagamento, setPagamento] = useState([])
    const [selectedId, setSelectedId] = useState();
    const [valor, setvalor] = useState(route.params.valorTotal)
    const [valorTotalPago, setvalorTotalPago] = useState(0.0)
    const [msg, setMsg] = useState("")
    const [modalMsgAberto, setModalMsgAberto] = useState(false)
    const [valorValtante, setValorValtante] = useState(route.params.valorTotal)
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [modalVendedore, setModalVendedore] = useState(false);
    const [vendedores, setVendedores] = useState([])
    const [modalSalvoSucesso, setModalSalvoSucesso] = useState(false)
    const [venda, setVenda] = useState(undefined)
    const [cliente, setCliente] = useState({})
    const [existeFaturado, setExisteFaturado] = useState(false)
    const [modalCliente, setModalCliente] = useState(false)
    const [varBuscaClientes, setVarBuscaCliente] = useState("")
    const [clientesListagem, setClientesListagem] = useState([])
    const [carregando, setCarregando] = useState(false);


    const controllerBuscaCliente = useRef < AbortController | null > (null);
    const user = route.params.user
    const valorCobrar = route.params.valorTotal
    const itensBag = route.params.itensBag

    const [vendedor, setVendedor] = useState({
        _id: user.id,
        nome: user.nome
    })

    const handleKeyboardDidShow = (event) => {

        setKeyboardHeight(-160);
    };

    const handleKeyboardDidHide = () => {

        setKeyboardHeight(0);
    };

    const buscarClientes = () => {

        if (controllerBuscaCliente.current) {

            controllerBuscaCliente.current.abort();

        }

        const controller = new AbortController();
        controllerBuscaCliente.current = controller;

        setCarregando(true);

        api.get(`/user-buscar?search=${varBuscaClientes}&userid=${user.ID}`, {
            signal: controller.signal
        }).then((res) => {

            setClientesListagem(res.data.valor)

        }).finally(() => {

            setCarregando(false);

        })
    }

    const listagemProdutos = (orcamento) => {
        return orcamento.map((item) => `
            <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 12px 8px; vertical-align: middle;">${item.produtoNome}</td>
                <td style="text-align: center; padding: 12px 8px; vertical-align: middle;">${item.qtd}</td>
                <td style="text-align: right; padding: 12px 8px; vertical-align: middle;">R$ ${item.valorUnitario.toFixed(2).replace(".", ",")}</td>
                <td style="text-align: center; padding: 12px 8px; vertical-align: middle;">${item.desconto}%</td>
                <td style="text-align: right; padding: 12px 8px; vertical-align: middle; font-weight: bold;">R$ ${item.valorTotal.toFixed(2).replace(".", ",")}</td>
            </tr>
        `).join('');
    };

    const criaHTMLPdf = async (itens) => {
        const totalVenda = itens.reduce((total, item) => total + item.valorTotal, 0);

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Venda ${venda.vendaId} - G&M Moto Peças</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                    line-height: 1.6;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #f0660a;
                    padding-bottom: 20px;
                }
                .logo {
                    width: 150px;
                    height: auto;
                }
                .empresa-info {
                    text-align: right;
                }
                .empresa-nome {
                    font-size: 22px;
                    font-weight: bold;
                    color: #2a2a2a;
                    margin-bottom: 5px;
                }
                .empresa-detalhes {
                    font-size: 12px;
                    color: #666;
                }
                .titulo-venda {
                    background-color: #f0660a;
                    color: white;
                    text-align: center;
                    padding: 15px;
                    font-size: 24px;
                    font-weight: bold;
                    border-radius: 5px;
                    margin-bottom: 20px;
                }
                .info-venda {
                    margin-bottom: 25px;
                }
                .info-row {
                    display: flex;
                    margin-bottom: 8px;
                }
                .info-label {
                    font-weight: bold;
                    min-width: 120px;
                    color: #555;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 25px;
                }
                th {
                    background-color: #2a2a2a;
                    color: white;
                    padding: 12px 8px;
                    text-align: left;
                }
                td {
                    padding: 12px 8px;
                }
                .total-row {
                    font-weight: bold;
                    font-size: 18px;
                    text-align: right;
                    margin-top: 20px;
                    padding-top: 10px;
                    border-top: 2px solid #2a2a2a;
                }
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    font-size: 12px;
                    color: #777;
                    border-top: 1px solid #eee;
                    padding-top: 15px;
                }
                .text-center {
                    text-align: center;
                }
                .text-right {
                    text-align: right;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img class="logo" src="https://i.imgur.com/9Hv8LYj.png" alt="G&M Moto Peças">
                    <div class="empresa-info">
                        <div class="empresa-nome">G & M Moto Peças</div>
                        <div class="empresa-detalhes">CNPJ: 55.744.795/0001-34</div>
                        <div class="empresa-detalhes">Contato: (11) 9 6564-0477</div>
                    </div>
                </div>
                
                <div class="titulo-venda">VENDA Nº ${venda.vendaId}</div>
                
                <div class="info-venda">
                    <div class="info-row">
                        <span class="info-label">Data da venda:</span>
                        <span>${moment().format("DD/MM/YYYY")}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Vendedor:</span>
                        <span>${vendedor.nome}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Cliente:</span>
                        <span>${venda.cliente || 'Não informado'}</span>
                    </div>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th class="text-center">Qtd</th>
                            <th class="text-right">Val. Unit.</th>
                            <th class="text-center">Desc.</th>
                            <th class="text-right">Val. Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${listagemProdutos(itens)}
                    </tbody>
                </table>
                
                <div class="total-row">
                    TOTAL DA VENDA: R$ ${totalVenda.toFixed(2).replace(".", ",")}
                </div>
                
                <div class="footer">
                    <p>Obrigado por escolher G&M Moto Peças!</p>
                    <p>Para dúvidas ou informações, entre em contato: (11) 9 6564-0477</p>
                </div>
            </div>
        </body>
        </html>
        `;

        return html;
    };

    const gerarNota = async (itensBag) => {
        try {
            const options = {
                html: await criaHTMLPdf(itensBag),
                fileName: `G&M Venda Nº ${venda.vendaId}_${moment().format("DDMMYYYY_HHmm")}`,
                directory: 'Documents',
            };

            const file = await RNHTMLtoPDF.convert(options);

            const shareOptions = {
                title: `Venda ${venda.vendaId} - G&M Moto Peças`,
                message: `Comprovante de venda Nº ${venda.vendaId}`,
                url: `file://${file.filePath}`,
                type: 'application/pdf',
                subject: `Venda ${venda.vendaId}`,
            };

            await Share.open(shareOptions);
            voltarLimparBag();
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            voltarLimparBag();
        }
    };


    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
        Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);
        if (user.Nome == "Vinicius Kiritschenco Costa") {
            buscaVendedores().then((res) => {
                if (res.erro == false) {
                    setVendedores(res.valor)
                }
            })
        }


    }, []);



    const radioButtons = useMemo(() => ([
        {
            id: '1',
            label: 'Pix',
            value: 'pix',
            color: "#f0660a",
            labelStyle: { color: "#fff", fontWeight: "bold" }
        },
        {
            id: '2',
            label: 'Dinheiro',
            value: 'dinheiro',
            color: "#f0660a",
            labelStyle: { color: "#fff", fontWeight: "bold" }
        },
        {
            id: '3',
            label: 'Débito',
            value: 'debito',
            color: "#f0660a",
            labelStyle: { color: "#fff", fontWeight: "bold" }
        },
        {
            id: '4',
            label: 'Crédito',
            value: 'credito',
            color: "#f0660a",
            labelStyle: { color: "#fff", fontWeight: "bold" }
        }
    ]), []);
    const radioButtons1 = useMemo(() => ([

        {
            id: '5',
            label: 'Faturado',
            value: 'faturado',
            color: "#f0660a",
            labelStyle: { color: "#fff", fontWeight: "bold" }
        }
    ]), []);

    const selecionaCliente = (cliente) => {
        setCliente(cliente)
        setModalCliente(false)
    }



    const finalizar = (pagamento) => {

        if (existeFaturado && typeof cliente._id == "undefined") {

            setMsg("O Cliente é obrigatorio para faturar.")
            setModalMsgAberto(true)
            return

        }

        const jsonFinalizar = {
            vendedorId: vendedor._id,
            tipoVenda: "local",
            vendedorNome: vendedor.nome,
            status: "finalizado",
            pagamento: pagamento,
            produtos: itensBag,
            valor: parseFloat(valorCobrar.replace(",", ".")).toFixed(2),
            clienteId: cliente._id
        }
       
        SalvaVendaServer(jsonFinalizar).then((re) => {

            if (re.erro == false) {


                setVenda(re.valor)
                setMsg("Venda finalizada com sucesso")
                setModalSalvoSucesso(true)


            } else {

                setMsg(re.valor)
                setModalMsgAberto(true)

            }

        }).catch((e) => {
            console.log(e)
            setMsg("Erro ao finalizar venda")
            setModalMsgAberto(true)

        })


    }

    const voltar = () => {
        navigation.goBack()
    }

    const voltarLimparBag = () => {
        return navigation.navigate('Index', { limparBag: true })
    }

    const limpaVar = () => {

        setPagamento([])
        setSelectedId();
        setvalor(valorCobrar)
        setvalorTotalPago(0.0)
        setValorValtante(valorCobrar)

    }

    const adicionarPagamento = () => {

        let formasPagamentos = [...radioButtons, ...radioButtons1]

        let p = pagamento
        const metodo = formasPagamentos.find(el => el.id == selectedId)

        if (metodo.value == "faturado") {
            setExisteFaturado(true)
        }

        p.push({
            metodo: metodo.value,
            valor: parseFloat(valor.replace(",", "."))
        })

        setvalorTotalPago(valorTotalPago + parseFloat(valor.replace(",", ".")))
        let calculo = parseFloat(valorCobrar.replace(",", ".")) - (parseFloat(valor.replace(",", ".")) + valorTotalPago)

        setPagamento(p)
        setSelectedId()
        setvalor(`${calculo.toFixed(2)}`.replace(".", ","))
        setValorValtante(`${calculo.toFixed(2)}`.replace(".", ","))
    }

    const finaliza = () => {

        let formasPagamentos = [...radioButtons, ...radioButtons1]

        let p = pagamento

        const metodo = formasPagamentos.find(el => el.id == selectedId)

        p.push({
            metodo: metodo.value,
            valor: parseFloat(valor.replace(",", "."))
        })

        limpaVar()



        finalizar(p)

    }

    const msgValor = () => {
        if (parseFloat(valor.replace(",", ".")) > parseFloat(valorCobrar.replace(",", "."))) {

            return (
                <Text style={{ color: "red" }}>O valor cobrado é maior que o valor da compra</Text>
            )
        }
    }

    const Botoes = () => {

        if (selectedId == undefined && valorTotalPago != parseFloat(valorCobrar.replace(",", "."))) {
            return
        }

        if (parseFloat(valor.replace(",", ".")) > parseFloat(valorCobrar.replace(",", "."))) {

            return
        }



        if (parseFloat(valor.replace(",", ".")) < parseFloat(valorCobrar.replace(",", ".")) && valorTotalPago + parseFloat(valor.replace(",", ".")) == parseFloat(valorCobrar.replace(",", "."))) {
            return (
                <View style={{ marginTop: 5, marginBottom: 5 }}>
                    <Botao
                        label="Finalizar"
                        callback={() => {
                            finaliza()
                        }}
                        backgroundColor="#13a303"
                        color='#fff'

                    />

                </View>
            )
        }



        if (parseFloat(valor.replace(",", ".")) == parseFloat(valorCobrar.replace(",", "."))) {
            return (
                <View style={{ marginTop: 5, marginBottom: 5 }}>
                    <Botao
                        label="Finalizar"
                        callback={() => {
                            finaliza()
                        }}
                        backgroundColor="#28a745"
                        color='#fff'

                    />

                </View>
            )
        }


        if (parseFloat(valor.replace(",", ".")) < parseFloat(valorCobrar.replace(",", "."))) {
            return (
                <View style={{ marginTop: 5, marginBottom: 5 }}>
                    <Botao
                        label="Adicionar pagamento"
                        callback={() => {
                            adicionarPagamento()
                        }}
                        backgroundColor="#d39e00"
                        color='#fff'

                    />

                </View>
            )
        }


    }

    const adicionarCliente = () => {
        setModalCliente(true)

    }

    const abrirModalVendedores = () => {
        setModalVendedore(true)
    }
    const removerCliente = () => {
        setCliente({})
    }
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>FINALIZAR PAGAMENTO</Text>
            </View>

            {/* Valores */}
            <View style={styles.valueCards}>
                <View style={styles.valueCard}>
                    <Text style={styles.valueLabel}>TOTAL A PAGAR</Text>
                    <Text style={styles.valueText}>R$ {valorCobrar}</Text>
                </View>
                <View style={styles.valueCard}>
                    <Text style={styles.valueLabel}>RESTANTE</Text>
                    <Text style={[styles.valueText,
                    { color: parseFloat(valorValtante.replace(",", ".")) > 0 ? '#ff6b6b' : '#4CAF50' }]}>
                        R$ {valorValtante}
                    </Text>
                </View>
            </View>
            <ScrollView>

                <View style={styles.paymentMethods}>
                    <RadioGroup
                        containerStyle={{ alignItems: 'flex-start' }}
                        radioButtons={radioButtons}
                        onPress={setSelectedId}
                        selectedId={selectedId}
                        layout="row"
                    />
                    <RadioGroup
                        containerStyle={{ marginTop: 10 }}
                        radioButtons={radioButtons1}
                        onPress={setSelectedId}
                        selectedId={selectedId}
                        layout="row"
                    />
                </View>

                {/* Input Valor */}
                <View style={styles.paymentInputContainer}>
                    <Text style={styles.inputLabel}>VALOR DO PAGAMENTO</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 18, marginRight: 10 }}>R$</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(t) => setvalor(formatMoney(t))}
                            value={valor}
                            keyboardType='numeric'
                            placeholder="0,00"
                            placeholderTextColor="#666"
                        />
                    </View>
                    {msgValor()}
                </View>

                {/* Tabela de Pagamentos */}
                <TabelaPagamentos pagamentos={pagamento} />

            </ScrollView>

            {/* Métodos de Pagamento */}


            {/* Informações Vendedor/Cliente */}
            <View style={styles.userInfoContainer}>
                <Text style={{ color: '#fff' }}>Vendedor: {vendedor.nome}</Text>

                {typeof cliente._id != "undefined" && (
                    <View style={styles.clientTag}>
                        <Text style={styles.clientText}>Cliente: {cliente.nome}</Text>
                        <TouchableOpacity onPress={removerCliente}>
                            <Icon name="times" size={16} color="#ff6b6b" />
                        </TouchableOpacity>
                    </View>
                )}

                {user.Nome == "Vinicius Kiritschenco Costa" && (
                    <View style={{ marginTop: 10, marginBottom: 5 }}>
                        <Botao
                            label="Trocar Vendedor"
                            callback={abrirModalVendedores}
                            backgroundColor="#333"
                            color='#f0660a'
                            style={{ marginTop: 10 }}
                        />
                    </View>
                )}

                {typeof cliente._id == "undefined" && (
                    <View style={{ marginTop: 10, marginBottom: 5 }}>
                        <Botao
                            label="Adicionar Cliente"
                            callback={adicionarCliente}
                            backgroundColor="#333"
                            color='#007bff'
                            style={{ marginTop: 10 }}
                        />
                    </View>

                )}
            </View>

            {/* Botões de Ação */}
            <View style={styles.buttonsContainer}>
                {Botoes()}
                <View style={{ marginTop: 5, marginBottom: 5 }}>
                    <Botao
                        label="Cancelar"
                        callback={() => {
                            limpaVar()
                            voltar()
                        }}
                        backgroundColor="#dc3545"
                        color='#fff'
                        style={{ marginTop: 10 }}
                    />
                </View>

            </View>

            {/* Modais (atualizados) */}
            <ModalMsg modalAberto={modalMsgAberto} msg={msg} fechaModal={() => setModalMsgAberto(false)} />

            <Modal animationType="fade" transparent={true} visible={modalSalvoSucesso}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{msg}</Text>
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Botao
                                label="Gerar Nota"
                                callback={() => {
                                    setModalSalvoSucesso(false);
                                    gerarNota(itensBag);
                                }}
                                backgroundColor="#f0660a"
                                color='#fff'
                                style={{ marginBottom: 10 }}
                            />
                        </View>
                        <View>
                            <Botao
                                label="Finalizar"
                                callback={() => {
                                    setModalSalvoSucesso(false);
                                    voltarLimparBag();
                                }}
                                backgroundColor="#28a745"
                                color='#fff'
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVendedore}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Selecionar vendedor</Text>
                        </View>

                        <FlatList
                            data={vendedores}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setVendedor(item);
                                        setModalVendedore(false);
                                    }}
                                    style={styles.modalItem}
                                >
                                    <Text style={styles.modalItemText}>{item.nome}</Text>
                                    <Icon name="user" size={16} color="#f0660a" />
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            style={{ maxHeight: windowHeight * 0.6 }}
                        />

                        <View style={{ marginTop: 15 }}>
                            <Botao
                                label="Cancelar"
                                callback={() => setModalVendedore(false)}
                                backgroundColor="#333"
                                color='#fff'
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalCliente}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>SELECIONAR CLIENTE</Text>
                        </View>

                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.searchInput}
                                onChangeText={setVarBuscaCliente}
                                value={varBuscaClientes}
                                placeholder="Buscar cliente..."
                                placeholderTextColor="#666"
                            />
                            <TouchableOpacity
                                onPress={buscarClientes}
                                disabled={carregando}
                                style={styles.searchButton}
                            >
                                {carregando ? (
                                    <ActivityIndicator color="#f0660a" />
                                ) : (
                                    <Icon name="search" size={20} color="#f0660a" />
                                )}
                            </TouchableOpacity>
                        </View>

                        {clientesListagem.length > 0 ? (
                            <FlatList
                                data={clientesListagem}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.clientItem}
                                        onPress={() => selecionaCliente(item)}
                                    >
                                        <View style={styles.clientInfo}>
                                            <Text style={styles.clientName}>{item.nome}</Text>
                                            <Text style={styles.clientDoc}>{item.cpfCnpj}</Text>
                                        </View>
                                        <Icon name="chevron-right" size={16} color="#666" />
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                style={{ maxHeight: windowHeight * 0.5 }}
                            />
                        ) : (
                            <View style={styles.emptyState}>
                                <Icon name="users" size={40} color="#666" />
                                <Text style={styles.emptyText}>Nenhum cliente encontrado</Text>
                            </View>
                        )}

                        <View style={{ marginTop: 15 }}>
                            <Botao
                                label="Cancelar"
                                callback={() => setModalCliente(false)}
                                backgroundColor="#333"
                                color='#fff'
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        paddingTop: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        height: 50,
        borderWidth: 1,
        borderColor: '#333',
        width: "80%"
    },
    header: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0660a',
        marginBottom: 10,
    },
    headerText: {
        color: '#f0660a',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    valueCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    emptyText: {
        color: '#666',
        marginTop: 10,
        fontSize: 14,
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#333',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        height: 45,
    },
    searchButton: {
        padding: 10,
    },
    clientItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    clientInfo: {
        flex: 1,
    },
    clientName: {
        color: '#fff',
        fontSize: 15,
        marginBottom: 3,
    },
    clientDoc: {
        color: '#aaa',
        fontSize: 12,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
    },
    valueCard: {
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 15,
        width: '48%',
        borderWidth: 1,
        borderColor: '#333',
    },
    valueLabel: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 5,
    },
    valueText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    paymentMethods: {
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    paymentInputContainer: {
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    inputLabel: {
        color: '#f0660a',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    userInfoContainer: {
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    clientTag: {
        backgroundColor: '#333',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    clientText: {
        color: '#fff',
    },
    buttonsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        alignItems: "center"
    },
    // Atualize os modais para ficarem mais premium
    modalContainer: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#2a2a2a',
        width: '90%',
        borderRadius: 15,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f0660a',
    },
    modalHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#f0660a',
        paddingBottom: 10,
        marginBottom: 15,
    },
    modalTitle: {
        color: '#f0660a',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    infosVendedor: {
        width: windowWidth - 20,
        marginTop: 10,
    },
    infosCliente: {
        width: windowWidth - 20,
        flexDirection: "row",
        marginTop: "10px"
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    modalItemText: {
        color: '#fff',
        fontSize: 15,
    },
    subContainer: {
        height: (windowHeight / 12) * 2,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        marginTop: 20,
    },
    subContainerMedio: {
        height: (windowHeight / 10) * 4,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10

    },
    botoes: {
        height: (windowHeight / 10) * 2,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
    },
    subContainerMenor: {
        height: windowHeight / 15,
        alignItems: "center",
        justifyContent: "center",

    },
    titulo: {
        color: "#f0660a",
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    input2: {
        backgroundColor: "#fff",
        width: windowWidth - 90,
        borderRadius: 5,
        paddingLeft: 45,
        height: 45,
        color: "rgba(0, 0, 0, 0.6)"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(50,50,50,0.8)"
        // marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: windowHeight - 50
    },
    modalViewNota: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: 300
    },
})
export default TelaPagamentos