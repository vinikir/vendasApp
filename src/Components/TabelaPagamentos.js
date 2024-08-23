import React, { useState }  from 'react';
import {
	StyleSheet,
	View,
	Text,
    Modal,
    Pressable,
    Dimensions,
    TextInput,
    FlatList
} from 'react-native';

const TabelaPagamentos = ({pagamentos }) => {

    if(pagamentos.length > 0 ){

        let todal = 0.0
        for (let index = 0; index < pagamentos.length; index++) {
            const element = pagamentos[index];
            todal = todal + element.valor
        }

        return (

            <View style={{backgroundColor:"#4a4a4a", height: windowHeight/4, width:windowWidth-20,}}>
                <View style={{height: windowHeight/4-30, width:windowWidth-20, marginBottom:10}}>
                    <FlatList 
                        data={pagamentos}
                        renderItem={({ item }) => {
                            
                            
                            const valor = `${item.valor.toFixed(2)}`.replace(".",",")
                            return(
                                <View style={{ marginTop: 10, borderBottomWidth:1,borderBottomColor:"#707070"}} >
                                    <View style={{flexDirection:"row"}}>
                                        <View style={{ width:windowWidth/4 }}>
                                            <Text style={{ color:"#FFF"}}>Metodo</Text>
                                        </View>
                                        <View style={{ width:windowWidth/4 }}>
                                            <Text style={{ color:"#FFF"}}>{item.metodo}</Text>
                                        </View>
                                        <View style={{ width:windowWidth/4 }}>
                                            <Text style={{ color:"#FFF"}}>Valor</Text>
                                        </View>
                                        <View style={{ width:windowWidth/4 }}>
                                            <Text style={{ color:"#FFF"}}>R$ {valor}</Text>
                                        </View>
                                        
                                    </View>
                                    
                                </View>
                            )
                        }}
                    />
                </View>
                <View>
                    <Text style={{ color:"#FFF"}} >Total Pago: R$ {`${todal.toFixed(2)}`.replace(".",",")}</Text>
                </View>
                
            </View>
        )

    }

}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default TabelaPagamentos

