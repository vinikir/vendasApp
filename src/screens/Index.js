import React, { useEffect,useMemo, useState,useContext } from 'react';
import { 
    Text,
    View,
    Dimensions,
    StyleSheet,
    FlatList,
    StatusBar,
    TouchableOpacity,
    TextInput,
    RefreshControl
} from 'react-native';
import { BuscarProdutosServer } from '../Models/ProdutosServerModel';
import RadioGroup from 'react-native-radio-buttons-group';
import ProdutoListagem from '../Components/ProdutoListagem';
import Bag from '../Components/Bag';
import { AuthContext } from '../Contexts/auth';

const Index = () => {

    const [ produtos, setProdutos ] = useState([])
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const [ itensBag , setItensBag ]= useState([])
    const [ busca, setBusca ] = useState("")
    const [selectedId, setSelectedId] = useState();
    const [ buscaVisivel, setBuscaVisivel ] = useState(false)
    const [refreshing, setRefreshing] = useState(false); 

    const { userInfos } = useContext( AuthContext )

    useEffect(() => {
        BuscarProdutosServer().then(res => {
            
            setProdutos(res.valor)
        })
        
    },[])

    const onRefresh = async () => {
        BuscarProdutosServer().then(res => {
            
            setProdutos(res.valor)
        })
    };

    const radioButtons = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Serviço',
            value: 'option1'
        },
        {
            id: '2',
            label: 'Peças',
            value: 'option2'
        },
        {
            id: '3',
            label: 'Todos',
            value: 'option2'
        }
    ]), []);



    const adicionarItemBag = (jsonItem) => {

        let i = JSON.parse(JSON.stringify(itensBag))

        const index = i.findIndex((el) => el.produtoId == jsonItem.produtoId)
       
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
                />
                   

            )

        }
    }

    const BuscarComFiltro = () => {
        let tipoItem 

        if(selectedId == 1 ){
            tipoItem = "servico"
        }

        if(selectedId == 2 ){
            tipoItem = "venda"
        }

        BuscarProdutosServer(busca, tipoItem).then(res => {
            setProdutos(res.valor)
        })
    }

    const ComponentBusca = () => {
        if(buscaVisivel == true){
            return(
                <View style={{  backgroundColor:"#757575", position:"absolute",zIndex:2, top:80, height:120, right:0}}>
                    <View style={{  height:100, width:windowWidth-40}}>
                        <View>
                            <RadioGroup 
                                layout="row"
                                radioButtons={radioButtons} 
                                onPress={setSelectedId}
                                selectedId={selectedId}
                            />
                        </View>
                        <View style={{ marginLeft:10, marginTop:5}}>
                            <TextInput 
                                style={ {

                                    backgroundColor:"#fff",
                                    width: windowWidth-90,
                                
                                    paddingLeft:2,
                                    paddingRight:2,
                                    height:35 ,
                                    color:"rgba(0, 0, 0, 0.6)"
                                }}
                                onChangeText={(tex) => setBusca(tex) }
                                value={busca}
                                placeholderTextColor="rgba(0, 0, 0, 0.6)"
                            
                            />
                        </View>
                        <View style={{ marginLeft:10, flexDirection:"row", marginTop:10}}>
                            <TouchableOpacity onPress={() => {
                                BuscarComFiltro()
                            }} style={{ backgroundColor:"green", marginRight:25, height:30, width:150, alignItems:"center", justifyContent:"center", borderRadius:10}}>
                                <View >
                                    <Text style={{ color:"#ffff"}}>Buscar</Text> 
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setBuscaVisivel(false)} style={{ backgroundColor:"red", height:30, width:150, alignItems:"center", justifyContent:"center", borderRadius:10}}>
                                <View >
                                    <Text style={{ color:"#ffff"}}>Fechar</Text> 
                                </View>
                            </TouchableOpacity>
                            
                        </View>

                    </View>
                    
                    

                </View>
            )
        }
    }

    return (
        <View style={styles.container}>
            <View >
                <View style={{width:windowWidth,marginBottom:20, height:80,  alignItems:"center",  backgroundColor:"#4a4a4a", flexDirection:"row"}}>
                    <View style={{ marginLeft:10, marginTop:20, width:windowWidth-80}}>
                        <Text style={{ fontWeight:"bold", color:"#ffff"}}>Olá {userInfos.Nome}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setBuscaVisivel(true)} style={{ marginLeft:10, marginTop:20, width: 80}}>
                        <Text style={{ fontWeight:"bold", color:"#ffff"}}>Busca</Text>
                    </TouchableOpacity>
                    
                </View>

            </View>
            {
                ComponentBusca()
            }
            
            <View style={{height:windowHeight-140}}>
                <FlatList 
                    data={ produtos }
                    ListEmptyComponent={
                        <Text style={{color:"#fff"}}>Sem itens</Text>
                    }
                    renderItem={ ({ item, index }) => {
                        return (
                                <ProdutoListagem 
                                    item={item}
                                    callback={(jsonItem) => adicionarItemBag(jsonItem)}
                                />
                        )
                    }}
                    refreshControl={
                        <RefreshControl
                            colors={["#9Bd35A", "#689F38"]}
                            refreshing={refreshing}
                            onRefresh={onRefresh} 
                        />
                    }
                    vertival={true}
                    showsVerticalScrollIndicator={false}
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