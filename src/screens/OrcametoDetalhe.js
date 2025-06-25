import React, { useEffect, useState } from "react";
import moment from "moment";
import { 
    FlatList, 
    View, 
    Text, 
    StyleSheet, 
    Dimensions, 
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from "react-native";
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import Share from 'react-native-share';
import { WebView } from 'react-native-webview';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const OrcamentoDetalhe = ({route, navigation}) => {
    const [html, setHtml] = useState('');
    const [loading, setLoading] = useState(false);
    const orcamento = route.params.orcamento;
    const imgLogo = require("../../assets/logoGem_.png");
    
    const valorTotal = orcamento.produtos.reduce((total, produto) => total + produto.valorTotal, 0);

    useEffect(() => {
        criaHTMLPdf();
    }, []);

    const listagemProdutos = () => {
        return orcamento.produtos.map((item) => `
            <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 10px;">${item.produtoNome}</td>
                <td style="text-align: center; padding: 10px;">${item.qtd}</td>
                <td style="text-align: right; padding: 10px;">R$ ${item.valorUnitario.toFixed(2).replace(".",",")}</td>
                <td style="text-align: center; padding: 10px;">${item.desconto}%</td>
                <td style="text-align: right; padding: 10px; font-weight: bold;">R$ ${item.valorTotal.toFixed(2).replace(".",",")}</td>
            </tr>
        `).join('');
    };

    const criaHTMLPdf = async () => {
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
                .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                .logo { width: 150px; height: auto; }
                .info-empresa { text-align: right; }
                .titulo { background-color: #f0660a; color: white; padding: 15px; text-align: center; font-size: 20px; margin: 20px 0; border-radius: 5px; }
                .dados-orcamento { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th { background-color: #2a2a2a; color: white; padding: 10px; text-align: left; }
                td { padding: 8px; }
                .total { font-weight: bold; text-align: right; font-size: 16px; margin-top: 10px; }
                .footer { margin-top: 30px; font-size: 12px; text-align: center; color: #777; }
            </style>
        </head>
        <body>
            <div class="header">
                <img class="logo" src="https://i.imgur.com/9Hv8LYj.png" alt="Logo G&M Moto Peças"/>
                <div class="info-empresa">
                    <h2>G & M Moto Peças</h2>
                    <p>CNPJ: 55.744.795/0001-34</p>
                    <p>Contato: (11) 9 6564-0477</p>
                </div>
            </div>
            
            <div class="titulo">
                ORÇAMENTO Nº ${orcamento.orcamentoId}
            </div>
            
            <div class="dados-orcamento">
                <p><strong>Data:</strong> ${moment(orcamento.data).format("DD/MM/YYYY")}</p>
                <p><strong>Válido até:</strong> ${moment(orcamento.data).add(30, 'days').format("DD/MM/YYYY")}</p>
                <p><strong>Cliente:</strong> ${orcamento.cliente || 'Não informado'}</p>
                <p><strong>Vendedor:</strong> ${orcamento.user}</p>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th style="text-align: center;">Qtd</th>
                        <th style="text-align: right;">Val. Unit.</th>
                        <th style="text-align: center;">Desc.</th>
                        <th style="text-align: right;">Val. Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${listagemProdutos()}
                </tbody>
            </table>
            
            <div class="total">
                TOTAL: R$ ${valorTotal.toFixed(2).replace(".",",")}
            </div>
            
            <div class="footer">
                <p>Obrigado por escolher G&M Moto Peças!</p>
                <p>Este orçamento é válido por 30 dias a partir da data de emissão.</p>
            </div>
        </body>
        </html>
        `;
        
        setHtml(htmlContent);
    };

    const gerarPDF = async () => {
        setLoading(true);
        try {
            const options = {
                html: html,
                fileName: `GeM_Orcamento_${orcamento.orcamentoId}_${moment().format("DDMMYYYYHHmm")}`,
                directory: 'Documents',
            };
            
            const file = await RNHTMLtoPDF.convert(options);
            
            const shareOptions = {
                title: 'Orçamento G&M Moto Peças',
                message: `G&M Orçamento Nº ${orcamento.orcamentoId}`,
                url: `file://${file.filePath}`,
                type: 'application/pdf',
                subject: `Orçamento ${orcamento.orcamentoId}`,
            };
            
            await Share.open(shareOptions);
        } catch (error) {
            console.log('Erro:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Cabeçalho */}
                <View style={styles.header}>
                    <Image style={styles.logo} source={imgLogo} resizeMode="contain" />
                    <View style={styles.infoEmpresa}>
                        <Text style={styles.empresaNome}>G & M Moto Peças</Text>
                        <Text style={styles.empresaInfo}>CNPJ: 55.744.795/0001-34</Text>
                        <Text style={styles.empresaInfo}>Contato: (11) 9 6564-0477</Text>
                    </View>
                </View>

                {/* Título */}
                <View style={styles.tituloContainer}>
                    <Text style={styles.titulo}>ORÇAMENTO Nº {orcamento.orcamentoId}</Text>
                </View>

                {/* Dados do Orçamento */}
                <View style={styles.dadosContainer}>
                    <View style={styles.dadosRow}>
                        <Icon name="calendar-alt" size={14} color="#f0660a" />
                        <Text style={styles.dadosText}>Data: {moment(orcamento.data).format("DD/MM/YYYY")}</Text>
                    </View>
                    <View style={styles.dadosRow}>
                        <Icon name="clock" size={14} color="#f0660a" />
                        <Text style={styles.dadosText}>Válido até: {moment(orcamento.data).add(30, 'days').format("DD/MM/YYYY")}</Text>
                    </View>
                    {orcamento.cliente && (
                        <View style={styles.dadosRow}>
                            <Icon name="user" size={14} color="#f0660a" />
                            <Text style={styles.dadosText}>Cliente: {orcamento.cliente}</Text>
                        </View>
                    )}
                    <View style={styles.dadosRow}>
                        <Icon name="user-tie" size={14} color="#f0660a" />
                        <Text style={styles.dadosText}>Vendedor: {orcamento.user}</Text>
                    </View>
                </View>

                {/* Lista de Produtos */}
                <View style={styles.produtosHeader}>
                    <Text style={[styles.produtosHeaderText, {flex: 4}]}>Produto</Text>
                    <Text style={[styles.produtosHeaderText, {textAlign: 'center'}]}>Qtd</Text>
                    <Text style={[styles.produtosHeaderText, {textAlign: 'right'}]}>Unit.</Text>
                    <Text style={[styles.produtosHeaderText, {textAlign: 'center'}]}>Desc.</Text>
                    <Text style={[styles.produtosHeaderText, {textAlign: 'right'}]}>Total</Text>
                </View>

                {orcamento.produtos.map((item, index) => (
                    <View key={index} style={styles.produtoRow}>
                        <Text style={[styles.produtoText, {flex: 4}]}>{item.produtoNome}</Text>
                        <Text style={[styles.produtoText, {textAlign: 'center'}]}>{item.qtd}</Text>
                        <Text style={[styles.produtoText, {textAlign: 'right'}]}>R$ {item.valorUnitario.toFixed(2).replace(".",",")}</Text>
                        <Text style={[styles.produtoText, {textAlign: 'center'}]}>{item.desconto}%</Text>
                        <Text style={[styles.produtoText, {textAlign: 'right', fontWeight: 'bold'}]}>R$ {item.valorTotal.toFixed(2).replace(".",",")}</Text>
                    </View>
                ))}

                {/* Total */}
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>TOTAL:</Text>
                    <Text style={styles.totalValue}>R$ {valorTotal.toFixed(2).replace(".",",")}</Text>
                </View>

                {/* Rodapé */}
                <Text style={styles.footer}>
                    Obrigado por escolher G&M Moto Peças!
                </Text>
            </ScrollView>
            {/* <WebView
                source={{ html: html }}
                style={{ flex: 1, top:5, height:windowHeight-185, width:windowWidth }}
            /> */}
            {/* Botões */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={16} color="#f0660a" />
                    <Text style={styles.secondaryButtonText}>VOLTAR</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.button, styles.primaryButton]}
                    onPress={gerarPDF}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Icon name="file-pdf" size={16} color="#fff" />
                            <Text style={styles.primaryButtonText}>GERAR PDF</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 100
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        alignItems: 'center'
    },
    logo: {
        width: 100,
        height: 100
    },
    infoEmpresa: {
        alignItems: 'flex-end'
    },
    empresaNome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2a2a2a'
    },
    empresaInfo: {
        fontSize: 12,
        color: '#555'
    },
    tituloContainer: {
        backgroundColor: '#f0660a',
        padding: 15,
        borderRadius: 5,
        marginBottom: 20
    },
    titulo: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    dadosContainer: {
        marginBottom: 20
    },
    dadosRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    dadosText: {
        marginLeft: 10,
        color: '#333'
    },
    produtosHeader: {
        flexDirection: 'row',
        backgroundColor: '#2a2a2a',
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginBottom: 5,
        borderRadius: 3
    },
    produtosHeaderText: {
        color: 'white',
        fontWeight: 'bold',
        flex: 1
    },
    produtoRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
    },
    produtoText: {
        color: '#333',
        flex: 1
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc'
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f0660a'
    },
    footer: {
        marginTop: 30,
        textAlign: 'center',
        color: '#777',
        fontStyle: 'italic'
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '48%'
    },
    primaryButton: {
        backgroundColor: '#f0660a'
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#f0660a'
    },
    secondaryButtonText: {
        color: '#f0660a',
        fontWeight: 'bold',
        marginLeft: 10
    }
});

export default OrcamentoDetalhe;