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

const Bag = ({  itensBag }) => {
    
    const height = useSharedValue(0);
	const [expanded, setExpanded] = useState(true);

    const tamanhoAbertura = windowHeight - 200


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

        
            <TouchableOpacity style={{ 
						alignItems:"center",
                        justifyContent:"center"
                    // width:windowWidth, 
                    //height:30,
                    //backgroundColor:"blue"
                }}
                onPress={() => { showContent() }}
            >
                <View style={{backgroundColor:"#4a4a4a",flex:1,alignItems:"center",
                        justifyContent:"center", width:windowWidth, height:30, borderTopLeftRadius:10, borderTopRightRadius:10}}>
                    <Text style={{fontSize:30, color:"#ffff", fontWeight:"bold"}}>-</Text>
                </View>
            </TouchableOpacity>
       
        <Animated.View style={[{ width: windowWidth,  color:"#bfbfbf" },hh]}>
            <ScrollView 
                nestedScrollEnabled={true}>
                    <View style={{ backgroundColor:"#ebebeb", height:tamanhoAbertura, width:windowWidth}}>
                        <View style={{ height:tamanhoAbertura-50}}>
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
                                    <Text style={{color:"#fff"}}>Sem tarefas</Text>
                                }
                                renderItem={ ({ item, index }) => {
                                    console.log(item)
                                    
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
                        </View>
                        <View style={{ alignItems:'center', justifyContent:"center"}}>
                            <TouchableOpacity>
                                <Text>Finalizar venda</Text>
                            </TouchableOpacity>
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