import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import Botao from '../Components/Botao';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

const DetalheVenda = ({ route, navigation }) => {
    const { venda } = route.params;

    // Formatação de valores
    const formatarValor = (valor) => {
        return `R$ ${valor.toFixed(2).replace('.', ',')}`;
    };

    // Formatação de data
    const formatarData = (data) => {
        return moment(data).format('DD/MM/YYYY HH:mm');
    };

    // Calcula o total por método de pagamento
    const getTotalPorMetodo = () => {
        return venda.pagamento.reduce((acc, metodo) => {
            acc[metodo.metodo] = (acc[metodo.metodo] || 0) + metodo.valor;
            return acc;
        }, {});
    };

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
                            <span>${formatarData(venda.data)}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Vendedor:</span>
                            <span>${venda.user}</span>
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
                            ${listagemProdutos(venda.produtos)}
                        </tbody>
                    </table>
                    
                    <div class="total-row">
                        TOTAL DA VENDA: R$ ${venda.valor.toFixed(2).replace(".", ",")}
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
                fileName: `G&M_Venda_${venda.vendaId}_${moment().format("DDMMYYYY_HHmm")}`,
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
            
        } catch (error) {
           console.log("errr", error)
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon name="arrow-left" size={20} color="#f0660a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>DETALHE DA VENDA</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Card Resumo */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.vendaId}>Venda #{venda.vendaId}</Text>
                        <View style={[
                            styles.statusBadge,
                            venda.status === 'finalizado' ? styles.statusSuccess : styles.statusCanceled
                        ]}>
                            <Text style={styles.statusText}>
                                {venda.status.toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="calendar-alt" size={14} color="#aaa" style={styles.icon} />
                        <Text style={styles.infoText}>
                            {formatarData(venda.data)}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="user-tie" size={14} color="#aaa" style={styles.icon} />
                        <Text style={styles.infoText}>
                            {venda.user}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="store" size={14} color="#aaa" style={styles.icon} />
                        <Text style={styles.infoText}>
                            {venda.tipoVenda === 'local' ? 'Venda Local' : 'Venda Online'}
                        </Text>
                    </View>
                </View>

                {/* Card Produtos */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>PRODUTOS</Text>
                    
                    {venda.produtos.map((produto, index) => (
                        <View key={index} style={styles.produtoItem}>
                            <View style={styles.produtoHeader}>
                                <Text style={styles.produtoNome}>{produto.produtoNome}</Text>
                                <Text style={styles.produtoValor}>
                                    {formatarValor(produto.valorTotal)}
                                </Text>
                            </View>
                            
                            <View style={styles.produtoDetails}>
                                <Text style={styles.detailText}>
                                    {produto.qtd} x {formatarValor(produto.valorUnitario)}
                                </Text>
                                {produto.desconto > 0 && (
                                    <Text style={styles.detailText}>
                                        Desconto: {produto.desconto}%
                                    </Text>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Card Pagamentos */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>PAGAMENTO</Text>
                    
                    {Object.entries(getTotalPorMetodo()).map(([metodo, valor], index) => (
                        <View key={index} style={styles.pagamentoItem}>
                            <View style={styles.pagamentoMethod}>
                                <Icon 
                                    name={
                                        metodo === 'pix' ? 'qrcode' : 
                                        metodo === 'dinheiro' ? 'money-bill-wave' : 
                                        metodo === 'cartão' ? 'credit-card' : 'money-check-alt'
                                    } 
                                    size={16} 
                                    color="#f0660a" 
                                />
                                <Text style={styles.pagamentoText}>
                                    {metodo.toUpperCase()}
                                </Text>
                            </View>
                            <Text style={styles.pagamentoValue}>
                                {formatarValor(valor)}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Card Total */}
                <View style={[styles.card, styles.totalCard]}>
                    <Text style={styles.totalLabel}>TOTAL DA VENDA</Text>
                    <Text style={styles.totalValue}>
                        {formatarValor(venda.valor)}
                    </Text>
                </View>
                <View style={{ marginBottom: 20, alignItems:'center' }}>
                    <Botao
                        label="Gerar Nota"
                        callback={() => {
                            
                            gerarNota(venda);
                        }}
                        backgroundColor="#f0660a"
                        color='#fff'
                        style={{ marginBottom: 10 }}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const windowWidth = Dimensions.get('window').width;

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
    backButton: {
        padding: 5
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    scrollContainer: {
        padding: 15,
        paddingBottom: 30
    },
    card: {
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        borderLeftWidth: 3,
        borderLeftColor: '#f0660a'
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#3a3a3a'
    },
    vendaId: {
        color: '#f0660a',
        fontSize: 18,
        fontWeight: 'bold'
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12
    },
    statusSuccess: {
        backgroundColor: 'rgba(46, 125, 50, 0.2)',
    },
    statusCanceled: {
        backgroundColor: 'rgba(198, 40, 40, 0.2)',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    statusSuccessText: {
        color: '#81c784'
    },
    statusCanceledText: {
        color: '#e57373'
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    icon: {
        width: 20,
        marginRight: 10
    },
    infoText: {
        color: '#fff',
        fontSize: 14
    },
    sectionTitle: {
        color: '#f0660a',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15
    },
    produtoItem: {
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#3a3a3a'
    },
    produtoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    produtoNome: {
        color: '#fff',
        fontWeight: 'bold',
        flex: 1
    },
    produtoValor: {
        color: '#fff',
        fontWeight: 'bold'
    },
    produtoDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    detailText: {
        color: '#aaa',
        fontSize: 12
    },
    pagamentoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    pagamentoMethod: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    pagamentoText: {
        color: '#fff',
        marginLeft: 10
    },
    pagamentoValue: {
        color: '#fff',
        fontWeight: 'bold'
    },
    totalCard: {
        backgroundColor: '#3a3a3a',
        borderLeftColor: '#4CAF50'
    },
    totalLabel: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 5
    },
    totalValue: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold'
    }
});

export default DetalheVenda;