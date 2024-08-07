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

            <View style={{ height: 200, marginTop: 10, backgroundColor:"red" }}>
                
                <FlatList 
                    data={pagamentos}
                    renderItem={({ item }) => {
                        
                        
                        const valor = `${item.valor.toFixed(2)}`.replace(".",",")
                        return(
                            <View style={{ marginTop: 10}} >
                                <View style={{flexDirection:"row"}}>
                                    <View style={{ width:windowWidth/4 }}>
                                        <Text>Metodo</Text>
                                    </View>
                                    <View style={{ width:windowWidth/4 }}>
                                        <Text>{item.metodo}</Text>
                                    </View>
                                    <View style={{ width:windowWidth/4 }}>
                                        <Text>Valor</Text>
                                    </View>
                                    <View style={{ width:windowWidth/4 }}>
                                        <Text>R$ {valor}</Text>
                                    </View>
                                    
                                </View>
                                
                            </View>
                        )
                    }}
                />
                <Text>Total: R$ {`${todal.toFixed(2)}`.replace(".",",")}</Text>
            </View>
        )

    }

}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default TabelaPagamentos

