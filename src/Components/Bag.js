import React, { useState, useRef, useEffect } from 'react';
import { View, Text, PanResponder, Dimensions, TouchableWithoutFeedback,ScrollView, TouchableOpacity, FlatList
 } from 'react-native';

 import Animated, { 
    set, 
    withSpring,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const Bag = ({  itensBag, countItens }) => {
    
    const height = useSharedValue(0);
	const [ expanded, setExpanded] = useState(true);
    const [ totalItens, setTotalItens ] = useState(0)
    const [ valorTotal, setValorTotal ] = useState("0,00")
    const [ chaveOrdeServico, setChaveOrdemServico ] = useState(false)
    useEffect(() => {
        calculaValorEQuantidade(itensBag)
    },[itensBag])

    const tamanhoAbertura = windowHeight - 200

    const calculaValorEQuantidade = async (itens) => {
        let v = 0
        let it = 0
        let c = false
        for (let index = 0; index < itens.length; index++) {
            const element = itens[index];
            it = it +   parseInt(element.qtd)
            v = v + element.valorTotal

            if(element.tipo == "servico"){
                c = true
            }

        }

        let preco2 = `${v.toFixed(2)}`

        preco2 = preco2.replace('.', ',')
        setValorTotal(preco2)
        setTotalItens(it)
        setChaveOrdemServico(c)

    } 


	const hh = useAnimatedStyle(() => {
		return ({
			height:height.value
		} )
	})

    const showContent = () => {
		//t()
		if(expanded){
			
			height.value = withTiming(0, {
				duration: 500,
			  });
			
			setExpanded(false)
			
		}else{
			
			height.value = withTiming(tamanhoAbertura, {
				duration: 500,
				
			});
			
			setExpanded(true)
			
		}
	};

    const tamanhoColuna = (windowWidth-10)/6

    return (
        <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >

        
            <TouchableOpacity style={{ alignItems:"center", justifyContent:"center" }}
                onPress={() => { showContent() }}
            >
                <View style={{backgroundColor:"#4a4a4a", flexDirection:"row", flex:1,alignItems:"center",justifyContent:"center", width:windowWidth, height:30, borderTopLeftRadius:10, borderTopRightRadius:10}}>
                    <Text style={{fontSize:30, color:"#ffff", fontWeight:"bold"}}>-</Text>
                    <View style={{position:"absolute", right:10}}>
                        
                        <View style={{marginTop:-25, height:30, width:30, alignItems:"center", justifyContent:"center",flex:1,  backgroundColor:"red", borderRadius:50}}>
                            <Text style={{ color:"#ffff", fontWeight:"bold"}}>{countItens}</Text>
                        </View>
                        
                    </View>
                </View>
               
            </TouchableOpacity>
       
        <Animated.View style={[{ width: windowWidth,  color:"#bfbfbf" },hh]}>
            <ScrollView 
                nestedScrollEnabled={true}>
                    <View style={{ backgroundColor:"#ebebeb", height:tamanhoAbertura, width:windowWidth}}>
                        <View style={{ height:tamanhoAbertura-120}}>
                            <View style={{ width:windowWidth-10,Height:40,justifyContent:"center", alignItems:"center", marginLeft:5, marginRight:5, flexDirection:"row" }}>
                                <View style={{width:tamanhoColuna*3 }}>
                                    <Text style={{fontWeight:"bold" }}>Produto</Text>
                                </View>
                                <View style={{width:tamanhoColuna , alignItems:'center'}}>
                                    <Text style={{fontWeight:"bold" }}>Qtd</Text>
                                </View>
                                <View style={{width:tamanhoColuna , alignItems:'center' }}>
                                    <Text style={{fontWeight:"bold" }}>Valor</Text>
                                </View>
                                <View style={{width:tamanhoColuna ,alignItems:'center'}}>
                                    <Text style={{fontWeight:"bold" }}>Ação</Text>
                                </View>
                            </View>
                            <FlatList 
                                data={ itensBag }
                                ListEmptyComponent={
                                    <Text style={{color:"#fff"}}>Sem Itens</Text>
                                }
                                renderItem={ ({ item, index }) => {
                                    
                                    
                                    let preco = `${item.valorTotal.toFixed(2)}`

                                    preco = preco.replace('.', ',')
                                    
                                    return (
                                           <View style={{ flex:1, width:windowWidth-10,minHeight:40,justifyContent:"center", alignItems:"center", marginLeft:5, marginRight:5, flexDirection:"row" }}>
                                                <View style={{width:tamanhoColuna*3 }}>
                                                    <Text>{item.produtoNome}</Text>
                                                </View>
                                                <View style={{width:tamanhoColuna , alignItems:'center'}}>
                                                    <Text>{item.qtd}</Text>
                                                </View>
                                                <View style={{width:tamanhoColuna , alignItems:'center' }}>
                                                    <Text>{preco}</Text>
                                                </View>
                                                <View style={{width:tamanhoColuna ,alignItems:'center'}}>
                                                    <Text>X</Text>
                                                </View>
                                            </View>
                                    )
                                }}
                            />
                            <View style={{marginLeft:5}}>
                                <View>
                                    <Text>Valor Total: R$ {valorTotal}</Text>
                                </View>
                                <View>
                                    <Text>Quantidade de itens: {totalItens}</Text>
                                </View>

                            </View>
                        </View>
                        <View style={{ alignItems:'center', justifyContent:"center" }}>
                            <TouchableOpacity style={{ backgroundColor:"blue", height:40, width:windowWidth - 120, borderRadius:20, alignItems:"center", justifyContent:"center", marginBottom:20}}>
                                <Text style={{ color:"#ffff", fontWeight:"bold"}}>Finalizar venda</Text>
                            </TouchableOpacity>
                            {
                                chaveOrdeServico && (
                                    <TouchableOpacity style={{ backgroundColor:"blue", height:40, width:windowWidth - 120, borderRadius:20, alignItems:"center", justifyContent:"center"}}>
                                        <Text style={{ color:"#ffff", fontWeight:"bold"}}>Finalizar venda com ordem de serviço</Text>
                                    </TouchableOpacity>
                                )
                            }
                         
                        </View>
                    </View>
              
            </ScrollView>
        </Animated.View>
      </View>
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
  
export default Bag;