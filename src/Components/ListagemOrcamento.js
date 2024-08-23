import { 
    Text, 
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from "react-native"
import { useNavigation } from '@react-navigation/native';

import moment from "moment"

const ListagemOrcamento = ({item}) => {
    
    const data = moment(item.data).format("DD/MM/YYYY")
    const navigation = useNavigation()
    let valorTotal = 0

    for (let index = 0; index < item.produtos.length; index++) {
        const element = item.produtos[index];
        
        valorTotal+= element.valorTotal
    }


    const redirecionar = () => {
        return navigation.navigate("OrcamentoDetalhe", {orcamento:item})
    }
    return (
        <View>
            <View style={{ marginBottom:10, width:windowWidth, alignItems:"center" }} >
                <TouchableOpacity 
                    onPress={() => redirecionar()}
                    style={ styles.card }
                >   
                <View style={styles.subCard}>
                    <View style={{ flexDirection:"row"}}>
                        <View>
                            <Text style={ styles.text }>Nº {item.orcamentoId}</Text>
                        </View>
                        <View style={{ marginLeft:20}}>
                            <Text style={ styles.text }>Status: {item.status}</Text>
                        </View>
                    </View>
                  
                    <View>
                        <Text style={ styles.text }>Data do orçamento: {data}</Text>
                    </View>
                    <View>
                        <Text style={ styles.text }>Vendedor: {item.user}</Text>
                    </View>
                    <View>
                        <Text style={ styles.text }>Cliente: </Text>
                    </View>
                    <View>
                        <Text style={ styles.text }>Valor: {`${valorTotal.toFixed(2)}`.replace(".",",")}</Text>
                    </View>
                </View>
                    
                </TouchableOpacity>
            </View>
        </View>
    )

}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    
	
	subCard:{
        width: windowWidth-35,
        
    },  
    card:{
        backgroundColor: "#4a4a4a",
        height:120, 
        flexDirection: 'row',        
        borderWidth:1,
		borderBlockColor:"#707070",
		borderRadius:10,
		alignItems:"center",
        justifyContent:"center",
		width: windowWidth-18,
		elevation:5,
    },
    text:{
        color:"#fff"
    }
	
	
});

export default ListagemOrcamento