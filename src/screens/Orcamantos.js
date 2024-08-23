
import React, { useEffect, useState,useContext } from 'react';

import { 
    Text, 
    View,
    FlatList,
    Dimensions,
    StyleSheet
} from "react-native"
import { BuscaOrcamentoServer } from '../Models/OrcamentosServer';
import ListagemOrcamento from '../Components/ListagemOrcamento';
import Botao from '../Components/Botao';
const Orcamentos = ({navigation}) => {
    const [ orcamentos, setOrcamentos] = useState([])

    useEffect(() => {
        BuscaOrcamentoServer().then((res) => {
            
            if(res.erro == false){
                setOrcamentos(res.valor)
            }
        }).catch((er) => {
            console.log("er", er)
        })
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.viewFlatList}>
                <FlatList 
                
                    data={ orcamentos }
                    ListEmptyComponent={
                        <Text style={{color:"#fff"}}>Sem Itens</Text>
                    }
                    renderItem={ ({ item, index }) => {
                        return(
                            <ListagemOrcamento 
                                item={item}
                            />
                        )
                    }}
                />
            </View>
            <View style={styles.viewBotao}>
                <Botao 
                    label="Voltar"
                    callback={() => navigation.goBack()}
                    backgroundColor="blue"
                />
            </View>
            
        </View>
    )

}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        width: windowWidth,
        backgroundColor:"#4a4a4a"
    },
    viewFlatList:{
        height:windowHeight-80,
        marginTop:10
        
    },
    viewBotao:{
        height: 50,
        justifyContent:"center", 
        alignItems:"center",
        
    }
})
export default Orcamentos