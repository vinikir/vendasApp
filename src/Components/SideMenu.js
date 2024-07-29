import React, { useState, useRef, useEffect } from 'react';
import { View, Dimensions, Text, TouchableOpacity } from "react-native"

import Animated, { 
    set, 
    withSpring,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const SideMenuComponent = ({abreSideMenu}) => {

    const navigation = useNavigation()

    
    const width = useSharedValue(0);

    const hh = useAnimatedStyle(() => {
		return ({
			width:width.value
		} )
	})

    if(abreSideMenu){
        
        width.value = withTiming((windowWidth/3)*2, {
            duration: 500,
            
        });
    }else{
        width.value = withTiming(0, {
            duration: 500,
        });
    }

    const sair = () => {
        return navigation.navigate('Login')
    }

    const trocarSenha = () => {
        return navigation.navigate('TrocarSenha')
    }

    return (
        <Animated.View style={[{ height:windowHeight-80,zIndex:3,  backgroundColor:"#bfbfbf", position:"absolute", bottom:0, left:0 },hh]}>
            <View style={{ marginTop:10 , marginLeft:10}} >
                <TouchableOpacity onPress={() => trocarSenha()}>
                    <View>
                        <Text style={{color:"#000"}}>Trocar senha</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => sair()}>
                    <View>
                        <Text style={{color:"#000"}}>Sair</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Animated.View>
        
    )

}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default SideMenuComponent