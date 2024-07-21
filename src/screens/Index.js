import React, { useEffect, useState } from 'react';
import { 
    Text,
    View,
    Dimensions,
    StyleSheet,
    FlatList,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import { BuscarProdutosServer } from '../Models/ProdutosServerModel';

import ProdutoListagem from '../Components/ProdutoListagem';
import Bag from '../Components/Bag';

const Index = () => {

    const [ produtos, setProdutos ] = useState([])
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const [ itensBag , setItensBag ]= useState([])

    useEffect(() => {
        BuscarProdutosServer().then(res => {
            
            setProdutos(res.valor)
        })
        
    },[])



    const adicionarItemBag = (jsonItem) => {

        let i = JSON.parse(JSON.stringify(itensBag))

        const index = i.findIndex((el) => el.produtoId == jsonItem.produtoId)
        console.log("INDEX",index)
        if(index < 0){

            i.push(jsonItem)

        }else{

            i[index].qtd = parseInt(i[index].qtd)+parseInt(jsonItem.qtd)
            i[index].valorTotal = i[index].valorTotal+jsonItem.valorTotal
            

        } 
       
        setItensBag(i)
    }

    const MostraBag = () => {
        
        if(itensBag.length > 0){
            return(
                <Bag 
                    itensBag={itensBag}
                    countItens={itensBag.length}
                >
                    <View style={{ padding: 20 }}>
                        <Text>Conteúdo do BottomSheet</Text>
                        <Text>Arraste para cima para fechar.</Text>
                    </View>
                </Bag>

            )

        }
    }

    return (
        <View style={styles.container}>
            <View >
                <View style={{width:windowWidth,marginBottom:20, height:80,  alignItems:"center",  backgroundColor:"#4a4a4a", flexDirection:"row"}}>
                    <View style={{ marginLeft:10, marginTop:20, width:windowWidth-80}}>
                        <Text style={{ fontWeight:"bold", color:"#ffff"}}>Olá Vinicius</Text>
                    </View>
                    <TouchableOpacity style={{ marginLeft:10, marginTop:20, width: 80}}>
                        <Text style={{ fontWeight:"bold", color:"#ffff"}}>Busca</Text>
                    </TouchableOpacity>
                    
                </View>

            </View>
            <View style={{  backgroundColor:"red", position:"absolute",zIndex:2, top:80, height:120, right:0}}>
                <View style={{  height:100, width:windowWidth-40}}>
                    <Text>asdas</Text>
                </View>
                

            </View>
            <View style={{height:windowHeight-140}}>
                <FlatList 
                    data={ produtos }
                    ListEmptyComponent={
                        <Text style={{color:"#fff"}}>Sem tarefas</Text>
                    }
                    renderItem={ ({ item, index }) => {
                        return (
                                <ProdutoListagem 
                                    item={item}
                                    callback={(jsonItem) => adicionarItemBag(jsonItem)}
                                />
                        )
                    }}
                />
            </View>

            {
                MostraBag()
            }
            
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
        
    },
})


export default Index